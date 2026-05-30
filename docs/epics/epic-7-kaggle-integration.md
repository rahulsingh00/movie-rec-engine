# Epic 7: Kaggle Movie Dataset Integration & Scale Optimization

Integrate the Kaggle "The Movies Dataset" to replace the mock library, optimizing similarity calculations to prevent memory exhaustion (OOM).

## Status: ✅ Completed
## Priority: P1 (Recommended before Epic 4)

---

## 📋 Acceptance Criteria

- [x] Write a preprocessing CLI script to ingest Kaggle's raw `movies_metadata.csv`, drop corrupted rows, parse JSON columns (like `genres`), and filter the dataset to the top $M$ most popular movies (e.g. $M = 5,000$).
- [x] Refactor `data_loader.py` to load this optimized dataset instead of `movies.csv`.
- [x] Optimize similarity memory usage in `recommender.py` by removing the $N \times N$ precomputed matrix. Implement dynamic single-row similarity calculations on-the-fly:
  $$\text{Query Vector} \times \text{TF-IDF Sparse Matrix}^T$$
- [x] Ensure API response times for `/api/recommend/{movie_id}` remain under 100ms for 5,000 movies.
- [x] Update frontend autocomplete search to handle search query limits (prevent rendering thousands of items in the dropdown list).

---

## ⚖️ Pros & Cons of Implementation

### Pros (Why we should do it)
*   **Realism**: Recommending from 5,000+ popular, recognizable movies makes the application feel like a real product.
*   **Scalability Foundations**: Teaches you vector calculation performance optimizations (sparse matrices, dynamic scoring) that are essential for large-scale production services.
*   **Synergy with Collaborative Filtering (Epic 4)**: The Kaggle dataset includes a matching `ratings_small.csv` file. Integrating the movie catalog first makes SVD collaborative filtering implementation much cleaner because real user interactions are already provided.

### Cons & Drawbacks
*   **Startup & Query Latency**: Generating TF-IDF matrices for 5,000 movies will increase backend startup time from `< 0.1s` to `~1–3s`.
*   **Loss of Long-tail Movies**: Filtering the dataset to the top 5,000 popular movies to preserve RAM means smaller, niche indie films will be excluded.
*   **Data Ingestion Complexity**: Handing dirty metadata values and JSON structures inside CSV cells makes data loaders less readable compared to clean, tabular mocks.

---

## 📐 Conceptual Guide & Further Studies
*   **Dynamic Sparse Vector Math**: [Scipy Sparse Matrices (Official Documentation)](https://docs.scipy.org/doc/scipy/reference/sparse.html)
*   **Data Cleaning in Pandas**: [Pandas Handling Missing Data Tutorial](https://pandas.pydata.org/docs/user_guide/missing_data.html)
