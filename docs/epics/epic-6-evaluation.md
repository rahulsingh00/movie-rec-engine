# Epic 6: Evaluation Dashboard & Metrics

Introduce offline and online evaluation metrics to scientifically evaluate movie recommendation quality.

## Acceptance Criteria

- [x] Implement mathematical calculations for:
  - **Precision@K**: How many of the recommended movies are relevant.
  - **Recall@K**: How many of the total relevant movies are recommended.
  - **Mean Average Precision (MAP)**: Quality of the ranked order of recommendations.
- [x] Expose an API endpoint `GET /api/evaluation/metrics` to serve baseline metrics.
- [x] Create a dedicated "Evaluation" tab in the frontend layout.
- [x] Render interactive metric visualization charts (Precision/Recall curves) using clean, responsive custom SVG components.

---

## 🛠️ Implementation Details

We designed and built a modular offline validation suite to evaluate recommendation paradigms:
- **Validation Splitting**: The ratings database is split dynamically using an 80/20 train/test split.
- **Algorithms Evaluated**:
  - **Content (TF-IDF)**: Computes user profiles from highly rated training movies, calculating Cosine Similarity to test movies.
  - **Collaborative (SVD)**: Fits a Scipy-sparse SVD model ($k=15$) on training interactions and predicts test ratings.
  - **Hybrid**: Blends Content similarities ($50\%$) and SVD predictions ($50\%$).
- **API Endpoint**: `GET /api/evaluation/metrics` in [main.py](file:///Users/rahulsingh/Work/movie-rec-engine/backend/app/main.py) caches metrics on startup/first load, invalidating the cache automatically whenever a user submits new ratings.
- **Frontend Dashboard**: Toggleable view with interactive SVG line charts mapping Precision/Recall convergence at $K \in \{1, 3, 5, 10\}$.

---

## 📐 Conceptual Guide & Background

To improve any machine learning system, we need concrete evaluation metrics. For ranking problems (like search and recommendations), we measure Precision and Recall at specific cutoff depths (like top-5 or top-10 recommended movies).

### Learn More
*   [Evaluating Recommendation Systems (Medium)](https://towardsdatascience.com/evaluating-recommendation-systems-mrr-map-ndcg-precision-recall-5896aa4775e)
*   [Metrics for Ranking (Wikipedia)](https://en.wikipedia.org/wiki/Evaluation_measures_(information_retrieval))
