const searchBtn = document.getElementById("search-btn");
const homeBtn = document.getElementById("watchlist");
const watchlistBtn = document.getElementById("home");
const searchInput = document.getElementById("search-input");
const contentWrapper = document.getElementById("content-wrapper");
const watchlistContentWrapper = document.getElementById(
  "watchlist-content-wrapper"
);
const myWatchlist = document.getElementById("my-watchlist");

let movieTitle = "";
let movieCardHTML = "";
let watchlistMovieCardHTML = "";
let watchlistArray = [];
let watchlistPicks = [];

let movieCard = document.createElement("div");
movieCard.classList.add("movie-card");

function add(title) {
  fetch(`https://www.omdbapi.com/?t=${title}&apikey=d09c5b1f`)
    .then((res) => res.json())
    .then((data) => {
      window.localStorage.setItem(data.Title, JSON.stringify(data));
      watchlistArray.push(data.Title);
    });
}

function remove(title) {
  window.localStorage.removeItem(title);
  window.location.reload();
}

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    movieTitle = searchInput.value;
    renderCards();
  });
}

function renderCards() {
  contentWrapper.innerHTML = "";
  fetch(`https://www.omdbapi.com/?apikey=d09c5b1f&s=${movieTitle}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.Response === "False") {
        return;
      }
      for (let i in data.Search) {
        fetch(
          `https://www.omdbapi.com/?apikey=d09c5b1f&t=${data.Search[i].Title}`
        )
          .then((res) => res.json())
          .then((movie) => {
            movieCardHTML = `
            <div class="movie-card">
              <img
                  src=${movie.Poster}
                  alt="movie-poster"
                  class="movie-poster"
                />
                <div class="details">
                  <div class="title-wrapper">
                    <h4 class="title">${movie.Title}</h4>
                    <div class="score">
                      <i class="fa-solid fa-star"></i>
                      <p class="score-value">${movie.imdbRating}</p>
                    </div>
                  </div>
                  <div class="info">
                    <h5 class="duration">${movie.Runtime}</h5>
                    <h5 class="genre">${movie.Genre}</h5>

                    <button id="addWatchlist" class="add-watchlist" onclick="add('${movie.Title}')">
                      + Watchlist
                    </button>

                  </div>
                  <p class="description">${movie.Plot}<a>Read More</a>
                  </p>
                </div>
              </div>
            `;

            contentWrapper.innerHTML += movieCardHTML;
          });
      }
    });
}

function renderWatchlistCards() {
  let keys = Object.keys(localStorage);
  let i = keys.length;

  while (i--) {
    watchlistPicks.push(JSON.parse(localStorage.getItem(keys[i])));
  }

  if (watchlistPicks.length === 0) {
    console.log("Nothing to watch");
  } else {
    for (let movie of watchlistPicks) {
      watchlistMovieCardHTML = `
        <div class="movie-card">
          <img
              src=${movie.Poster}
              alt="movie-poster"
              class="movie-poster"
            />
            <div class="details">
              <div class="title-wrapper">
                <h4 class="title">${movie.Title}</h4>
                <div class="score">
                  <i class="fa-solid fa-star"></i>
                  <p class="score-value">${movie.imdbRating}</p>
                </div>
              </div>
              <div class="info">
                <h5 class="duration">${movie.Runtime}</h5>
                <h5 class="genre">${movie.Genre}</h5>

                <button id="addWatchlist" class="add-watchlist" onclick="remove('${movie.Title}')">
                  - Watchlist
                </button>

              </div>
              <p class="description">${movie.Plot}<a>Read More</a>
              </p>
            </div>
          </div>
        `;

      watchlistContentWrapper.innerHTML += watchlistMovieCardHTML;
    }
  }
}

if (watchlistContentWrapper) {
  renderWatchlistCards();
}
