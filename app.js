"use strict";
// const apiUrl = "https://www.omdbapi.com/?s=2001&page=1&apikey=a7a94abb";

//will be exported to the constants page
const searchFieldElement = document.getElementById("search-input");
const cardsContainer = document.getElementById("cards-container");
const cardList = document.getElementById("card-list");
// const list = document.getElementById("list-item");
const resultsContainer = document.getElementById("results-container");

searchMovie(400);
async function searchMovie(searchTerm) {
  cardList.innerHTML = "";
  const url = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=a7a94abb`;
  const response = await fetch(url);
  const data = await response.json();
  const searchData = data.Search;
  // console.log(searchData);

  for (let i = 0; i < searchData.length; i++) {
    let list = document.createElement("div");
    list.dataset.id = searchData[i].imdbID;
    list.classList.add("list");
    let movieTitle = document.createElement("p");
    let image = document.createElement("img");
    movieTitle.classList.add("movie-title");
    let text = document.createTextNode(searchData[i].Title);

    list.appendChild(movieTitle);
    movieTitle.appendChild(text);
    list.appendChild(image);
    list.appendChild(movieTitle);
    cardList.appendChild(list);
    cardsContainer.appendChild(cardList);

    if (searchData[i].Poster != "N/A") {
      image.setAttribute("src", searchData[i].Poster);
    }
    // else {
    //   image = "./assets/poster-test.jpg";
    // }
  }
  loadDetails();
}

// function renderResults(movie) {}

function loadDetails() {
  const searchListMovies = cardList.querySelectorAll(".list");
  searchListMovies.forEach((movie) => {
    movie.addEventListener("click", async () => {
      cardList.style.display = "none";
      searchFieldElement.value = "";
      const result = await fetch(
        `http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=a7a94abb`
      );
      const movieDetails = await result.json();
      displayMovieDetails(movieDetails);
    });
  });
}

function displayMovieDetails(details) {
  resultsContainer.innerHTML = `<div class="poster">
  <img src=${details.Poster} alt="movie poster" />
</div>
  <div class="movie-details">
          <h1>${details.Title}</h1><br>
          <ul>
          <li class="plot"> ${details.Plot} </li><br>
          <li class="genre">Genre: ${details.Genre}</li>
          <li class="actors">Actors: ${details.Actors}<li>
          <li class="rated">Runtime: ${details.Runtime}</li>
          <li class="language">Language: ${details.Language}</li>
          <li class="year">Year: ${details.Year}</li>
          <li class="released">Released: ${details.Released}</li> 
          </ul>
        </div>`;
}

// if (!searchTerm) {
//   return;
// }

async function loadApp() {
  const searchFieldElement = document.getElementById("search-input");
  let timerId = null;
  searchFieldElement.addEventListener("keyup", () => {
    clearTimeout(timerId);
    if (searchFieldElement.value.trim().length === 0) {
      return;
    }
    timerId = setTimeout(() => {
      searchMovie(searchFieldElement.value.trim());
    }, 500);
  });
}

window.addEventListener("load", loadApp);
