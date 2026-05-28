# 🧠 NLP Basics for Recommendation Engines

Natural Language Processing (NLP) enables our movie recommendation engine to "understand" and compare text descriptors like movie overviews, taglines, and genres.

## 1. Text Preprocessing
Before we can perform machine learning on raw text, we need to clean and standardize it. This process involves:

*   **Lowercasing**: Converting all text to lowercase to ensure consistency (e.g., `Sci-Fi` and `sci-fi` match).
*   **Tokenization**: Splitting sentences into individual words (tokens).
*   **Stop Word Removal**: Removing common words (`the`, `is`, `and`, `of`) that carry very little semantic meaning.
*   **Stemming/Lemmatization**: Reducing words to their base or root forms (e.g., `moving`, `moved` -> `move`).

## 2. Text Vectorization: Bag of Words vs. TF-IDF

Machine learning models require numerical input. We convert text into numbers using vectorization.

### A. Bag of Words (CountVectorizer)
Simply counts the occurrences of each word in a document. 
*   **Drawback**: It gives equal weight to all words. Frequent, generic words can drown out unique, descriptive words.

### B. TF-IDF (Term Frequency-Inverse Document Frequency)
TF-IDF calculates a score for each word that represents how important it is to a document relative to a collection of documents (corpus).

$$\text{TF-IDF}(t, d, D) = \text{TF}(t, d) \times \text{IDF}(t, D)$$

1.  **Term Frequency (TF)**: How frequently term $t$ appears in document $d$.
    $$\text{TF}(t, d) = \frac{\text{Count of } t \text{ in } d}{\text{Total words in } d}$$
2.  **Inverse Document Frequency (IDF)**: How common or rare term $t$ is across all documents $D$. If a word appears in every movie overview, its IDF is low.
    $$\text{IDF}(t, D) = \log\left(\frac{\text{Total number of documents } |D|}{\text{Number of documents containing } t}\right) + 1$$

Words with high TF-IDF scores are highly descriptive of that specific movie (e.g., "space", "dinosaur", "wizard").
