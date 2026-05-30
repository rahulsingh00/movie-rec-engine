# Epic 6: Evaluation Dashboard & Metrics

Introduce offline and online evaluation metrics to scientifically evaluate movie recommendation quality.

## Acceptance Criteria

- [ ] Implement mathematical calculations for:
  - **Precision@K**: How many of the recommended movies are relevant.
  - **Recall@K**: How many of the total relevant movies are recommended.
  - **Mean Average Precision (MAP)**: Quality of the ranked order of recommendations.
- [ ] Expose an API endpoint `GET /api/evaluation/metrics` to serve baseline metrics.
- [ ] Create a dedicated "Evaluation" tab in the frontend layout.
- [ ] Render interactive metric visualization charts (e.g. Precision/Recall curves) using simple HTML elements or a lightweight canvas library.

---

## 📐 Conceptual Guide & Background

To improve any machine learning system, we need concrete evaluation metrics. For ranking problems (like search and recommendations), we measure Precision and Recall at specific cutoff depths (like top-5 or top-10 recommended movies).

### Learn More
*   [Evaluating Recommendation Systems (Medium)](https://towardsdatascience.com/evaluating-recommendation-systems-mrr-map-ndcg-precision-recall-5896aa4775e)
*   [Metrics for Ranking (Wikipedia)](https://en.wikipedia.org/wiki/Evaluation_measures_(information_retrieval))
