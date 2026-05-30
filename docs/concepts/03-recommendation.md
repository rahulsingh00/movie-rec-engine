# 🏛️ Recommendation System Paradigms

Recommendation systems are algorithms designed to suggest relevant items to users. They are categorized based on their underlying data sources and algorithmic strategies.

---

## 1. Content-Based Filtering (Used in CineMatch)

Recommends items based on the features/attributes of the items themselves.
*   **Core Logic**: Computes similarity scores between items. If a user likes Movie A, the system finds Movie B where features (genres, keywords, descriptions) are mathematically close to Movie A.
*   **Strengths**:
    *   **No Cold Start for Items**: New movies can be recommended immediately upon addition as long as metadata exists.
    *   **Transparency**: Recommends items for clear reasons (e.g., "Because you watched *Iron Man*, we recommend *The Avengers* due to the matching tags: Sci-Fi, Marvel").
*   **Weaknesses**:
    *   **Feature Dependency**: Requires rich, accurate metadata/text descriptions.
    *   **Low Serendipity**: Recommends items very similar to what the user already likes, creating a "filter bubble".

---

## 2. Collaborative Filtering

Recommends items by analyzing user behaviors, ratings, transactions, or preferences. It does not look at the features of the items themselves.
*   **User-Based CF**: Finds users with similar rating patterns and suggests items they liked (e.g., "Users who liked what you liked also watched...").
*   **Item-Based CF**: Finds items that are frequently co-rated or purchased together by the same users.
*   **Strengths**:
    *   **Serendipity**: Can suggest highly unexpected and diverse items since it relies on community trends rather than attribute matching.
    *   **No Domain Expertise Required**: Doesn't need complex text parsers or taggers; only ratings and user IDs.
*   **Weaknesses**:
    *   **Cold Start Problem**: Cannot suggest new items until they receive ratings, and cannot suggest to new users until they rate some items.
    *   **Sparsity**: Most users only rate a tiny fraction of items, making the user-item interaction matrix highly sparse.

---

## 3. Hybrid Recommender Systems (Next Steps)

Modern recommendation systems (like Netflix or YouTube) combine both approaches to eliminate their respective weaknesses.
*   **Feature Combination**: Train models on combined feature vectors containing both user demographics/interaction vectors and item metadata.
*   **Ensemble Models**: Run collaborative filtering and content-based filtering algorithms independently, then combine and rerank their outputs using a secondary machine learning model.

---

## 4. Deep Learning & Modern RecSys

State-of-the-art recommendation engines utilize neural networks to capture non-linear relationships:
*   **Matrix Factorization (SVD)**: Decomposes the user-item rating matrix into low-dimensional latent embeddings (vectors representing hidden user tastes and item qualities).
*   **Two-Tower Neural Networks**: Features one neural network "tower" to embed user context (demographics, history) and another "tower" to embed item features (video overview, thumbnail). The dot product of these two tower outputs represents the match score.

---

## 📚 Further Reading & Learning Resources

*   **Classic Textbook**: [Recommender Systems: The Textbook (Charu C. Aggarwal)](https://link.springer.com/book/10.1007/978-3-319-29659-3)
*   **Coursera Course**: [Recommender Systems Specialization (University of Minnesota)](https://www.coursera.org/specializations/recommender-systems)
*   **Netflix Prize Paper**: [Matrix Factorization Techniques for Recommender Systems (Koren et al.)](https://datajobs.com/data-science-repo/Recommender-Systems-[Netflix].pdf)
*   **System Design Guide**: [System Design for Recommender Systems (Medium)](https://towardsdatascience.com/system-design-for-recommender-systems-d944c68832a8)

