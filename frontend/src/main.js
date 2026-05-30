// API configuration
const API_BASE = "http://127.0.0.1:8000/api";

// App State
let state = {
  movies: [],
  selectedMovieId: null,
  activeGenre: null,
  searchQuery: "",
};

// DOM Elements
const moviesList = document.getElementById("movies-list");
const movieCount = document.getElementById("movie-count");
const searchInput = document.getElementById("search-input");
const genresContainer = document.getElementById("genres-container");
const selectedMovieHero = document.getElementById("selected-movie-hero");
const mathExplainer = document.getElementById("math-explainer");
const recommendationsSection = document.getElementById("recommendations-section");
const recommendationsGrid = document.getElementById("recommendations-grid");
const themeToggle = document.getElementById("theme-toggle");

// Initialize App
async function init() {
  setupTheme();
  setupEventListeners();
  await loadMovies();
}

// 🌓 Theme Logic
function setupTheme() {
  const savedScheme = localStorage.getItem("color-scheme") || "dark";
  document.documentElement.className = savedScheme;
  
  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark");
    const nextScheme = isDark ? "light" : "dark";
    
    document.documentElement.className = nextScheme;
    localStorage.setItem("color-scheme", nextScheme);
    document.querySelector('meta[name="color-scheme"]').content = nextScheme;
  });
}

// 📦 API Operations
async function loadMovies(query = "") {
  try {
    let url = `${API_BASE}/movies`;
    if (query) {
      url += `?query=${encodeURIComponent(query)}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch movies dataset");
    
    state.movies = await response.json();
    
    // If it is the initial load (no query), populate the genre pills
    if (!query && state.activeGenre === null) {
      renderGenrePills();
    }
    
    renderSidebarList();
  } catch (error) {
    console.error(error);
    moviesList.innerHTML = `<div class="error-msg">⚠️ Unable to load library. Ensure backend is running.</div>`;
  }
}

async function loadRecommendations(movieId) {
  try {
    recommendationsGrid.innerHTML = `<div class="loading-state">Finding matches...</div>`;
    
    const response = await fetch(`${API_BASE}/recommend/${movieId}?limit=6`);
    if (!response.ok) throw new Error("Failed to load recommendations");
    
    const recs = await response.json();
    renderRecommendations(recs);
  } catch (error) {
    console.error(error);
    recommendationsGrid.innerHTML = `<div class="error-msg">⚠️ Failed to load recommendations.</div>`;
  }
}

// 🎨 Rendering Functions
function renderGenrePills() {
  // Extract all unique genres
  const genresSet = new Set();
  state.movies.forEach(movie => {
    if (movie.genres) {
      movie.genres.split(" ").forEach(g => {
        if (g) genresSet.add(g);
      });
    }
  });

  const genres = Array.from(genresSet).sort();
  
  genresContainer.innerHTML = "";
  
  // Add "All" pill
  const allPill = document.createElement("button");
  allPill.className = `genre-pill ${!state.activeGenre ? "active" : ""}`;
  allPill.textContent = "All Genres";
  allPill.addEventListener("click", () => selectGenre(null));
  genresContainer.appendChild(allPill);

  genres.forEach(genre => {
    const pill = document.createElement("button");
    pill.className = `genre-pill ${state.activeGenre === genre ? "active" : ""}`;
    pill.textContent = genre;
    pill.addEventListener("click", () => selectGenre(genre));
    genresContainer.appendChild(pill);
  });
}

function renderSidebarList() {
  // Filter client-side if a genre filter is active
  let displayMovies = state.movies;
  if (state.activeGenre) {
    displayMovies = state.movies.filter(m => 
      m.genres && m.genres.toLowerCase().includes(state.activeGenre.toLowerCase())
    );
  }

  movieCount.textContent = displayMovies.length;
  moviesList.innerHTML = "";

  if (displayMovies.length === 0) {
    moviesList.innerHTML = `<div class="empty-state-list">No movies found</div>`;
    return;
  }

  // Limit DOM rendering to top 100 movies for performance
  const limit = 100;
  const renderMovies = displayMovies.slice(0, limit);

  renderMovies.forEach(movie => {
    const btn = document.createElement("button");
    btn.className = `movie-item-btn ${state.selectedMovieId === movie.id ? "active" : ""}`;
    btn.dataset.id = movie.id;
    
    const title = document.createElement("div");
    title.className = "movie-item-title";
    title.textContent = movie.title;
    
    const genres = document.createElement("div");
    genres.className = "movie-item-genres";
    genres.textContent = movie.genres.split(" ").join(" • ");
    
    btn.appendChild(title);
    btn.appendChild(genres);
    
    btn.addEventListener("click", () => selectMovie(movie));
    moviesList.appendChild(btn);
  });
}

function selectMovie(movie) {
  state.selectedMovieId = movie.id;
  
  // Update sidebar active classes
  document.querySelectorAll(".movie-item-btn").forEach(btn => {
    btn.classList.toggle("active", parseInt(btn.dataset.id) === movie.id);
  });

  // Render Hero
  renderHero(movie);
  
  // Show explainer and grid sections
  mathExplainer.classList.remove("hidden");
  recommendationsSection.classList.remove("hidden");
  
  // Fetch and render matches
  loadRecommendations(movie.id);
}

function selectGenre(genre) {
  state.activeGenre = genre;
  
  // Update active pill styling
  document.querySelectorAll(".genre-pill").forEach(pill => {
    const isActive = genre === null ? pill.textContent === "All Genres" : pill.textContent === genre;
    pill.classList.toggle("active", isActive);
  });
  
  renderSidebarList();
}

function renderHero(movie) {
  selectedMovieHero.classList.remove("empty");
  
  const genresHTML = movie.genres
    ? movie.genres.split(" ").map(g => `<span class="genre-tag">${g}</span>`).join("")
    : "";

  selectedMovieHero.innerHTML = `
    <div class="movie-hero-grid">
      <div>
        ${movie.tagline ? `<p class="hero-tagline">“${movie.tagline}”</p>` : ""}
        <h2 class="hero-title">${movie.title}</h2>
        <div class="hero-meta">
          ${genresHTML}
        </div>
        <p class="hero-overview">${movie.overview}</p>
      </div>
    </div>
  `;
}

function renderRecommendations(recs) {
  recommendationsGrid.innerHTML = "";
  
  if (recs.length === 0) {
    recommendationsGrid.innerHTML = `<div class="empty-state-list">No matches found.</div>`;
    return;
  }

  recs.forEach(rec => {
    const card = document.createElement("div");
    card.className = "card rec-card";
    
    // Format similarity score as percentage
    const matchPercentage = Math.round(rec.similarity_score * 100);
    
    const genresHTML = rec.genres
      ? rec.genres.split(" ").map(g => `<span>${g}</span>`).join("")
      : "";

    card.innerHTML = `
      <div class="rec-header">
        <h4 class="rec-title">${rec.title}</h4>
        <span class="score-badge">${matchPercentage}% Match</span>
      </div>
      ${rec.tagline ? `<p class="rec-tagline">“${rec.tagline}”</p>` : ""}
      <p class="rec-overview">${rec.overview}</p>
      <div class="rec-genres">
        ${genresHTML}
      </div>
    `;
    
    // Clicking recommended card switches to that movie
    card.addEventListener("click", () => {
      selectMovie(rec);
      // Scroll smoothly to top of main content
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    recommendationsGrid.appendChild(card);
  });
}

// 🕹️ Interactivity
function setupEventListeners() {
  // Simple Debounce for Search input
  let searchTimeout;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    state.searchQuery = e.target.value;
    
    searchTimeout = setTimeout(() => {
      loadMovies(state.searchQuery);
    }, 300);
  });
}

// Fire up!
document.addEventListener("DOMContentLoaded", init);
