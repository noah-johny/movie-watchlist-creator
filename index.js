import watchlistContentWrapper from "./watchlist.js";
import watchlistBtn from "./watchlist.js";

const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const contentWrapper = document.getElementById("content-wrapper");


let movieTitle = "";

const addedMovies = [];
let existingMovies = [];
localStorage.setItem("addedMovies", JSON.stringify(addedMovies));

searchInput.addEventListener("input", (e) => {
  movieTitle = searchInput.value;
  renderCards();
});

watchlistBtn.addEventListener("click", (e) => {
  renderWatchlistCards();
});

function renderWatchlistCards() {
  watchlistContentWrapper.replaceChildren();

  console.log(localStorage.getItem("addedMovies"));

  watchlistContentWrapper.appendChild(movieCard);
}

function renderCards() {
  contentWrapper.replaceChildren();
  console.log(movieTitle);
  fetch("http://www.omdbapi.com/?apikey=d09c5b1f&s=" + movieTitle)
    .then((res) => res.json())
    .then((data) => {
      for (let i in data.Search) {
        console.log(data.Search[i].Title);
        fetch(
          "http://www.omdbapi.com/?apikey=d09c5b1f&t=" + data.Search[i].Title
        )
          .then((res) => res.json())
          .then((movie) => {
            let movieCard = document.createElement("div");
            movieCard.classList.add("movie-card");
            movieCard.setAttribute("id", "movie-card-" + i);

            let addWatchlist = "add-watchlist-" + i;

            movieCard.innerHTML = `
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
\                    <p class="score-value">${movie.imdbRating}</p>
                  </div>
                </div>
                <div class="info">
                  <h5 class="duration">${movie.Runtime}</h5>
                  <h5 class="genre">${movie.Genre}</h5>
                  <button id=${addWatchlist} class="add-watchlist" onclick="watchlistClick(event)">
                    +
                    Watchlist
                  </button>
                </div>
                <p class="description">${movie.Plot}<a>Read More</a>
                </p>
              </div>
            `;

            contentWrapper.appendChild(movieCard);
          });
      }
    });
}
