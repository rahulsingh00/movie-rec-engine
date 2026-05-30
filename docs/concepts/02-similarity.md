# 📐 Vector Spaces & Cosine Similarity

Once we convert movie descriptions into numerical TF-IDF vectors, each movie is represented as a point (or vector pointer) in a high-dimensional vector space. To recommend similar movies, we calculate the mathematical similarity between these vectors.

---

## 1. Why Cosine Similarity over Euclidean Distance?

*   **Euclidean Distance**: Measures the straight-line distance between two points:
    $$d(A, B) = \sqrt{\sum (A_i - B_i)^2}$$
    If Movie A has a very long plot description and Movie B has a short one, they will be far apart in space (high Euclidean distance) even if their word frequency distributions (ratios) are identical.
*   **Cosine Similarity**: Measures the cosine of the angle $\theta$ between the vectors, completely ignoring their magnitudes.
    *   If two documents have similar word distributions but different lengths, their vectors point in the same direction, yielding a Cosine Similarity score near $1.0$.

---

## 2. Mathematical Definition & Derivation

For two vectors $A$ and $B$, Cosine Similarity is:

$$\text{Cosine Similarity}(A, B) = \cos(\theta) = \frac{A \cdot B}{\|A\| \|B\|} = \frac{\sum_{i=1}^{n} A_i B_i}{\sqrt{\sum_{i=1}^{n} A_i^2} \sqrt{\sum_{i=1}^{n} B_i^2}}$$

### Step-by-Step 2D Numerical Example
Imagine a simplified vocabulary containing only two terms: `["space", "magic"]`.
*   **Movie A (Sci-Fi Space Film)**: mentions "space" 3 times, "magic" 0 times. Vector $A = [3, 0]$
*   **Movie B (Sci-Fi Fantasy Hybrid)**: mentions "space" 2 times, "magic" 1 time. Vector $B = [2, 1]$

Let's calculate the similarity step-by-step:
1.  **Dot Product ($A \cdot B$)**:
    $$A \cdot B = (3 \times 2) + (0 \times 1) = 6$$
2.  **Magnitude of A ($\|A\|$)**:
    $$\|A\| = \sqrt{3^2 + 0^2} = \sqrt{9} = 3$$
3.  **Magnitude of B ($\|B\|$)**:
    $$\|B\| = \sqrt{2^2 + 1^2} = \sqrt{5} \approx 2.236$$
4.  **Cosine Similarity**:
    $$\cos(\theta) = \frac{6}{3 \times 2.236} = \frac{6}{6.708} \approx 0.894\ \ (89.4\%\text{ Similarity})$$

---

## 3. Alternative Metrics Comparison

| Metric | Formula | Range | Best Use Case |
|---|---|---|---|
| **Cosine Similarity** | $\frac{A \cdot B}{\|A\| \|B\|}$ | $[0, 1]$ (for non-negative vectors) | Text documents, high dimensions where lengths vary |
| **Euclidean Distance** | $\sqrt{\sum (A_i - B_i)^2}$ | $[0, \infty)$ | When magnitude is highly significant (e.g. physical coordinates) |
| **Pearson Correlation** | $\frac{\text{Cov}(A,B)}{\sigma_A \sigma_B}$ | $[-1, 1]$ | Collaborative filtering where user rating scales differ |

---

## 4. Geometrical Representation

```text
       ^ "magic" coordinate axis
       |
     1 +        . Vector B (Sci-Fi/Fantasy) [2, 1]
       |       / 
       |      / θ (Angle approx 26.5 degrees)
     0 +-----+-----------------------> "space" coordinate axis
       0     2        3 (Vector A [3,0])
```

---

## 📚 Further Reading & Learning Resources

*   **Linear Algebra Fundamentals**: [3Blue1Brown Essence of Linear Algebra (YouTube)](https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab)
*   **Metric Spaces & Similarity**: [Cosine Similarity - Wikipedia](https://en.wikipedia.org/wiki/Cosine_similarity)
*   **Practical Python Vectorization**: [Vectorizing text and computing cosine similarity (Real Python)](https://realpython.com/natural-language-processing-spacy-python/)
*   **Distance Metrics**: [Machine Learning Mastery: Distance Measures Guide](https://machinelearningmastery.com/distance-measures-for-machine-learning/)

