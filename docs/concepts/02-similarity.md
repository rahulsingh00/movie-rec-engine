# 📐 Vector Spaces & Cosine Similarity

Once we convert movie descriptions into numerical TF-IDF vectors, each movie is represented as a point in a high-dimensional vector space. To recommend similar movies, we calculate the mathematical similarity between these vectors.

## Cosine Similarity

Instead of measuring the straight-line distance (Euclidean distance) between two movie vectors, we measure the **angle** between them. 

*   **Why Cosine Similarity?** If one movie has a very long overview and another has a short one, Euclidean distance might mark them as far apart even if they discuss the exact same topics. Cosine similarity measures the direction (profile of words) rather than the length (frequency scale).

### Formula

For two vectors $A$ and $B$, Cosine Similarity is defined as:

$$\text{Cosine Similarity}(A, B) = \cos(\theta) = \frac{A \cdot B}{\|A\| \|B\|} = \frac{\sum_{i=1}^{n} A_i B_i}{\sqrt{\sum_{i=1}^{n} A_i^2} \sqrt{\sum_{i=1}^{n} B_i^2}}$$

*   **Range**: The score ranges from **-1** (completely opposite) to **1** (exactly the same direction). Since TF-IDF values are non-negative, the similarity ranges from **0** (no words in common) to **1** (identical word distribution profiles).

### Geometrical Visual representation

```
      ^ Vector B (Sci-Fi, Space, Stars)
     /
    /  θ (Angle between them)
   /---------> Vector A (Space, Astronaut, Mars)
```

By calculating cosine similarity between a selected movie and all other movies in our dataset, we can sort the results to get the top $N$ most similar movies.
