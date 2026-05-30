# Epic 1: Backend ML & NLP Model

Implement the core NLP and recommendation algorithms in Python using `scikit-learn` and `pandas`.

## Status: ✅ Completed

## Acceptance Criteria

- [x] Load and clean a movie dataset (CSV format) including overviews, genres, taglines, and titles.
- [x] Implement text preprocessing (handling missing values, lowercasing, and basic cleaning).
- [x] Build a TF-IDF vectorizer to extract term frequencies and document frequencies.
- [x] Calculate the Cosine Similarity matrix for the entire dataset. *(Obsolete — Replaced by dynamic on-the-fly similarity computations in Epic 7)*
- [x] Expose an internal API/method `get_recommendations(movie_id, limit)` that retrieves the top $N$ closest movies based on cosine similarity scores.
- [x] Provide fallback logic if a requested movie is not found.

> [!NOTE]
> **Evolution of Specifications**: Calculating and pre-storing the full $N \times N$ similarity matrix in memory on startup (as originally designed in Epic 1) was rendered obsolete by **Epic 7 (Kaggle Scale Optimization)** to prevent memory exhaustion (OOM). We now perform dynamic sparse vector dot products on-the-fly.

---

## 🔍 Technical Deep Dive & Implementation

In our system, the NLP model is built on top of `pandas` for data structuring and `scikit-learn` (specifically `TfidfVectorizer` and `cosine_similarity`) for mathematical vector operations.

### 1. Data Cleaning and Synthesis
The CSV data contains missing fields. We fill empty values in `genres`, `tagline`, and `overview` to prevent Python from raising errors during vectorization.
To prioritize keyword matches from the **Genre** category over arbitrary terms in the plot overview, we duplicate the genre text in the final features string.
```python
# Weighted combination in app/data_loader.py
df["nlp_features"] = (
    df["genres"] + " " + 
    df["genres"] + " " + 
    df["tagline"] + " " + 
    df["overview"]
)
```

### 2. TF-IDF Calculation
Using `scikit-learn`'s `TfidfVectorizer(stop_words="english")`, the text is preprocessed and converted into a sparse matrix:
- **Tokenization**: Words are extracted.
- **Stopwords Filter**: Common words (e.g., 'the', 'is') are discarded.
- **Weighting**: Rare words receive higher weights, while common terms across all movie descriptions receive lower weights.

### 3. Similarity Matrix
A pairwise **Cosine Similarity** matrix is constructed. This results in a symmetrical shape of `[M x M]`, where `M` is the total number of movies. Cell `(i, j)` stores the cosine similarity score between Movie `i` and Movie `j`.

---

## 📚 Further Reading & Learning Resources

*   **Pandas DataFrames**: [Pandas Getting Started Guide](https://pandas.pydata.org/docs/getting_started/index.html)
*   **TF-IDF Vectorization**: [Scikit-learn TfidfVectorizer Reference](https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html)
*   **Cosine Similarity in Scikit-Learn**: [Scikit-learn Cosine Similarity Function](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise.cosine_similarity.html)
*   **Text Preprocessing Principles**: [Introduction to NLP Text Preprocessing (Medium)](https://medium.com/towards-data-science/nlp-text-preprocessing-a-practical-guide-and-template-d80874676e79)

