# Epic 4: Collaborative Filtering Hybrid Sandbox

Implement a collaborative filtering module using user-movie rating profiles to construct a hybrid recommendations builder.

## Acceptance Criteria

- [ ] Set up a lightweight **SQLite database** using SQLAlchemy/SQLModel to store user profiles and rating transactions.
- [ ] Generate synthetic users and ratings data, seeding them directly into the SQLite database.
- [ ] Implement a Matrix Factorization / Singular Value Decomposition (SVD) algorithm (using standard library algorithms or `scipy`) that queries ratings from the database.
- [ ] Build a hybrid recommendation method combining content cosine similarity scores and collaborative predicted ratings:
  $$\text{Hybrid Score} = \alpha \cdot \text{Similarity Score} + (1 - \alpha) \cdot \text{Predicted User Rating}$$
- [ ] Update FastAPI REST endpoints to accept a `user_id` query parameter to query ratings from the SQLite DB and serve personalized hybrid recommendations.
- [ ] Implement a user selector in the UI sidebar to toggle profiles and dynamically submit rating stars (1–5) to write to the DB.

---

## 📐 Conceptual Guide & Background

### Why SQLite?
Instead of reading and writing user rating updates directly back to raw CSV or JSON files (which causes file lockups and slow disk operations), we introduce **SQLite**. SQLite stores the database as a single local file, requires no server installation, and enables rapid transactions when users rate movies in real-time.


Collaborative filtering estimates how much a target user will like a movie they haven't watched yet based on ratings from similar users. In standard matrix factorization:
*   The rating matrix $R$ of size $[U \times M]$ is factorized into user embeddings $P$ ($[U \times K]$) and movie embeddings $Q$ ($[M \times K]$).
*   The predicted rating is $\hat{R}_{u,i} = P_u \cdot Q_i^T$.

### Learn More
*   [Matrix Factorization for Recommenders](https://developers.google.com/machine-learning/recommendation/collaborative/matrix)
*   [SVD Recommender Systems (Medium)](https://towardsdatascience.com/singular-value-decomposition-svd-in-recommender-systems-for-beginners-3cb2963ad769)
