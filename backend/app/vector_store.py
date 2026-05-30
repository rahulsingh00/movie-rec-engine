import os
import json
import numpy as np

class VectorStore:
    def __init__(self):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        self.data_dir = os.path.join(current_dir, "..", "data")
        self.embeddings_path = os.path.join(self.data_dir, "movie_embeddings.npy")
        self.ids_path = os.path.join(self.data_dir, "movie_ids.json")
        
        self.vectors = None # Numpy array [N x D]
        self.movie_ids = [] # List of length N

    def exists(self) -> bool:
        """Checks if the cached vector index files exist on disk."""
        return os.path.exists(self.embeddings_path) and os.path.exists(self.ids_path)

    def save(self, vectors: np.ndarray, movie_ids: list):
        """Saves embeddings and movie IDs to disk."""
        os.makedirs(self.data_dir, exist_ok=True)
        # Ensure vectors is a float32 numpy array
        np.save(self.embeddings_path, np.array(vectors, dtype=np.float32))
        with open(self.ids_path, "w") as f:
            json.dump(movie_ids, f)
        
        self.vectors = vectors
        self.movie_ids = movie_ids
        print(f"Saved {len(movie_ids)} movie embeddings vectors to {self.embeddings_path}")

    def load(self):
        """Loads embeddings and movie IDs from disk."""
        if not self.exists():
            raise FileNotFoundError("Vector store index files not found. Run embed_movies.py first.")
        
        self.vectors = np.load(self.embeddings_path)
        with open(self.ids_path, "r") as f:
            self.movie_ids = json.load(f)
        print(f"Successfully loaded {len(self.movie_ids)} dense vectors from disk cache.")

    def search(self, query_vector: np.ndarray, top_k: int = 10) -> list:
        """
        Performs exact cosine similarity search over cached vectors.
        Returns a list of tuples: (movie_id, similarity_score)
        """
        if not isinstance(top_k, int):
            try:
                top_k = int(top_k.default)
            except Exception:
                top_k = 10

        if self.vectors is None or not self.movie_ids:
            return []
        
        # Normalize vectors and query_vector to perform fast dot-product cosine similarity
        norm_vectors = self.vectors / np.linalg.norm(self.vectors, axis=1, keepdims=True)
        norm_query = query_vector / np.linalg.norm(query_vector)

        # Dot product yields cosine similarity scores
        similarities = np.dot(norm_vectors, norm_query)

        # Get indices of top K similarity scores
        top_indices = np.argsort(similarities)[::-1][:top_k]

        results = []
        for idx in top_indices:
            results.append((
                int(self.movie_ids[idx]), 
                float(similarities[idx])
            ))
        return results
