from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.recommender import MovieRecommender

app = FastAPI(
    title="Movie Recommendation Engine API",
    description="An educational API showcasing NLP TF-IDF text vectorization and cosine similarity.",
    version="1.0.0"
)

# Enable CORS for local frontend dev server (default Vite port is 5173, but we allow all local origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For demo/local setup, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instantiate recommender on startup
recommender = MovieRecommender()

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Movie Recommendation Engine API is running. Visit /docs for swagger docs."
    }

@app.get("/api/movies")
def get_movies(query: str = Query(None, description="Search term for title, genre or overview")):
    """
    Get a list of movies, optionally filtered by a text search query.
    """
    try:
        return recommender.search_movies(query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/recommend/{movie_id}")
def get_recommendations(movie_id: int, limit: int = Query(5, description="Number of recommendations to return")):
    """
    Get recommended movies for a specific movie ID based on content similarity.
    """
    try:
        recommendations = recommender.get_recommendations(movie_id, limit=limit)
        if not recommendations and movie_id not in [m["id"] for m in recommender.get_movies_list()]:
            raise HTTPException(status_code=404, detail="Movie ID not found")
        return recommendations
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
