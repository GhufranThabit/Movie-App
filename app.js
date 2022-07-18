"use strict";
// const apiUrl = "https://www.omdbapi.com/?s=2001&page=1&apikey=a7a94abb";

//will be exported to the constants page
const searchFieldElement = document.getElementById("search-input");
const cardsContainer = document.getElementById("cards-container");
const cardList = document.getElementById("card-list");
const resultsContainer = document.getElementById("results-container");

searchMovie(400);
async function searchMovie(searchTerm) {
  try {
    const url = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=a7a94abb`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.Response == "True") {
      renderResults(data.Search);
      document.getElementById("error-message").innerHTML = "";
    }
  } catch (error) {
    document.getElementById("error-message").innerHTML = error;
  }
}

function renderResults(searchData) {
  cardList.innerHTML = "";
  cardList.style.display = "block";
  // cardList.classList.remove("hide");
  resultsContainer.style.display = "none";
  // resultsContainer.classList.add("hide");
  for (let i = 0; i < searchData.length; i++) {
    const list = document.createElement("div");
    list.dataset.id = searchData[i].imdbID;
    list.classList.add("list");
    const movieTitle = document.createElement("p");
    const image = document.createElement("img");
    movieTitle.classList.add("movie-title");
    let text = document.createTextNode(searchData[i].Title);
    if (searchData[i].Poster != "N/A") {
      image.setAttribute("src", searchData[i].Poster);
    }
    // else{}
    list.appendChild(movieTitle);
    movieTitle.appendChild(text);
    list.appendChild(image);
    cardList.appendChild(list);
  }
  loadDetails();
}

function loadDetails() {
  const searchListMovies = cardList.querySelectorAll(".list");
  searchListMovies.forEach((movie) => {
    movie.addEventListener("click", async () => {
      cardList.style.display = "none";
      // cardList.classList.add("hide");
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
  resultsContainer.style.display = "block";
  // resultsContainer.classList.remove("hide");
  resultsContainer.innerHTML = `<div class="poster" >
  <img src=${details.Poster} alt="movie poster" />

</div>
  <div class="movie-details">
          <h1>${details.Title}</h1><br><br>
          <ul>
          <li class="plot"> ${details.Plot} </li><br>
          <li class="Ratings">Rating: ${details.imdbRating}</li><br>
          <li class="genre">Genre: ${details.Genre}</li><br>
          <li class="actors">Actors: ${details.Actors}<li><br>
          <li class="rated">Runtime: ${details.Runtime}</li><br>
          <li class="language">Language: ${details.Language}</li><br>
          <li class="year">Year: ${details.Year}</li><br>
          <li class="released">Released: ${details.Released}</li> 
          </ul>
        </div>`;
}

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
