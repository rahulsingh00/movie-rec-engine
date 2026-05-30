# Epic 3: Responsive Web UI

Create an interactive and gorgeous user interface to showcase movie listings, highlight similarity scores, search movies, and visualize NLP components.

## Status: ✅ Completed

## Acceptance Criteria

- [x] Responsive web layout (sidebar/header + main content) utilizing grid and flexbox.
- [x] Implement movie list search with autocomplete. *(Augmented by Epic 5 Keyword vs Semantic toggles)*
- [x] Detail view for the selected movie showing its tagline, overview, genres, and a visual similarity bar. *(Augmented by Epic 4 rating stars)*
- [x] Recommendation grid showcasing the matching titles, their similarity score percentages, and matching genres. *(Augmented by Epic 4 hybrid SVD badges)*
- [x] Modern UI details: dark glassmorphism styling, clean animations, and responsive breakpoints.

> [!NOTE]
> **Evolution of Specifications**:
> - **Search Inputs** were augmented in **Epic 5** to track segmented click states (Keyword vs. Semantic) and route calls.
> - **Movie Details and Recommendations** were augmented in **Epic 4** to support rating submissions and render user profile metrics (SVD predictions vs. TF-IDF similarity).
> - **Dashboard views** were augmented in **Epic 6** to route into a full-width metrics verification panel featuring interactive graphs.

---

## 🔍 Technical Deep Dive & Implementation

The frontend app is a modern Single Page Application (SPA) powered by **Vite** and built using standard semantic **HTML5**, **Vanilla CSS**, and **ES6 Javascript**.

### 1. State Management & Flow
The application logic is driven by a central, lightweight state controller:
```javascript
let state = {
  movies: [],
  selectedMovieId: null,
  activeGenre: null,
  searchQuery: "",
};
```
Whenever the user selects a movie, searches, or filters by genre, the state updates and the rendering functions (`renderSidebarList()`, `renderHero()`, `renderRecommendations()`) redraw the respective portions of the DOM cleanly.

### 2. Search Debouncing
To prevent sending an API request on every keystroke, a **debounce** pattern waits for the user to finish typing (300ms pause) before calling the backend:
```javascript
let searchTimeout;
searchInput.addEventListener("input", (e) => {
  clearTimeout(searchTimeout);
  state.searchQuery = e.target.value;
  searchTimeout = setTimeout(() => {
    loadMovies(state.searchQuery);
  }, 300);
});
```

### 3. Glassmorphism & UI Accents
The styling uses curated HSL colors, standard responsive breakpoints, and glassmorphic variables:
```css
/* Glassmorphism card utility inside styles.css */
.card {
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
}
```

---

## 📚 Further Reading & Learning Resources

*   **CSS Grid Guide**: [CSS Tricks Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
*   **CSS Flexbox Guide**: [CSS Tricks Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
*   **JavaScript Fetch API**: [MDN Web Docs on Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
*   **Understanding Debouncing**: [Debounce in JavaScript (FreeCodeCamp)](https://www.freecodecamp.org/news/javascript-debounce-example/)
*   **Glassmorphism UI Trends**: [A Guide to Glassmorphism in Web Design](https://uxdesign.cc/glassmorphism-in-user-interfaces-1f39bb1308c9)

