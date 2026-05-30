# Epic 4: Collaborative Filtering Hybrid Sandbox

Implement a collaborative filtering module using user-movie rating profiles to construct a hybrid recommendations builder.

## Acceptance Criteria

- [ ] Generate a synthetic users database/JSON containing rating lists (values 1.0 to 5.0) for the movie library.
- [ ] Implement a Matrix Factorization / Singular Value Decomposition (SVD) algorithm (using standard library algorithms or `scipy`).
- [ ] Build a hybrid recommendation method combining content cosine similarity scores and collaborative predicted ratings:
  $$\text{Hybrid Score} = \alpha \cdot \text{Similarity Score} + (1 - \alpha) \cdot \text{Predicted User Rating}$$
- [ ] Update FastAPI REST endpoints to accept a `user_id` query parameter to serve personalized hybrid recommendations.
- [ ] Implement user selector in UI sidebar to test recommendations from different simulated profiles.

---

## 📐 Conceptual Guide & Background

Collaborative filtering estimates how much a target user will like a movie they haven't watched yet based on ratings from similar users. In standard matrix factorization:
*   The rating matrix $R$ of size $[U \times M]$ is factorized into user embeddings $P$ ($[U \times K]$) and movie embeddings $Q$ ($[M \times K]$).
*   The predicted rating is $\hat{R}_{u,i} = P_u \cdot Q_i^T$.

### Learn More
*   [Matrix Factorization for Recommenders](https://developers.google.com/machine-learning/recommendation/collaborative/matrix)
*   [SVD Recommender Systems (Medium)](https://towardsdatascience.com/singular-value-decomposition-svd-in-recommender-systems-for-beginners-3cb2963ad769)
