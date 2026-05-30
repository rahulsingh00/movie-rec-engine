import os
import pandas as pd
from sentence_transformers import SentenceTransformer
from app.vector_store import VectorStore

def main():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(current_dir, "..", "data")
    movies_cleaned_csv = os.path.join(data_dir, "movies_cleaned.csv")

    if not os.path.exists(movies_cleaned_csv):
        print(f"⚠️ Error: Cleaned movie library '{movies_cleaned_csv}' not found. Run ingest_kaggle.py first.")
        return

    print("Loading cleaned movie dataset...")
    df = pd.read_csv(movies_cleaned_csv)
    print(f"Loaded {df.shape[0]} movies.")

    # Fill empty text columns
    df["overview"] = df["overview"].fillna("")
    df["tagline"] = df["tagline"].fillna("")
    df["genres"] = df["genres"].fillna("")

    # Build description string similar to TF-IDF nlp_features
    # We combine genres (weighted), tagline, and overview
    texts = (
        df["genres"] + " " + 
        df["genres"] + " " + 
        df["tagline"] + " " + 
        df["overview"]
    ).tolist()

    print("Initializing SentenceTransformer ('all-MiniLM-L6-v2')...")
    # This will download the model (~90MB) from Hugging Face on its first run
    model = SentenceTransformer("all-MiniLM-L6-v2")

    print("Encoding movie descriptions into 384-dimensional dense vectors...")
    embeddings = model.encode(texts, show_progress_bar=True, batch_size=64)

    print("Saving vectors to local store cache...")
    store = VectorStore()
    movie_ids = df["id"].tolist()
    store.save(embeddings, movie_ids)
    print("Done! Semantic embedding caching completed successfully.")

if __name__ == "__main__":
    main()
