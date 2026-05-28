import os
import pandas as pd

def load_movie_dataset():
    """
    Loads the movie dataset from the CSV file and returns a cleaned pandas DataFrame.
    """
    # Resolve the path to the CSV file relative to this script
    current_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(current_dir, "..", "data", "movies.csv")
    
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Movie dataset not found at {csv_path}")
        
    df = pd.read_csv(csv_path)
    
    # Fill any null values with empty strings
    df["genres"] = df["genres"].fillna("")
    df["tagline"] = df["tagline"].fillna("")
    df["overview"] = df["overview"].fillna("")
    
    # Create a unified features string combining text columns for NLP analysis
    # We give more weight to genres by repeating them, then tagline and overview
    df["nlp_features"] = (
        df["genres"] + " " + 
        df["genres"] + " " + 
        df["tagline"] + " " + 
        df["overview"]
    )
    # Basic cleaning - lowercase everything
    df["nlp_features"] = df["nlp_features"].str.lower()
    
    return df
