from fastapi import FastAPI, Query, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sentence_transformers import SentenceTransformer
from app.recommender import MovieRecommender
from app.models import init_db, get_db, Rating
from app.vector_store import VectorStore
from app.evaluation import evaluate_models

app = FastAPI(
    title="Movie Recommendation Engine API",
    description="An educational API showcasing TF-IDF content similarity, SVD collaborative filtering, and Semantic Search.",
    version="1.2.0"
)

# Enable CORS for local frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instantiate recommender, vector store, and transformer globally
recommender = MovieRecommender()
vector_store = VectorStore()
encoder_model = None
cached_metrics = None

@app.on_event("startup")
def startup_event():
    global encoder_model
    # 1. Initialize SQLite Database tables
    init_db()
    # 2. Fit the SVD recommender using a database session
    db = next(get_db())
    try:
        recommender.fit_svd(db)
    finally:
        db.close()
        
    # 3. Load cached vector embeddings index for semantic search
    if vector_store.exists():
        vector_store.load()
        # Initialize encoder model (~90MB load)
        print("Loading SentenceTransformer ('all-MiniLM-L6-v2') for semantic search queries...")
        encoder_model = SentenceTransformer("all-MiniLM-L6-v2")
        print("SentenceTransformer loaded successfully.")
    else:
        print("\n⚠️ Warning: Semantic Search vector index not found on disk.")
        print("Run the embedding precomputation script to enable semantic search:")
        print("  python3 backend/app/embed_movies.py\n")

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

@app.get("/api/search/semantic")
def search_semantic(
    query: str = Query(None, description="Natural language search query string"),
    limit: int = Query(100, description="Max results to return")
):
    """
    Search movie overviews semantically using Sentence-Transformers dense embedding matches.
    """
    if not query:
        return recommender.get_movies_list()[:limit]

    # Fallback to keyword search if vectors are not cached
    if vector_store.vectors is None or encoder_model is None:
        print("⚠️ Semantic search index not loaded. Falling back to keyword match.")
        return recommender.search_movies(query)[:limit]

    try:
        # Convert text query into a 384-dimension vector embedding
        query_vector = encoder_model.encode(query)
        # Search index
        matches = vector_store.search(query_vector, top_k=limit)
        
        # Hydrate matching records
        results = []
        for movie_id, score in matches:
            movie_row = recommender.df[recommender.df["id"] == movie_id]
            if not movie_row.empty:
                movie_data = movie_row.iloc[0].to_dict()
                movie_data.pop("nlp_features", None)
                # Map similarity score
                movie_data["semantic_score"] = float(score)
                results.append(movie_data)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/recommend/{movie_id}")
def get_recommendations(
    movie_id: int, 
    user_id: int = Query(None, description="Active user ID for hybrid recommendations"),
    limit: int = Query(5, description="Number of recommendations to return")
):
    """
    Get recommended movies based on content similarity, optionally reranked with SVD collaborative ratings.
    """
    try:
        recommendations = recommender.get_recommendations(movie_id, user_id=user_id, limit=limit)
        if not recommendations and movie_id not in [m["id"] for m in recommender.get_movies_list()]:
            raise HTTPException(status_code=404, detail="Movie ID not found")
        return recommendations
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/evaluation/metrics")
def get_evaluation_metrics(db: Session = Depends(get_db)):
    """
    Computes and returns offline recommendation quality metrics (Precision@K, Recall@K, MAP)
    comparing Content-based, Collaborative Filtering (SVD), and Hybrid approaches.
    """
    global cached_metrics
    if cached_metrics is None:
        try:
            cached_metrics = evaluate_models(db)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    return cached_metrics

@app.get("/api/users")
def get_users(db: Session = Depends(get_db)):
    """
    Get a list of all unique user IDs present in the ratings database.
    """
    try:
        users = db.query(Rating.user_id).distinct().order_by(Rating.user_id).limit(100).all()
        return [u[0] for u in users]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class RatingSubmission(BaseModel):
    user_id: int = Field(..., description="ID of the user rating the movie")
    movie_id: int = Field(..., description="ID of the movie being rated")
    rating: float = Field(..., ge=1.0, le=5.0, description="Star rating value from 1.0 to 5.0")

@app.post("/api/ratings")
def submit_rating(payload: RatingSubmission, db: Session = Depends(get_db)):
    """
    Submit or update a movie rating for a user.
    Retrains the SVD model dynamically to incorporate the new feedback.
    """
    try:
        existing_rating = db.query(Rating).filter(
            Rating.user_id == payload.user_id,
            Rating.movie_id == payload.movie_id
        ).first()

        if existing_rating:
            existing_rating.rating = payload.rating
        else:
            new_rating = Rating(
                user_id=payload.user_id,
                movie_id=payload.movie_id,
                rating=payload.rating
            )
            db.add(new_rating)
        
        db.commit()

        # Retrain the SVD model to capture updated profiles
        recommender.fit_svd(db)

        # Invalidate cached evaluation metrics to force recalculation on next access
        global cached_metrics
        cached_metrics = None

        return {"status": "success", "message": "Rating saved and SVD model updated."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
