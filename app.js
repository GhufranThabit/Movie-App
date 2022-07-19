"use strict";
const apiUrl = "https://www.omdbapi.com/?s=2001&page=1&apikey=a7a94abb";

//will be exported to the constants page
const searchFieldElement = document.getElementById("search-input");
const cardsContainer = document.getElementById("cards-container");
const cardList = document.getElementById("card-list");
const resultsContainer = document.getElementById("results-container");
// import {searchFieldElement, cardsContainer, cardList, resultsContainer} from "./"

searchMovie(400);
async function searchMovie(searchTerm, pageIndex = 1) {
  try {
    const data = await fetchMovies(searchTerm, pageIndex);
    if (data.Response == "True") {
      renderResults(data.Search);

      document.getElementById("error-message").innerHTML = "";
    }
    const totalResults = parseInt(data.totalResults, 10);
    console.log(totalResults);
    const totalPages = Math.ceil(totalResults / 10);
    console.log(totalPages);
  } catch (error) {
    document.getElementById("error-message").innerHTML = error;
  }
}

async function fetchMovies(searchTerm, pageIndex = 1) {
  const url = `https://www.omdbapi.com/?s=${searchTerm}&page=${pageIndex}&apikey=a7a94abb`;
  const response = await fetch(url);
  return response.json();
}

function renderResults(searchData) {
  cardList.innerHTML = "";
  cardList.classList.remove("hide");
  resultsContainer.classList.add("hide");
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

    list.appendChild(image);
    list.appendChild(movieTitle);
    movieTitle.appendChild(text);
    cardList.appendChild(list);
  }
  loadDetails();
}

function loadDetails() {
  const searchListMovies = cardList.querySelectorAll(".list");
  searchListMovies.forEach((movie) => {
    movie.addEventListener("click", async () => {
      cardList.classList.add("hide");
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
  resultsContainer.classList.remove("hide");
  resultsContainer.innerHTML = `<div class="poster" >
  <img src=${details.Poster} alt="movie poster" />

</div>
  <div class="movie-details">
          <h1>${details.Title}</h1><br><br>
          <ul>
          <li class="plot"> ${details.Plot} </li><br>
          <li class="Ratings"><strong>Rating: </strong>${details.imdbRating}</li><br>
          <li class="genre"><strong>Genre: </strong>${details.Genre}</li><br>
          <li class="actors"><strong>Actors: </strong>${details.Actors}<li><br>
          <li class="rated"><strong>Runtime:</strong> ${details.Runtime}</li><br>
          <li class="language"><strong>Language:</strong> ${details.Language}</li><br>
          <li class="year"><strong>Year:</strong> ${details.Year}</li><br>
          <li class="released"><strong>Released: </strong>${details.Released}</li> 
          </ul>
        </div>`;
}

async function loadApp() {
  const searchFieldElement = document.getElementById("search-input");
  let timerId = null;
  let searchValue;
  let pageIndex;
  let totalPages = 0;
  searchFieldElement.addEventListener("keyup", () => {
    clearTimeout(timerId);
    if (searchFieldElement.value.trim().length === 0) {
      return;
    }
    if (searchFieldElement.value.trim().length < 3) {
      // cardList.classList.add("hide");
      console.log("NO RESULTS FOUND");
    }
    timerId = setTimeout(async () => {
      searchValue = searchFieldElement.value.trim();
      pageIndex = 1;
      const data = await fetchMovies(searchValue, pageIndex);
      if (data.Response == "True") {
        renderResults(data.Search);
        const totalResults = parseInt(data.totalResults, 10);
        console.log(totalResults);
        totalPages = Math.ceil(totalResults / 10);
        console.log(totalPages);
        document.getElementById("error-message").innerHTML = "";
      }
    }, 500);
  });
  const nextBtn = document.getElementById("next");
  nextBtn.addEventListener("click", async () => {
    if (pageIndex < totalPages) {
      pageIndex++;
      const data = await fetchMovies(searchValue, pageIndex);
      if (data.Response == "True") {
        renderResults(data.Search);
      }
    }
  });
  const prevBtn = document.getElementById("prev");
  prevBtn.addEventListener("click", async () => {
    if (pageIndex > 1) {
      pageIndex--;
      const data = await fetchMovies(searchValue, pageIndex);
      if (data.Response == "True") {
        renderResults(data.Search);
      }
    }
  });
}

window.addEventListener("load", loadApp);
