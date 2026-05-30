import os
import ast
import pandas as pd

def parse_genres(genres_str):
    """
    Parses a stringified list of dictionaries (from Kaggle metadata)
    and extracts space-separated genre names.
    """
    if pd.isna(genres_str) or not isinstance(genres_str, str):
        return ""
    try:
        # Convert literal string list/dict to actual Python lists
        genres_list = ast.literal_eval(genres_str)
        # Extract names and join with space
        names = [g["name"].replace(" ", "") for g in genres_list if "name" in g]
        return " ".join(names)
    except Exception:
        return ""

def main():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(current_dir, "..", "data")
    raw_path = os.path.join(data_dir, "movies_metadata.csv")
    clean_path = os.path.join(data_dir, "movies_cleaned.csv")

    print("Checking for raw Kaggle dataset...")
    if not os.path.exists(raw_path):
        print(f"\n⚠️ Error: Could not find '{raw_path}'")
        print("Please download 'movies_metadata.csv' from Kaggle:")
        print("https://www.kaggle.com/datasets/rounakbanik/the-movies-dataset")
        print(f"And place it inside: {data_dir}\n")
        return

    print("Loading raw dataset (this might take a few seconds)...")
    # Load metadata, specifying low_memory=False to prevent warning messages
    df = pd.read_csv(raw_path, low_memory=False)

    print(f"Raw shape: {df.shape}")

    # 1. Drop rows with invalid/corrupted IDs
    df["id_numeric"] = pd.to_numeric(df["id"], errors="coerce")
    df = df.dropna(subset=["id_numeric"])
    df["id"] = df["id_numeric"].astype(int)

    # 2. Fill NA values in text columns to prevent issues
    df["title"] = df["title"].fillna("")
    df["tagline"] = df["tagline"].fillna("")
    df["overview"] = df["overview"].fillna("")

    # 3. Filter to popular movies to keep the search space fast and qualitative
    df["vote_count_numeric"] = pd.to_numeric(df["vote_count"], errors="coerce").fillna(0)
    popularity_threshold = 150
    df = df[df["vote_count_numeric"] >= popularity_threshold]

    print(f"Filtered to movies with vote count >= {popularity_threshold}. Shape: {df.shape}")

    # 4. Parse the JSON genres column
    print("Parsing genres column...")
    df["genres_clean"] = df["genres"].apply(parse_genres)

    # 5. Build final cleaned DataFrame matching existing schema
    cleaned_df = pd.DataFrame({
        "id": df["id"],
        "title": df["title"],
        "genres": df["genres_clean"],
        "tagline": df["tagline"],
        "overview": df["overview"]
    })

    # Drop any duplicate movie IDs
    cleaned_df = cleaned_df.drop_duplicates(subset=["id"])

    # Reset index
    cleaned_df = cleaned_df.reset_index(drop=True)

    print(f"Final cleaned shape: {cleaned_df.shape}")
    cleaned_df.to_csv(clean_path, index=False)
    print(f"Successfully saved clean movie dataset to: {clean_path}")

if __name__ == "__main__":
    main()
