import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.data_loader import load_movie_dataset

class MovieRecommender:
    def __init__(self):
        self.df = load_movie_dataset()
        self.vectorizer = TfidfVectorizer(stop_words="english")
        
        # Fit and transform the nlp_features to construct the TF-IDF matrix
        self.tfidf_matrix = self.vectorizer.fit_transform(self.df["nlp_features"])
        
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
        
    def get_recommendations(self, movie_id: int, limit: int = 5):
        """
        Given a movie ID, calculate its cosine similarity scores against all other movies
        and return the top N matching records.
        """
        # Find index of movie with matching ID
        matching_indices = self.df.index[self.df["id"] == movie_id].tolist()
        if not matching_indices:
            return []
            
        movie_idx = matching_indices[0]
        
        # Fetch similarity scores for this movie dynamically on-the-fly
        scores = cosine_similarity(self.tfidf_matrix[movie_idx], self.tfidf_matrix).flatten()
        similarity_scores = list(enumerate(scores))

        
        # Sort by similarity score descending, skipping the movie itself (index movie_idx)
        sorted_scores = sorted(
            [item for item in similarity_scores if item[0] != movie_idx],
            key=lambda x: x[1],
            reverse=True
        )
        
        # Keep top N scores
        top_scores = sorted_scores[:limit]
        
        recommendations = []
        for idx, score in top_scores:
            movie_data = self.df.iloc[idx].to_dict()
            # Convert numpy types to native Python type float for JSON serialization
            movie_data["similarity_score"] = float(score)
            # Remove nlp_features from result to reduce payload size
            movie_data.pop("nlp_features", None)
            recommendations.append(movie_data)
            
        return recommendations
