(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}})();const h="http://127.0.0.1:8000/api";let a={movies:[],users:[],selectedMovieId:null,activeUserId:null,activeGenre:null,searchQuery:"",searchMode:"Keyword",activeMovieRating:0};const g=document.getElementById("movies-list"),_=document.getElementById("movie-count"),$=document.getElementById("search-input"),E=document.getElementById("genres-container"),k=document.getElementById("selected-movie-hero"),j=document.getElementById("math-explainer"),V=document.getElementById("recommendations-section"),v=document.getElementById("recommendations-grid"),q=document.getElementById("theme-toggle"),L=document.getElementById("user-select"),F=document.getElementById("recommender-view"),R=document.getElementById("evaluation-view");async function W(){Q(),ee(),await K(),await b()}function Q(){const e=localStorage.getItem("color-scheme")||"dark";document.documentElement.className=e,q.addEventListener("click",()=>{const n=document.documentElement.classList.contains("dark")?"light":"dark";document.documentElement.className=n,localStorage.setItem("color-scheme",n),document.querySelector('meta[name="color-scheme"]').content=n})}async function K(){try{const e=await fetch(`${h}/users`);if(!e.ok)throw new Error("Failed to load users");a.users=await e.json(),L.innerHTML='<option value="">Guest Mode (Content Only)</option>',a.users.forEach(t=>{const n=document.createElement("option");n.value=t,n.textContent=`User Profile #${t}`,L.appendChild(n)})}catch(e){console.error("Unable to load user profiles:",e)}}async function b(e=""){try{let t=a.searchMode==="Semantic"?`${h}/search/semantic`:`${h}/movies`;e&&(t+=`?query=${encodeURIComponent(e)}`);const n=await fetch(t);if(!n.ok)throw new Error("Failed to fetch movies dataset");a.movies=await n.json(),!e&&a.activeGenre===null&&z(),N()}catch(t){console.error(t),g.innerHTML='<div class="error-msg">⚠️ Unable to load library. Ensure backend is running.</div>'}}async function D(e){try{v.innerHTML='<div class="loading-state">Finding matches...</div>';let t=`${h}/recommend/${e}?limit=6`;a.activeUserId&&(t+=`&user_id=${a.activeUserId}`);const n=await fetch(t);if(!n.ok)throw new Error("Failed to load recommendations");const i=await n.json();Z(i)}catch(t){console.error(t),v.innerHTML='<div class="error-msg">⚠️ Failed to load recommendations.</div>'}}async function Y(e){if(!(!a.activeUserId||!a.selectedMovieId))try{if(!(await fetch(`${h}/ratings`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({user_id:parseInt(a.activeUserId),movie_id:parseInt(a.selectedMovieId),rating:parseFloat(e)})})).ok)throw new Error("Failed to save rating");a.activeMovieRating=e,X(e),await D(a.selectedMovieId)}catch(t){console.error("Error submitting rating:",t),alert("⚠️ Failed to record rating. Please check backend.")}}function z(){const e=new Set;a.movies.forEach(i=>{i.genres&&i.genres.split(" ").forEach(o=>{o&&e.add(o)})});const t=Array.from(e).sort();E.innerHTML="";const n=document.createElement("button");n.className=`genre-pill ${a.activeGenre?"":"active"}`,n.textContent="All Genres",n.addEventListener("click",()=>U(null)),E.appendChild(n),t.forEach(i=>{const o=document.createElement("button");o.className=`genre-pill ${a.activeGenre===i?"active":""}`,o.textContent=i,o.addEventListener("click",()=>U(i)),E.appendChild(o)})}function N(){let e=a.movies;if(a.activeGenre&&(e=a.movies.filter(i=>i.genres&&i.genres.toLowerCase().includes(a.activeGenre.toLowerCase()))),_.textContent=e.length,g.innerHTML="",e.length===0){g.innerHTML='<div class="empty-state-list">No movies found</div>';return}e.slice(0,100).forEach(i=>{const o=document.createElement("button");o.className=`movie-item-btn ${a.selectedMovieId===i.id?"active":""}`,o.dataset.id=i.id;const s=document.createElement("div");s.className="movie-item-title",s.textContent=i.title;const c=document.createElement("div");c.className="movie-item-genres",c.textContent=i.genres.split(" ").join(" • "),o.appendChild(s),o.appendChild(c),o.addEventListener("click",()=>x(i)),g.appendChild(o)})}function x(e){a.selectedMovieId=e.id,a.activeMovieRating=0,document.querySelectorAll(".movie-item-btn").forEach(t=>{t.classList.toggle("active",parseInt(t.dataset.id)===e.id)}),J(e),j.classList.remove("hidden"),V.classList.remove("hidden"),D(e.id)}function U(e){a.activeGenre=e,document.querySelectorAll(".genre-pill").forEach(t=>{const n=e===null?t.textContent==="All Genres":t.textContent===e;t.classList.toggle("active",n)}),N()}function J(e){k.classList.remove("empty");const t=e.genres?e.genres.split(" ").map(i=>`<span class="genre-tag">${i}</span>`).join(""):"",n=a.activeUserId?`
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
    `:"";k.innerHTML=`
    <div class="movie-hero-grid">
      <div>
        ${e.tagline?`<p class="hero-tagline">“${e.tagline}”</p>`:""}
        <h2 class="hero-title">${e.title}</h2>
        <div class="hero-meta">
          ${t}
        </div>
        <p class="hero-overview">${e.overview}</p>
        ${n}
      </div>
    </div>
  `,a.activeUserId&&document.querySelectorAll(".star-btn").forEach(i=>{i.addEventListener("click",o=>{const s=parseInt(o.target.dataset.value);Y(s)})})}function X(e){document.querySelectorAll(".star-btn").forEach(t=>{const n=parseInt(t.dataset.value);t.classList.toggle("active",n<=e)})}function Z(e){if(v.innerHTML="",e.length===0){v.innerHTML='<div class="empty-state-list">No matches found.</div>';return}const t=document.getElementById("recommendations-title"),n=document.getElementById("recommendations-subtext"),i=document.getElementById("explainer-tag"),o=document.getElementById("explainer-text");a.activeUserId?(t.textContent=`Personalized Recommendations (User #${a.activeUserId})`,n.textContent="Reranked with SVD collaborative predicted rating profiles",i.textContent="🔬 SVD + TF-IDF Hybrid Model",o.innerHTML=`
      Matches are reranked using a <strong>Hybrid Recommender Score</strong> ($50\\%$ Content Similarity + $50\\%$ SVD Collaborative score). 
      The backend computes raw text overlap coefficients and factors in **User #${a.activeUserId}** rating history matrices to estimate matching profiles.
    `):(t.textContent="Recommended Matches",n.textContent="Sorted by Cosine Similarity Score",i.textContent="🔬 TF-IDF Vector Space Model",o.innerHTML=`
      To find recommendations, the backend converted movie overviews and genres into a <strong>TF-IDF Vector</strong> (excluding stop words). 
      We calculate the <strong>Cosine Similarity</strong> ($\\cos \\theta$) between the selected movie's vector and every other movie. 
      The matches below have the highest similarity score.
    `),e.forEach(s=>{const c=document.createElement("div");c.className="card rec-card";const l=a.activeUserId?s.hybrid_score:s.similarity_score,f=Math.round(l*100),M=s.genres?s.genres.split(" ").map(m=>`<span>${m}</span>`).join(""):"",I=a.activeUserId?`
        <div class="badge-group">
          <span class="score-badge">${f}% Match</span>
          <span class="sub-badge">Text: ${Math.round(s.similarity_score*100)}%</span>
          <span class="sub-badge">SVD: ${s.predicted_rating.toFixed(1)} ★</span>
        </div>
      `:`<span class="score-badge">${f}% Match</span>`;c.innerHTML=`
      <div class="rec-header">
        <h4 class="rec-title">${s.title}</h4>
        ${I}
      </div>
      ${s.tagline?`<p class="rec-tagline">“${s.tagline}”</p>`:""}
      <p class="rec-overview">${s.overview}</p>
      <div class="rec-genres">
        ${M}
      </div>
    `,c.addEventListener("click",()=>{const m=a.movies.find(p=>p.id===s.id)||s;x(m),window.scrollTo({top:0,behavior:"smooth"})}),v.appendChild(c)})}function ee(){let e;$.addEventListener("input",o=>{clearTimeout(e),a.searchQuery=o.target.value,e=setTimeout(()=>{b(a.searchQuery)},300)});const t=document.querySelectorAll(".search-mode-btn");t.forEach(o=>{o.addEventListener("click",s=>{const c=s.currentTarget.dataset.mode;a.searchMode!==c&&(a.searchMode=c,t.forEach(l=>l.classList.toggle("active",l.dataset.mode===c)),c==="Semantic"?$.placeholder="Enter a concept (e.g., space exploration with robots)...":$.placeholder="Type a title, concept, or genre...",b(a.searchQuery))})}),L.addEventListener("change",o=>{const s=o.target.value;if(a.activeUserId=s?parseInt(s):null,a.selectedMovieId){const c=a.movies.find(l=>l.id===a.selectedMovieId);c&&x(c)}});const n=document.getElementById("tab-recommender"),i=document.getElementById("tab-evaluation");n&&i&&(n.addEventListener("click",()=>G("recommender")),i.addEventListener("click",()=>G("evaluation")))}function G(e){const t=document.getElementById("tab-recommender"),n=document.getElementById("tab-evaluation");e==="recommender"?(t.classList.add("active"),n.classList.remove("active"),F.classList.remove("hidden"),R.classList.add("hidden")):(t.classList.remove("active"),n.classList.add("active"),F.classList.add("hidden"),R.classList.remove("hidden"),te())}async function te(){const e=document.getElementById("precision-chart-wrapper"),t=document.getElementById("recall-chart-wrapper");e.innerHTML='<div class="loading-state">Running SVD split matrix evaluation...</div>',t.innerHTML="";try{const n=await fetch(`${h}/evaluation/metrics`);if(!n.ok)throw new Error("Failed to load evaluation metrics");const i=await n.json();["content","svd","hybrid"].forEach(s=>{const c=i.metrics[s];document.getElementById(`${s}-map`).textContent=`${(c.map*100).toFixed(1)}%`,document.getElementById(`${s}-p5`).textContent=`${(c.precision[5]*100).toFixed(1)}%`,document.getElementById(`${s}-r5`).textContent=`${(c.recall[5]*100).toFixed(1)}%`}),e.innerHTML=A("precision",i.metrics,i.k_values),t.innerHTML=A("recall",i.metrics,i.k_values)}catch(n){console.error(n),e.innerHTML='<div class="error-msg">⚠️ Failed to load evaluation dashboard details.</div>'}}function A(e,t,n){const m=r=>50+r/(n.length-1)*380,p=r=>30+(1-r)*210;let y="";for(let r=0;r<=5;r++){const u=r/5,d=p(u);y+=`
      <line class="chart-grid" x1="50" y1="${d}" x2="430" y2="${d}" />
      <text class="chart-label" x="40" y="${d+4}" text-anchor="end">${Math.round(u*100)}%</text>
    `}n.forEach((r,u)=>{const d=m(u);y+=`
      <line class="chart-grid" x1="${d}" y1="30" x2="${d}" y2="240" />
      <text class="chart-label" x="${d}" y="260" text-anchor="middle">K = ${r}</text>
    `});const P=["content","svd","hybrid"];let w="",T="";return P.forEach(r=>{const u=t[r][e];let d=[];n.forEach((C,O)=>{const S=u[C],B=m(O),H=p(S);d.push(`${B},${H}`),T+=`
        <circle class="chart-dot ${r}-dot" cx="${B}" cy="${H}" r="5">
          <title>${r.toUpperCase()} ${e}@${C}: ${(S*100).toFixed(1)}%</title>
        </circle>
      `}),w+=`
      <path class="chart-line ${r}-line" d="M ${d.join(" L ")}" />
    `}),`
    <svg width="100%" height="100%" viewBox="0 0 450 280" preserveAspectRatio="xMidYMid meet">
      ${y}
      <line class="chart-axis" x1="50" y1="30" x2="50" y2="240" />
      <line class="chart-axis" x1="50" y1="240" x2="430" y2="240" />
      ${w}
      ${T}
      
    <g transform="translate(60, 15)">
      <circle cx="0" cy="0" r="4" fill="oklch(65% 0.15 220)" />
      <text class="chart-label" x="10" y="4" font-weight="600">Content</text>
      
      <circle cx="90" cy="0" r="4" fill="oklch(70% 0.17 90)" />
      <text class="chart-label" x="100" y="4" font-weight="600">SVD</text>
      
      <circle cx="160" cy="0" r="4" fill="var(--accent)" />
      <text class="chart-label" x="170" y="4" font-weight="600">Hybrid</text>
    </g>
  
    </svg>
  `}document.addEventListener("DOMContentLoaded",W);
