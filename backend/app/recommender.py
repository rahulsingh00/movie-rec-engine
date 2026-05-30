import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.data_loader import load_movie_dataset
from app.collaborative import SVDReranker

class MovieRecommender:
    def __init__(self):
        self.df = load_movie_dataset()
        self.vectorizer = TfidfVectorizer(stop_words="english")
        
        # Fit and transform the nlp_features to construct the TF-IDF matrix
        self.tfidf_matrix = self.vectorizer.fit_transform(self.df["nlp_features"])
        self.svd_reranker = None

    def fit_svd(self, db):
        """
        Trains or updates the collaborative SVD matrix factorization model.
        """
        try:
            self.svd_reranker = SVDReranker(db)
        except Exception as e:
            print(f"⚠️ SVD Training failed: {e}")
            self.svd_reranker = None
        
    def get_movies_list(self):
        """
        Returns a list of all movies with basic info (id, title, genres, tagline) for the frontend list.
        """
        return self.df[["id", "title", "genres", "tagline", "overview"]].to_dict(orient="records")

    def search_movies(self, query: str):
        """
        Performs a simple text search across title, genre, or description.
        """
        if not query:
            return self.get_movies_list()
        
        query = query.lower()
        mask = (
            self.df["title"].str.lower().str.contains(query) |
            self.df["genres"].str.lower().str.contains(query) |
            self.df["overview"].str.lower().str.contains(query)
        )
        return self.df[mask][["id", "title", "genres", "tagline", "overview"]].to_dict(orient="records")
        
    def get_recommendations(self, movie_id: int, user_id: int = None, limit: int = 5):
        """
        Given a movie ID, calculate its cosine similarity scores against all other movies.
        If a user_id is provided, rerank the top content matches using SVD collaborative scores.
        """
        # Find index of movie with matching ID
        matching_indices = self.df.index[self.df["id"] == movie_id].tolist()
        if not matching_indices:
            return []
            
        movie_idx = matching_indices[0]
        
        # Fetch similarity scores for this movie dynamically on-the-fly
        scores = cosine_similarity(self.tfidf_matrix[movie_idx], self.tfidf_matrix).flatten()
        similarity_scores = list(enumerate(scores))
        
        # Sort by similarity score descending, skipping the movie itself
        sorted_scores = sorted(
            [item for item in similarity_scores if item[0] != movie_idx],
            key=lambda x: x[1],
            reverse=True
        )
        
        # Two-stage recommender logic:
        # If user_id is provided, retrieve top 50 content candidates and rerank using SVD ratings
        if user_id is not None and self.svd_reranker is not None:
            candidates = sorted_scores[:50]
            recommendations = []
            
            for idx, content_score in candidates:
                movie_data = self.df.iloc[idx].to_dict()
                movie_id_val = int(movie_data["id"])
                
                # Predict rating (1.0 to 5.0 scale)
                predicted_rating = self.svd_reranker.predict_rating(user_id, movie_id_val)
                
                # Normalize predicted rating to [0.0, 1.0] scale
                normalized_rating = predicted_rating / 5.0
                
                # Compute balanced hybrid score (50% content, 50% collaborative)
                hybrid_score = (0.5 * float(content_score)) + (0.5 * normalized_rating)
                
                movie_data["similarity_score"] = float(content_score)
                movie_data["predicted_rating"] = float(predicted_rating)
                movie_data["hybrid_score"] = float(hybrid_score)
                movie_data.pop("nlp_features", None)
                recommendations.append(movie_data)
                
            # Sort final candidates list by hybrid score descending
            recommendations = sorted(recommendations, key=lambda x: x["hybrid_score"], reverse=True)
            return recommendations[:limit]
            
        else:
            # Traditional content-only ranking
            top_scores = sorted_scores[:limit]
            recommendations = []
            for idx, score in top_scores:
                movie_data = self.df.iloc[idx].to_dict()
                movie_data["similarity_score"] = float(score)
                # Ensure fields are present for API consistency
                movie_data["predicted_rating"] = 0.0
                movie_data["hybrid_score"] = float(score)
                movie_data.pop("nlp_features", None)
                recommendations.append(movie_data)
            return recommendations
