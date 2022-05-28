'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector("#movies");
const home = document.getElementById("home")
const genersNav = document.getElementById("genres")
const actors = document.getElementById("actors")
const searchForm = document.getElementById("searchForm")
const searchInput = document.getElementById("search")


// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  renderMoviesHxH(movies.results);
};


// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};

// generate the genres url 
const genresUrl = (genreId) => {
  return `${TMDB_BASE_URL}/discover/movie?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}&sort_by=popularity.desc&with_genres=${genreId}`;
}

// generate the search url 
const searchUrl = (search) => {
  return `${TMDB_BASE_URL}/search/multi?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}&query=${search}`;
}



// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  renderMovie(movieRes);

};

const fetchTrailer = async (id) => {
  const url = constructUrl(`movie/${id}/videos`);
  const res = await fetch(url);
  const data = await res.json()
  // console.log(data)
  for ( let i in data.results){
    if(data.results[i].name === 'Official Trailer'){ 
      return data.results[i].key
      // console.log(data.results[i].key);
    }
  }
};
// fetchTrailer(453395)

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data)
  return data;

};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};


// generate the list of movies for one genre
const genreFilter = async (genreId) => {
  const url = genresUrl(genreId)
  const response = await fetch(url)
  const data = await response.json()
  renderMovies(data.results)
}


// fetch the genres object 
const fetchGenres = async () => {
  const url = constructUrl(`/genre/movie/list`);
  const res = await fetch(url);
  const data = await res.json()
  return data['genres']
}


// fetch the movie genre 
const getGenre = async (ida) => {
  const res = await fetchGenres();
  for (let i in res) {
    if (res[i].id === ida) {
      return res[i].name
    }
  }

}




// 




//fetching actors
const fetchActors = async () => {
  const url = constructUrl(`person/popular`);
  const res = await fetch(url);
  const data = await res.json()
  return data.results
}

// fetch one actor details object 
const fetchActor = async (actorId) => {
  const url = constructUrl(`person/${actorId}`);
  const res = await fetch(url);
  const data = await res.json()
  return data
}

// display one actor details on page 
const actorDetails = async (actor) => {
  const actorDetail = await fetchActor(actor.id);
  console.log(actorDetail)
  renderActor(actorDetail);
};



// adding genres to navbar 

const genresUl = async () => {
  const genres = await fetchGenres()
  const genresList = document.createElement("ul")
  genresList.classList.add("dropdown-menu")
  genresList.setAttribute("aria-labelledby", "navbarDropdown")

  // looping through the genres array and creating list items
  for (let i in genres) {
    const li = document.createElement("li")
    li.classList.add("dropdown-item")
    li.innerHTML = genres[i]['name']
    genresList.appendChild(li) 
    // on click event for each list item fetch the movies for that genre
    li.addEventListener('click', () => {
      genreFilter(genres[i].id)
    })

  }
  genersNav.appendChild(genresList)
}
genresUl()


// search movie 

//fetch results

const searchRes = async (value) => {
  const url = searchUrl(value)
  const res = await fetch(url)
  const data = await res.json()
  return data.results
}


// search on submit

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault
  const results = await searchRes(searchInput.value)
  renderMovies(results)
})


// getting genres for each movie and creting span for each genre
async function getGenr(movie) {
  let genreSpan = document.createElement("div")
  for (let i in movie.genre_ids) {
    const res = await getGenre(movie.genre_ids[i])
    const span = document.createElement("span")
    span.innerHTML = res + " | "
    genreSpan.appendChild(span)
  }
  return genreSpan;
}


// rendering movies
const renderMovies = (movies) => {
  CONTAINER.innerHTML = ""
  const mainContainer = document.createElement("div");
  mainContainer.classList.add("row", "justify-content-center")
  movies.map(async (movie) => {
    console.log(movie);
    let genr = await getGenr(movie)
    let imagePath = "/no_image.jpg";
    if (movie.backdrop_path !== null)
      imagePath = BACKDROP_BASE_URL + movie.backdrop_path;

    const movieCard = document.createElement("div");
    movieCard.classList.add("mainCard")

    const genres = document.createElement("span")
    movieCard.innerHTML = `
         <img src="${imagePath} " alt="${movie.title
      } poster  ">
 
         <div id="cardBody" class="cardBody text-center">
         <h5>${movie.title}</h5>
         <span class=""> ratings: <span class=" badge text-bg-primary">${movie.vote_average}/10</span> </span>
         <p>genre: <span class=" badge text-bg-primary">${genr.innerHTML}</span> </p> 
   </div>`;
    const cardBody = document.querySelector(".mainCard .cardBody")
    movieCard.addEventListener("click", () => {
      movieDetails(movie);
    });


    movieCard.classList.add("col-md-5", "col-lg-3", "card", "p-0")
    mainContainer.appendChild(movieCard);
    CONTAINER.appendChild(mainContainer)



  });
};




const renderMoviesHxH = (movies) => {
  CONTAINER.innerHTML = ""
  const post = document.createElement("div")
  // post.classList.add("container")
  post.innerHTML = `
    <section class="banner">
        <div class="banner-card">

          <img src="https://wallpaperaccess.com/full/3537597.jpg" class="banner-img"  alt="">

          <div class="card-content">
            <div class="card-info">

              <div class="genre">
                <ion-icon name="film"></ion-icon>
                <span class="badge bg-primary">Action/Thriller/Anime</span>
              </div>

              <div class="year">
                <span class="badge bg-primary">2022</span>
              </div>
            </div>
            <h2 class="card-title">THE GREATEST COMEBACK</h2>
          </div>

        </div>
      </section>
    `
  const popBar = document.createElement("div")
  popBar.innerHTML = `
    <div class="filter-bar">
    <h2>Now Playing</h2>
  </div>
    `
  CONTAINER.appendChild(post)
  CONTAINER.appendChild(popBar)
  const mainContainer = document.createElement("div");
  mainContainer.classList.add("row", "justify-content-center")
  movies.map(async (movie) => {

    let genr = await getGenr(movie)
    let imagePath = "/no_image.jpg";
    if (movie.backdrop_path !== null)
      imagePath = BACKDROP_BASE_URL + movie.backdrop_path;

    const movieCard = document.createElement("div");
    movieCard.classList.add("mainCard")

    const genres = document.createElement("span")
    movieCard.innerHTML = `
         <img src="${imagePath} " alt="${movie.title
      } poster  ">
 
         <div id="cardBody" class="cardBody text-center">
         <h5>${movie.title}</h5>
         <span class=""> ratings: <span class=" badge text-bg-primary">${movie.vote_average}/10</span> </span>
         <p>genre: <span class=" badge text-bg-primary">${genr.innerHTML}</span> </p> 
   </div>`;
    const cardBody = document.querySelector(".mainCard .cardBody")
    movieCard.addEventListener("click", () => {
      movieDetails(movie);
    });


    movieCard.classList.add("col-md-5", "col-lg-3", "card", "p-0")
    mainContainer.appendChild(movieCard);
    CONTAINER.appendChild(mainContainer)



  });
};





// render actor details
// actors page 

const renderActors = (movies) => {
  CONTAINER.innerHTML = ""
  const mainContainer = document.createElement("div");
  mainContainer.classList.add("row", "justify-content-center")
// looping through the actors array and creating cards for each actor
  movies.map((movie) => {
    console.log(movie)

    let imagePath = "/no_image.jpg";
    if (movie.profile_path !== null)
      imagePath = PROFILE_BASE_URL + movie.profile_path;


    const movieCard = document.createElement("div");
    movieCard.innerHTML = `
        <img class="img-responsive" src="${imagePath}" alt="${movie.name
      } poster  ">

        <div class=" text-center">
        <h5>${movie.name}</h5>
        <span> popularity: ${movie.popularity}/10</span>
  </div>`;

  // calling the actor details function on click
    movieCard.addEventListener("click", () => {
      actorDetails(movie);
    });
    movieCard.classList.add("col-md-5", "col-lg-3", "card", "p-0")
    movieCard.classList.add("mainCard")
    mainContainer.appendChild(movieCard);
    CONTAINER.appendChild(mainContainer)
  });
};



// click event for each actor card
actors.addEventListener("click", async () => {
  const movies = await fetchActors()
  renderActors(movies)
})


// get related movies
const movieRelated = async (id) => {
  const url = constructUrl(`movie/${id}/similar`)
  const res = await fetch(url)
  const data = await res.json()
  const arrOfResults = data.results
  // desplay related movies
  for (let i = 0; i < 5; i++) {
    let imagePath = "/no_image.jpg";
    if (arrOfResults[i].backdrop_path !== null) {
      imagePath = BACKDROP_BASE_URL + arrOfResults[i].backdrop_path;
    }

    const movieCard = document.createElement("div");
    movieCard.innerHTML = `
      <img class="" src="${imagePath}" alt="${arrOfResults[i].title
      } poster  ">

      <div class=" text-center">
      <h5>${arrOfResults[i].title}</h5>
      <span> popularity: ${arrOfResults[i].popularity}/10</span>
</div>`;
    movieCard.classList.add("col-md-5", "col-lg-3", "card", "p-0")
    movieCard.classList.add("mainCard")
    knownForR.appendChild(movieCard)

    movieCard.addEventListener("click", () => {
      actorDetails(arrOfResults[i]);
      console.log(movie)
    });

  }
}

// getting the director for a specific movie

const director = async (id) => {
  const url = constructUrl(`movie/${id}/credits`)
  const res = await fetch(url)
  const data = await res.json()
  const arrOfResults = data.crew


  for (let i in data["crew"]) {
    if (data["crew"][i].known_for_department === 'Directing') {
      return data["crew"][i].name
    }
  }
}


// get movie cast

const movieCredits = async (id) => {
  const url = constructUrl(`movie/${id}/credits`)
  const res = await fetch(url)
  const data = await res.json()
  const arrOfResults = data['cast']
  console.log(data)

  const knownFor = document.getElementById("knownForM")
  const dir = document.getElementById("director")

  // displaying the cast on the DOM
  for (let i = 0; i < 5; i++) {

    let imagePath  = "/no_image.jpg";
    if (arrOfResults[i].profile_path !== null)
      imagePath = PROFILE_BASE_URL + arrOfResults[i].profile_path;
 
    const movieCard = document.createElement("div");
    movieCard.innerHTML = `
      <img src="${imagePath}" alt="${arrOfResults[i].title
      } poster  ">

      <div class=" text-center">
      <h5>${arrOfResults[i].name}</h5>
      <span> popularity: ${arrOfResults[i].popularity}/10</span>
</div>`;
    movieCard.classList.add("col-md-5", "col-lg-2", "card", "p-0")
    movieCard.classList.add("mainCard")
    knownFor.appendChild(movieCard)
      // display the actor page on click
    movieCard.addEventListener("click", () => {
      actorDetails(arrOfResults[i]);
    });

  }
}


// display one movie details on the DOM
const renderMovie = async (movie) => {
  console.log(movie.id);
  let ddd = await director(movie.id)
  const trailer = await fetchTrailer(movie.id)
  
  CONTAINER.innerHTML = `
    <div id="movie" class="row"> 
    <div class="shadow"></div>
  
        <img id="movie-backdrop" src=${BACKDROP_BASE_URL + movie.backdrop_path
        }>
        <div class="col-md-8" id="movieText">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${movie.release_date
    }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h2 >director:</h2>
            <p id="director">${ddd}</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
        </div>
        </div>
        <div class="actors">
        <h3 >Actors:</h3>
            <div class="row" id="knownForM"></div>
        </div>
        <iframe src=https://www.youtube.com/embed/${trailer}" frameborder="0"></iframe>
        <div class="related">
        <h3>Related movies:</h3>
            <div class="row" id="knownForR"></div>
        </div>
     
    </div>`;
    const movieBg = document.getElementById("movie");
  movieCredits(movie.id)
  movieRelated(movie.id)
};

// display one actor details on the DOM
const renderActor = (actor) => {
  console.log(actor)
  CONTAINER.innerHTML = ""
  CONTAINER.innerHTML = `
 <div class="row " id="single-actor-page">
        <div class="col-lg-4 col-md-12 col-sm-12">
          <img id="actor-backdrop" src=${PROFILE_BASE_URL + actor.profile_path}> 
        </div>
        <div id="actor-text" class="col-lg-8 col-md-12 col-sm-12">
          <h2 id="actor-name"><span>${actor.name}</span></h2>
          <h4>Gender:</h4>
          <p id="gender">${actor.gender == 1 ? "famale" : "male"}</p>
          <h4>Popularity:</h4>
          <p id="popularity">${actor.popularity}</p>
          <h4>Birthday:</h4>
          <p id="birthday">${actor.birthday}</p>
          <h4 id="deathH">Deathday:</h4>
          <p id="deathday">${actor.deathday}</p>
          
          <h4>Biography:</h4>
           <p id="biography" style="color:#BDBDBD; font-size: .8rem;">${actor.biography}</p>
        </div>
        <div class="container mt-5" >
          <h4  id="moviesBy" style="padding:1rem;"> Related Movies:</h4> 
          <div class="row justify-content-center" id="knownFor"></div>
        </div>
      </div>  
    `

  if (actor.deathday === null) {
    document.getElementById("deathday").remove()
    document.getElementById("deathH").remove()
  }
  credits(actor.id)
};

// get movies by specific actor
const credits = async (id) => {
  const url = constructUrl(`person/${id}/movie_credits`)
  const res = await fetch(url)
  const data = await res.json()
  const arrOfResults = data['cast']
  const knownFor = document.getElementById("knownFor")
  for (let i = 0; i < 5; i++) {
    let imagePath = "/no_image.jpg";
    if (arrOfResults[i].backdrop_path !== null) {
      imagePath = BACKDROP_BASE_URL + arrOfResults[i].backdrop_path;
      const movieCard = document.createElement("div");
      movieCard.innerHTML = `
        <img src="${imagePath}" alt="${arrOfResults[i].title
        } poster  ">
        <div class=" text-center">
        <h5>${arrOfResults[i].title}</h5>
        <span> ratings: ${arrOfResults[i].vote_average}/10</span>
  </div>`;
      movieCard.classList.add("col-md-5", "col-lg-3", "card", "p-0")
      movieCard.classList.add("mainCard")
      knownFor.appendChild(movieCard)

      movieCard.addEventListener("click", () => {
        movieDetails(arrOfResults[i]);
      });
    }

  }

}
document.addEventListener("DOMContentLoaded", autorun);
home.addEventListener("click", autorun)





/*filter section*/


const filtersNav = document.getElementById("filter")

// by popularity
const filterPopular = async () => {
  const url = constructUrl(`movie/popular`);
  const res = await fetch(url);
  const data = await res.json();
  renderMovies(data.results);
}

const popular_movies = document.getElementById("popularmovies")
popularmovies.addEventListener("click", filterPopular)


//by latest

const filterrelasedate = async () => {
  const url = constructUrl(`movie/latest`);
  const res = await fetch(url);
  const data = await res.json();
  renderMovie(data)
}

const last_relesed = document.getElementById("relasedatemovies")
relasedatemovies.addEventListener("click", filterrelasedate)

//by top_rated

const filterToprated = async () => {
  const url = constructUrl(`movie/top_rated`);
  const res = await fetch(url);
  const data = await res.json();
  renderMovies(data.results);
}

const top_rated = document.getElementById("topratedmovies")
topratedmovies.addEventListener("click", filterToprated)

//Now_plating

const filterNowplaying = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  const data = await res.json();
  renderMovies(data.results);
}

const now_playing = document.getElementById("nowplayingmovies")
nowplayingmovies.addEventListener("click", filterNowplaying)

//Up_coming

const filterUpcoming = async () => {
  const url = constructUrl(`movie/upcoming`);
  const res = await fetch(url);
  const data = await res.json();
  renderMovies(data.results);
}

const Upcoming_movies = document.getElementById("upcomingmovies")
upcomingmovies.addEventListener("click", filterUpcoming)



// About section 
const about = document.getElementById("about")
about.addEventListener("click",() => {

  CONTAINER.innerHTML =`
  <div id="aboutDiv" class="container">

  <section >
    
    <div   class="">
      
      <div  class="row ">

        <div class="col-md-4">
          <img class="" src="enjoy.png" alt="about image">
        </div>

        <div class="col-md-6 p-5 align-self-center">

          <h5 class="font-weight-normal mb-3 text-white">Project detail</h5>

          <p class="">This project was made by two young students who have the ambition 
          for coding during  Re:Coded Bootcamp for front-end development. The main goal of this 
          project is to pull data from The Movie DB API and display it on the website. You can check 
          the movie list from the main page and you can also choose the movies you like. There is 
          great information about actors and the latest movies etc. on the website, so we recommend 
          you to take a deeper look and explore the movies. we would like to hear from you about your 
          experience.</p>

          <ul class="list-unstyled font-small">
           
            <li>
              <p class="text-uppercase mb-2"><b>Date</b></p>
              <p class=" mb-4">29.05.2022</p>
            </li>

            <li>
              <p class="text-uppercase mb-2"><b>Programming language</b></p>
              <p class=" mb-4">HTML, CSS, Javascript</p>
            </li>

            <li>
            <p class="text-uppercase mb-2"><b>By</b></p>
            <p class=" mb-4">Mohamad AGHİ & Kemal DAVUT</p>
          </li>

          </ul>

        </div>

      </div>

    </div>

  </section>

</div>
  `
})

