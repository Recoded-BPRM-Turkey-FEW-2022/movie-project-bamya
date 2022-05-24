'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector("#movies");
const home = document.getElementById("home")
const genersNav = document.getElementById("genres")
const actors = document.getElementById("actors")


// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
};


// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};



// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  renderMovie(movieRes);

};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
  
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

// fetching genres

const fetchGenres = async () => {
  const url = constructUrl(`/genre/movie/list`);
  const res = await fetch(url);
  const data = await res.json()
  return data['genres']
  // console.log(data['genres'])
}

const getGenre = async (ida) => {
  const fetchGenre = await fetchGenres();
  fetchGenre.forEach((el) => {
    if (el.id === ida) {
       console.log(el.name)
    }
  });
}

//fetching actors

const fetchActors = async () => {
  const url = constructUrl(`person/popular`);
  const res = await fetch(url);
  const data = await res.json()
   return data.results
  // console.log(data.results)
}
// fetchActors()

const fetchActor = async (actorId) => {
  const url = constructUrl(`person/${actorId}`);
  const res = await fetch(url);
  const data = await res.json()
   return data
  // console.log(data)
}
// fetchActor(3080902)

const actorDetails = async (actor) => {
  const actorDetail = await fetchActor(actor.id);
  console.log(actorDetail)
  renderActor(actorDetail);
};



const fetchImg = async (id) => {
  const url = constructUrl(`person/${id}/images`);
  const res = await fetch(url);
  const data = await res.json()
   return data.results
  // console.log(data)
}
// fetchImg(3080902)


// adding genres to navbar 

const genresUl = async () => {
  const genres = await fetchGenres()
  // console.log(genres)
  const genersDD = document.createElement("ul")
  genersDD.classList.add("dropdown-menu")
  genersDD.setAttribute("aria-labelledby", "navbarDropdown")
  for(let i in genres){
    const li = document.createElement("li")
    li.classList.add("dropdown-item")
    li.innerHTML = genres[i]['name']
    // console.log(li)
    genersDD.appendChild(li)
  } 
  genersNav.appendChild(genersDD)
}
genresUl()



// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
    CONTAINER.innerHTML = ""
  const mainContainer = document.createElement("div");
  mainContainer.classList.add("row", "justify-content-center")
  movies.map((movie) => {
      // console.log(movie)

    const movieCard = document.createElement("div");
    movieCard.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster  ">

        <div class=" text-center">
        <h5>${movie.title}</h5>
        <span> ratings: ${movie.vote_average}/10</span>
  </div>`;
    movieCard.addEventListener("click", () => {
      movieDetails(movie);
    });
    // console.log()
    movieCard.classList.add("col-md-5", "col-lg-3", "card", "p-0")
    movieCard.classList.add("mainCard")
    mainContainer.appendChild(movieCard);
    CONTAINER.appendChild(mainContainer)
  });
};

// actors page 

const renderActors = (movies) => {
    CONTAINER.innerHTML = ""
  const mainContainer = document.createElement("div");
  mainContainer.classList.add("row", "justify-content-center")
  movies.map((movie) => {
      console.log(movie)

    const movieCard = document.createElement("div");
    movieCard.innerHTML = `
        <img src="${PROFILE_BASE_URL + movie.profile_path}" alt="${
      movie.name
    } poster  ">

        <div class=" text-center">
        <h5>${movie.name}</h5>
        <span> popularity: ${movie.popularity}/10</span>
  </div>`;
    movieCard.addEventListener("click", () => {
      actorDetails(movie);
      console.log(movie)
    });
    // console.log()
    movieCard.classList.add("col-md-5", "col-lg-3", "card", "p-0")
    movieCard.classList.add("mainCard")
    mainContainer.appendChild(movieCard);
    CONTAINER.appendChild(mainContainer)
  });
};




actors.addEventListener("click", async ()=> {
  const movies = await fetchActors()
  // console.log(movies)
  renderActors(movies)
})

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie) => {
  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
               BACKDROP_BASE_URL + movie.backdrop_path
             }>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${
              movie.release_date
            }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
        </div>
        </div>
            <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled"></ul>
    </div>`;
};

const renderActor = (actor) => {
  console.log(actor)
  CONTAINER.innerHTML = ""
    CONTAINER.innerHTML = `
 <div class="row " id="single-actor-page">
        <div class="col-lg-4 col-md-12 col-sm-12">
          <img id="actor-backdrop" src=${PROFILE_BASE_URL + actor.profile_path}> 
        </div>
        <div class="col-lg-8 col-md-12 col-sm-12">
          <h2 id="actor-name"><span>${actor.name}</span></h2>
          <h4>Gender:</h4>
          <p id="gender">${actor.gender}</p>
          <h4>Popularity:</h4>
          <p id="popularity">${actor.popularity}</p>
          <h4>Birthday:</h4>
          <p id="birthday">${actor.birthday}</p>
          ${actor.deathday}
          <h4>Biography:</h4>
           <p id="biography" style="color:#BDBDBD; font-size: .8rem;">${actor.biography}</p>
        </div>
        <div class="container" >
          <h4 class="row" style="padding:1rem;"> Related Movies:</h4> 
          <div class="row" id="knownFor"></div>
        </div>
      </div>  
    `
  const credits = async (id) =>{
    const url = constructUrl(`person/${id}/movie_credits`)
    const res = await fetch(url)
    const data = await res.json()
    const kf = data['cast']
    const knownFor = document.getElementById("knownFor")
    for (let i=0; i<5; i++){
      const movieCard = document.createElement("div");
    movieCard.innerHTML = `
        <img src="${BACKDROP_BASE_URL + kf[i].backdrop_path}" alt="${
          kf[i].title
    } poster  ">

        <div class=" text-center">
        <h5>${kf[i].title}</h5>
        <span> ratings: ${kf[i].vote_average}/10</span>
  </div>`;
  movieCard.classList.add("col-md-5", "col-lg-3", "card", "p-0")
    movieCard.classList.add("mainCard")
  knownFor.appendChild(movieCard)
  }
  } 
  
    credits(actor.id)
  
    
  };



document.addEventListener("DOMContentLoaded", autorun);
home.addEventListener("click", autorun)
