# 🏛️ Recommendation System Paradigms

Recommendation engines generally fall into two primary categories: Content-Based Filtering and Collaborative Filtering.

## 1. Content-Based Filtering
This model recommends items based on their features and characteristics.

*   **How it works**: If a user likes Movie A, the system looks at the properties of Movie A (genres, keywords, cast, overview, directors) and finds other movies with matching properties.
*   **NLP Connection**: We use TF-IDF and Cosine Similarity to compare text descriptions.
*   **Pros**:
    *   No "cold start" problem for new items (as long as they have metadata).
    *   Highly explainable ("Because you watched *Interstellar*, you might like...").
*   **Cons**:
    *   Can be limited in serendipity (only recommends items highly similar to what the user already knows).

## 2. Collaborative Filtering
This model recommends items based on the behavior, ratings, and preferences of other users.

*   **How it works**: If User A and User B have rated many movies similarly, and User A likes a new movie that User B hasn't watched yet, the system recommends that new movie to User B.
*   **Types**:
    *   **User-Based**: Find similar users.
    *   **Item-Based**: Find items that are rated similarly by the same users.
*   **Pros**:
    *   Can recommend unexpected items (highly serendipitous).
    *   Doesn't require item feature extraction or text understanding.
*   **Cons**:
    *   "Cold start" problem for new items (cannot recommend until someone rates it) and new users (cannot recommend until they rate some items).

---

### In This Project
We build a **Content-Based Recommender** using movie overviews, taglines, and genres. It provides a perfect playground for testing text processing, vector math, and ML metrics.
