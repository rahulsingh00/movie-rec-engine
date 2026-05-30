// API configuration
const API_BASE = "http://127.0.0.1:8000/api";

// App State
let state = {
  movies: [],
  users: [],
  selectedMovieId: null,
  activeUserId: null,
  activeGenre: null,
  searchQuery: "",
  searchMode: "Keyword",
  activeMovieRating: 0 // Local track of selected movie rating for active user
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
const userSelect = document.getElementById("user-select");

// Navigation & Evaluation Views
const recommenderView = document.getElementById("recommender-view");
const evaluationView = document.getElementById("evaluation-view");

// Initialize App
async function init() {
  setupTheme();
  setupEventListeners();
  await loadUsers();
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
async function loadUsers() {
  try {
    const response = await fetch(`${API_BASE}/users`);
    if (!response.ok) throw new Error("Failed to load users");
    
    state.users = await response.json();
    
    // Clear and populate select
    userSelect.innerHTML = `<option value="">Guest Mode (Content Only)</option>`;
    state.users.forEach(userId => {
      const opt = document.createElement("option");
      opt.value = userId;
      opt.textContent = `User Profile #${userId}`;
      userSelect.appendChild(opt);
    });
  } catch (error) {
    console.error("Unable to load user profiles:", error);
  }
}

async function loadMovies(query = "") {
  try {
    let url = state.searchMode === "Semantic" ? `${API_BASE}/search/semantic` : `${API_BASE}/movies`;
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
    
    // Append active user_id if profile is toggled
    let url = `${API_BASE}/recommend/${movieId}?limit=6`;
    if (state.activeUserId) {
      url += `&user_id=${state.activeUserId}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to load recommendations");
    
    const recs = await response.json();
    renderRecommendations(recs);
  } catch (error) {
    console.error(error);
    recommendationsGrid.innerHTML = `<div class="error-msg">⚠️ Failed to load recommendations.</div>`;
  }
}

async function submitMovieRating(ratingValue) {
  if (!state.activeUserId || !state.selectedMovieId) return;

  try {
    const response = await fetch(`${API_BASE}/ratings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: parseInt(state.activeUserId),
        movie_id: parseInt(state.selectedMovieId),
        rating: parseFloat(ratingValue)
      })
    });

    if (!response.ok) throw new Error("Failed to save rating");
    
    state.activeMovieRating = ratingValue;
    updateRatingStars(ratingValue);
    
    // Dynamically refresh recommendations to capture updated SVD ratings reranking!
    await loadRecommendations(state.selectedMovieId);
  } catch (error) {
    console.error("Error submitting rating:", error);
    alert("⚠️ Failed to record rating. Please check backend.");
  }
}

// 🎨 Rendering Functions
function renderGenrePills() {
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
  state.activeMovieRating = 0; // Reset local active rating
  
  document.querySelectorAll(".movie-item-btn").forEach(btn => {
    btn.classList.toggle("active", parseInt(btn.dataset.id) === movie.id);
  });

  renderHero(movie);
  
  mathExplainer.classList.remove("hidden");
  recommendationsSection.classList.remove("hidden");
  
  // Refresh recommendations list
  loadRecommendations(movie.id);
}

function selectGenre(genre) {
  state.activeGenre = genre;
  
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

  // Build rating section if User profile is active
  const ratingSectionHTML = state.activeUserId
    ? `
      <div class="rating-section">
        <span class="rating-label">Rate this movie:</span>
        <div class="stars-container" id="stars-container">
          <button class="star-btn" data-value="1">★</button>
          <button class="star-btn" data-value="2">★</button>
          <button class="star-btn" data-value="3">★</button>
          <button class="star-btn" data-value="4">★</button>
          <button class="star-btn" data-value="5">★</button>
        </div>
      </div>
    `
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
        ${ratingSectionHTML}
      </div>
    </div>
  `;

  // Bind rating star clicks
  if (state.activeUserId) {
    document.querySelectorAll(".star-btn").forEach(star => {
      star.addEventListener("click", (e) => {
        const rating = parseInt(e.target.dataset.value);
        submitMovieRating(rating);
      });
    });
  }
}

function updateRatingStars(ratingValue) {
  document.querySelectorAll(".star-btn").forEach(star => {
    const val = parseInt(star.dataset.value);
    star.classList.toggle("active", val <= ratingValue);
  });
}

function renderRecommendations(recs) {
  recommendationsGrid.innerHTML = "";
  
  if (recs.length === 0) {
    recommendationsGrid.innerHTML = `<div class="empty-state-list">No matches found.</div>`;
    return;
  }

  // Update explanation UI descriptors based on Guest/User active profile mode
  const title = document.getElementById("recommendations-title");
  const subtext = document.getElementById("recommendations-subtext");
  const expTag = document.getElementById("explainer-tag");
  const expText = document.getElementById("explainer-text");

  if (state.activeUserId) {
    title.textContent = `Personalized Recommendations (User #${state.activeUserId})`;
    subtext.textContent = "Reranked with SVD collaborative predicted rating profiles";
    expTag.textContent = "🔬 SVD + TF-IDF Hybrid Model";
    expText.innerHTML = `
      Matches are reranked using a <strong>Hybrid Recommender Score</strong> ($50\\%$ Content Similarity + $50\\%$ SVD Collaborative score). 
      The backend computes raw text overlap coefficients and factors in **User #${state.activeUserId}** rating history matrices to estimate matching profiles.
    `;
  } else {
    title.textContent = "Recommended Matches";
    subtext.textContent = "Sorted by Cosine Similarity Score";
    expTag.textContent = "🔬 TF-IDF Vector Space Model";
    expText.innerHTML = `
      To find recommendations, the backend converted movie overviews and genres into a <strong>TF-IDF Vector</strong> (excluding stop words). 
      We calculate the <strong>Cosine Similarity</strong> ($\\cos \\theta$) between the selected movie's vector and every other movie. 
      The matches below have the highest similarity score.
    `;
  }

  recs.forEach(rec => {
    const card = document.createElement("div");
    card.className = "card rec-card";
    
    // In guest mode, match percentage is derived directly from similarity score
    // In user mode, it uses the hybrid score
    const scoreVal = state.activeUserId ? rec.hybrid_score : rec.similarity_score;
    const matchPercentage = Math.round(scoreVal * 100);
    
    const genresHTML = rec.genres
      ? rec.genres.split(" ").map(g => `<span>${g}</span>`).join("")
      : "";

    // Build metric sub-badges if active user reranking is applied
    const subBadgesHTML = state.activeUserId
      ? `
        <div class="badge-group">
          <span class="score-badge">${matchPercentage}% Match</span>
          <span class="sub-badge">Text: ${Math.round(rec.similarity_score * 100)}%</span>
          <span class="sub-badge">SVD: ${rec.predicted_rating.toFixed(1)} ★</span>
        </div>
      `
      : `<span class="score-badge">${matchPercentage}% Match</span>`;

    card.innerHTML = `
      <div class="rec-header">
        <h4 class="rec-title">${rec.title}</h4>
        ${subBadgesHTML}
      </div>
      ${rec.tagline ? `<p class="rec-tagline">“${rec.tagline}”</p>` : ""}
      <p class="rec-overview">${rec.overview}</p>
      <div class="rec-genres">
        ${genresHTML}
      </div>
    `;
    
    card.addEventListener("click", () => {
      // Toggle new active movie
      const clickedMovie = state.movies.find(m => m.id === rec.id) || rec;
      selectMovie(clickedMovie);
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

  // Search Mode toggle (Keyword vs. Semantic)
  const modeButtons = document.querySelectorAll(".search-mode-btn");
  modeButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const selectedMode = e.currentTarget.dataset.mode;
      if (state.searchMode === selectedMode) return;
      
      state.searchMode = selectedMode;
      
      // Update UI active class
      modeButtons.forEach(b => b.classList.toggle("active", b.dataset.mode === selectedMode));
      
      // Update placeholder text
      if (selectedMode === "Semantic") {
        searchInput.placeholder = "Enter a concept (e.g., space exploration with robots)...";
      } else {
        searchInput.placeholder = "Type a title, concept, or genre...";
      }
      
      // Refresh list
      loadMovies(state.searchQuery);
    });
  });

  // User Profile Selector Change Event listener
  userSelect.addEventListener("change", (e) => {
    const val = e.target.value;
    state.activeUserId = val ? parseInt(val) : null;
    
    // If a movie is currently selected, refresh active details
    if (state.selectedMovieId) {
      const activeMovie = state.movies.find(m => m.id === state.selectedMovieId);
      if (activeMovie) {
        selectMovie(activeMovie);
      }
    }
  });

  // Tab switching
  const tabRecommender = document.getElementById("tab-recommender");
  const tabEvaluation = document.getElementById("tab-evaluation");
  if (tabRecommender && tabEvaluation) {
    tabRecommender.addEventListener("click", () => handleTabSwitch("recommender"));
    tabEvaluation.addEventListener("click", () => handleTabSwitch("evaluation"));
  }
}

// 🔬 Evaluation & SVG Charts Renders
function handleTabSwitch(tabName) {
  const tabRecommender = document.getElementById("tab-recommender");
  const tabEvaluation = document.getElementById("tab-evaluation");
  
  if (tabName === "recommender") {
    tabRecommender.classList.add("active");
    tabEvaluation.classList.remove("active");
    recommenderView.classList.remove("hidden");
    evaluationView.classList.add("hidden");
  } else {
    tabRecommender.classList.remove("active");
    tabEvaluation.classList.add("active");
    recommenderView.classList.add("hidden");
    evaluationView.classList.remove("hidden");
    loadEvaluationMetrics();
  }
}

async function loadEvaluationMetrics() {
  const precisionWrapper = document.getElementById("precision-chart-wrapper");
  const recallWrapper = document.getElementById("recall-chart-wrapper");
  
  precisionWrapper.innerHTML = `<div class="loading-state">Running SVD split matrix evaluation...</div>`;
  recallWrapper.innerHTML = ``;
  
  try {
    const response = await fetch(`${API_BASE}/evaluation/metrics`);
    if (!response.ok) throw new Error("Failed to load evaluation metrics");
    
    const data = await response.json();
    
    // Populate cards
    const models = ["content", "svd", "hybrid"];
    models.forEach(model => {
      const metrics = data.metrics[model];
      document.getElementById(`${model}-map`).textContent = `${(metrics.map * 100).toFixed(1)}%`;
      document.getElementById(`${model}-p5`).textContent = `${(metrics.precision[5] * 100).toFixed(1)}%`;
      document.getElementById(`${model}-r5`).textContent = `${(metrics.recall[5] * 100).toFixed(1)}%`;
    });
    
    // Generate charts
    precisionWrapper.innerHTML = generateSVGLineChart("precision", data.metrics, data.k_values);
    recallWrapper.innerHTML = generateSVGLineChart("recall", data.metrics, data.k_values);
  } catch (error) {
    console.error(error);
    precisionWrapper.innerHTML = `<div class="error-msg">⚠️ Failed to load evaluation dashboard details.</div>`;
  }
}

function generateSVGLineChart(metricName, data, kValues) {
  const width = 450;
  const height = 280;
  const padLeft = 50;
  const padRight = 20;
  const padTop = 30;
  const padBottom = 40;
  
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;
  
  const getX = (idx) => padLeft + (idx / (kValues.length - 1)) * chartW;
  const getY = (val) => padTop + (1.0 - val) * chartH;
  
  let gridHTML = "";
  for (let i = 0; i <= 5; i++) {
    const val = i / 5;
    const y = getY(val);
    gridHTML += `
      <line class="chart-grid" x1="${padLeft}" y1="${y}" x2="${width - padRight}" y2="${y}" />
      <text class="chart-label" x="${padLeft - 10}" y="${y + 4}" text-anchor="end">${Math.round(val * 100)}%</text>
    `;
  }
  
  kValues.forEach((k, idx) => {
    const x = getX(idx);
    gridHTML += `
      <line class="chart-grid" x1="${x}" y1="${padTop}" x2="${x}" y2="${height - padBottom}" />
      <text class="chart-label" x="${x}" y="${height - padBottom + 20}" text-anchor="middle">K = ${k}</text>
    `;
  });
  
  const models = ["content", "svd", "hybrid"];
  let linesHTML = "";
  let dotsHTML = "";
  
  models.forEach(model => {
    const modelData = data[model][metricName];
    let pathPoints = [];
    
    kValues.forEach((k, idx) => {
      const val = modelData[k];
      const x = getX(idx);
      const y = getY(val);
      pathPoints.push(`${x},${y}`);
      
      dotsHTML += `
        <circle class="chart-dot ${model}-dot" cx="${x}" cy="${y}" r="5">
          <title>${model.toUpperCase()} ${metricName}@${k}: ${(val * 100).toFixed(1)}%</title>
        </circle>
      `;
    });
    
    linesHTML += `
      <path class="chart-line ${model}-line" d="M ${pathPoints.join(" L ")}" />
    `;
  });
  
  const legendHTML = `
    <g transform="translate(${padLeft + 10}, 15)">
      <circle cx="0" cy="0" r="4" fill="oklch(65% 0.15 220)" />
      <text class="chart-label" x="10" y="4" font-weight="600">Content</text>
      
      <circle cx="90" cy="0" r="4" fill="oklch(70% 0.17 90)" />
      <text class="chart-label" x="100" y="4" font-weight="600">SVD</text>
      
      <circle cx="160" cy="0" r="4" fill="var(--accent)" />
      <text class="chart-label" x="170" y="4" font-weight="600">Hybrid</text>
    </g>
  `;
  
  return `
    <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
      ${gridHTML}
      <line class="chart-axis" x1="${padLeft}" y1="${padTop}" x2="${padLeft}" y2="${height - padBottom}" />
      <line class="chart-axis" x1="${padLeft}" y1="${height - padBottom}" x2="${width - padRight}" y2="${height - padBottom}" />
      ${linesHTML}
      ${dotsHTML}
      ${legendHTML}
    </svg>
  `;
}

// Fire up!
document.addEventListener("DOMContentLoaded", init);
