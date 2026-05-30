import numpy as np
import pandas as pd
from scipy.sparse import csr_matrix
from scipy.sparse.linalg import svds
from sqlalchemy.orm import Session
from app.models import Rating

class SVDReranker:
    def __init__(self, db: Session, k: int = 15, ratings_list: list = None):
        self.k = k
        self.load_and_train(db, ratings_list)

    def load_and_train(self, db: Session, ratings_list: list = None):
        """
        Loads ratings from the database or ratings_list, builds user-movie interaction matrix,
        performs mean centering, and calculates singular value decomposition (SVD).
        """
        # 1. Fetch ratings
        if ratings_list is not None:
            ratings = ratings_list
        else:
            ratings = db.query(Rating).all()

        if not ratings:
            print("⚠️ No ratings found in database. SVD cannot be trained.")
            self.user_features = {}
            self.movie_features = {}
            self.global_mean = 3.5
            return

        # 2. Build pandas DataFrame for preprocessing
        data = {
            "user_id": [r.user_id for r in ratings],
            "movie_id": [r.movie_id for r in ratings],
            "rating": [r.rating for r in ratings]
        }
        df = pd.DataFrame(data)

        # Calculate global mean and user means
        self.global_mean = df["rating"].mean()
        self.user_means = df.groupby("user_id")["rating"].mean().to_dict()
        self.movie_means = df.groupby("movie_id")["rating"].mean().to_dict()

        # Map user_ids and movie_ids to matrix indices
        self.unique_users = sorted(df["user_id"].unique())
        self.unique_movies = sorted(df["movie_id"].unique())

        self.user_to_idx = {uid: idx for idx, uid in enumerate(self.unique_users)}
        self.movie_to_idx = {mid: idx for idx, mid in enumerate(self.unique_movies)}

        # Subtract user mean (mean centering) to handle user rating scale biases
        df["centered_rating"] = df.apply(
            lambda row: row["rating"] - self.user_means.get(row["user_id"], self.global_mean),
            axis=1
        )

        # 3. Create Sparse CSR matrix
        row_indices = [self.user_to_idx[uid] for uid in df["user_id"]]
        col_indices = [self.movie_to_idx[mid] for mid in df["movie_id"]]
        values = df["centered_rating"].values

        num_users = len(self.unique_users)
        num_movies = len(self.unique_movies)

        # Construct coordinate sparse matrix and convert to CSR format
        ratings_sparse = csr_matrix((values, (row_indices, col_indices)), shape=(num_users, num_movies))

        # 4. Perform SVD
        # k must be strictly less than the minimum dimension of the matrix
        actual_k = min(self.k, min(num_users, num_movies) - 1)
        if actual_k < 1:
            print("⚠️ Matrix dimensions too small for SVD. Falling back to baseline means.")
            self.user_features = {}
            self.movie_features = {}
            return

        print(f"Training SVD model with k={actual_k} latent factors...")
        # Compute SVD using scipy's sparse solver
        U, Sigma, Vt = svds(ratings_sparse, k=actual_k)

        # Re-construct user and item latent feature matrices
        self.user_features = U * np.sqrt(Sigma)
        self.movie_features = np.sqrt(Sigma).reshape(-1, 1) * Vt

        print("SVD model training completed.")

    def predict_rating(self, user_id: int, movie_id: int) -> float:
        """
        Predicts the rating (1.0 to 5.0 scale) that a user would give to a movie.
        """
        # Fallback to user mean or global mean if user or movie is unseen during SVD training
        user_idx = self.user_to_idx.get(user_id)
        movie_idx = self.movie_to_idx.get(movie_id)

        user_mean = self.user_means.get(user_id, self.global_mean)

        if user_idx is None or movie_idx is None:
            # If movie is known, blend user mean with movie mean deviation
            if movie_idx is not None:
                movie_mean = self.movie_means.get(movie_id, self.global_mean)
                return float(np.clip((user_mean + movie_mean) / 2.0, 1.0, 5.0))
            return float(user_mean)

        # Compute dot product of user latent vector and movie latent vector
        pred_delta = np.dot(self.user_features[user_idx], self.movie_features[:, movie_idx])
        
        # Add back user's baseline rating scale
        predicted_rating = user_mean + pred_delta

        # Clip predictions to valid star bounds [1.0, 5.0]
        return float(np.clip(predicted_rating, 1.0, 5.0))
