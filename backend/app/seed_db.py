import os
import pandas as pd
from app.models import init_db, SessionLocal, Rating

def main():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(current_dir, "..", "data")
    ratings_csv = os.path.join(data_dir, "ratings_small.csv")
    movies_cleaned_csv = os.path.join(data_dir, "movies_cleaned.csv")

    print("Initializing Database tables...")
    init_db()

    print("Verifying data files...")
    if not os.path.exists(ratings_csv):
        print(f"⚠️ Error: ratings_small.csv not found in {data_dir}")
        return
    if not os.path.exists(movies_cleaned_csv):
        print(f"⚠️ Error: movies_cleaned.csv not found in {data_dir}. Run ingest_kaggle.py first.")
        return

    # Load cleaned movie IDs so we filter ratings to matches only
    print("Loading active movie catalog...")
    movies_df = pd.read_csv(movies_cleaned_csv)
    active_movie_ids = set(movies_df["id"].tolist())
    print(f"Active movie catalog has {len(active_movie_ids)} movies.")

    # Load ratings_small.csv
    print("Loading ratings data...")
    ratings_df = pd.read_csv(ratings_csv)
    print(f"Total raw ratings found: {ratings_df.shape[0]}")

    # Clean and filter rating records
    ratings_df["movieId_numeric"] = pd.to_numeric(ratings_df["movieId"], errors="coerce")
    ratings_df["userId_numeric"] = pd.to_numeric(ratings_df["userId"], errors="coerce")
    ratings_df["rating_numeric"] = pd.to_numeric(ratings_df["rating"], errors="coerce")
    
    ratings_df = ratings_df.dropna(subset=["movieId_numeric", "userId_numeric", "rating_numeric"])
    
    ratings_df["movieId"] = ratings_df["movieId_numeric"].astype(int)
    ratings_df["userId"] = ratings_df["userId_numeric"].astype(int)
    ratings_df["rating"] = ratings_df["rating_numeric"]

    # Only keep ratings for movies we actually have in our library
    filtered_ratings = ratings_df[ratings_df["movieId"].isin(active_movie_ids)]
    print(f"Filtered to ratings corresponding to our active catalog. Rows remaining: {filtered_ratings.shape[0]}")

    print("Inserting ratings into SQLite (bulk operation)...")
    db = SessionLocal()
    try:
        # Clear existing ratings to allow re-seeding
        db.query(Rating).delete()
        db.commit()

        # Build list of Rating model instances
        records_to_insert = []
        for index, row in filtered_ratings.iterrows():
            records_to_insert.append(Rating(
                user_id=int(row["userId"]),
                movie_id=int(row["movieId"]),
                rating=float(row["rating"])
            ))
            
            # Batch commits every 10,000 records
            if len(records_to_insert) >= 10000:
                db.bulk_save_objects(records_to_insert)
                db.commit()
                records_to_insert = []
                print(f"Committed {index + 1} ratings...")

        if records_to_insert:
            db.bulk_save_objects(records_to_insert)
            db.commit()
            
        print("Database seeding completed successfully!")
    except Exception as e:
        db.rollback()
        print(f"❌ Error during database seed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    main()
