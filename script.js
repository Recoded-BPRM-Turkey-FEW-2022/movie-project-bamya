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
  renderMovies(movies.results);
};


// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};

const genresUrl = (genreId) => {
  return `${TMDB_BASE_URL}/discover/movie?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}&sort_by=popularity.desc&with_genres=${genreId}`;
}

const searchUrl = (search) => {
  return `${TMDB_BASE_URL}/search/multi?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}&query=${search}`;
}



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

const genreFilter = async (genreId) => {
    const url = genresUrl(genreId)
    const response = await fetch(url)
    const data = await response.json()
    //const movies = await data.results;
    console.log(data.results);
    // return data.results.map(movie => new Movie(movie));
    //return data.results

  // empty aray to hold the movies of on genre
  // let arr = []
  // for (let i in data){
  //   if (data[i].genre_ids.includes(genderId)){
  //     arr.push(movies[i])
  //   }
renderMovies(data.results)
  }


// const genreFilter = async (genderId) => {
//   console.log(genderId)
//   const res = await fetchMovies()
//   const movies = await res.results
//   // empty aray to hold the movies of on genre
//   let arr = []
//   for (let i in movies){
//     if (movies[i].genre_ids.includes(genderId)){
//       arr.push(movies[i])
//     }

//   }
//   renderMovies(arr)
// }


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






// const fetchDiscover =  async (gId) => {
//   const url = genresConstructUrl(gId)
//   const response = await fetch(url)
//   const data = await response.json()
//   //const movies = await data.results;
//   console.log(data.results);
//   // return data.results.map(movie => new Movie(movie));
//   //return data.results
// }




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
    console.log(genres[i].id)
    genersDD.appendChild(li)
    // clicking on the genre 
    li.addEventListener('click', ()=> {
      genreFilter(genres[i].id)
    })

  } 
  genersNav.appendChild(genersDD)
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




searchForm.addEventListener("submit", async (e) => {
  e.preventDefault
  const results = await searchRes(searchInput.value)
  renderMovies(results)
})



// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
    CONTAINER.innerHTML = ""
  const mainContainer = document.createElement("div");
  mainContainer.classList.add("row", "justify-content-center")
  movies.map((movie) => {
      // console.log(movie)

    const movieCard = document.createElement("div");
    movieCard.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path} " alt="${
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



const movieCredits = async (id) =>{
  const url = constructUrl(`movie/${id}/credits`)
  const res = await fetch(url)
  const data = await res.json()
  const kf = data['cast']
  console.log(data)
  const knownFor = document.getElementById("knownForM")
  for (let i=0; i<5; i++){
    console.log(kf[i])
    const movieCard = document.createElement("div");
  movieCard.innerHTML = `
      <img src="${PROFILE_BASE_URL + kf[i].profile_path}" alt="${
        kf[i].title
  } poster  ">

      <div class=" text-center">
      <h5>${kf[i].name}</h5>
      <span> popularity: ${kf[i].popularity}/10</span>
</div>`;
movieCard.classList.add("col-md-5", "col-lg-3", "card", "p-0")
  movieCard.classList.add("mainCard")
knownFor.appendChild(movieCard)
}
} 






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
            <div class="row" id="knownForM"></div>
    </div>`;
    movieCredits(movie.id)
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
          <h4>Deathday:</h4>
          <p id="deathday">${actor.deathday}</p>
          
          <h4>Biography:</h4>
           <p id="biography" style="color:#BDBDBD; font-size: .8rem;">${actor.biography}</p>
        </div>
        <div class="container" >
          <h4 class="row" style="padding:1rem;"> Related Movies:</h4> 
          <div class="row" id="knownFor"></div>
        </div>
      </div>  
    `
  
    if (actor.deathday === null) document.getElementById("deathday").remove()
    credits(actor.id)
  
    
  };


  const credits = async (id) =>{
    const url = constructUrl(`person/${id}/movie_credits`)
    const res = await fetch(url)
    const data = await res.json()
    const kf = data['cast']
    const knownFor = document.getElementById("knownFor")
    for (let i=0; i<10; i++){
      console.log(kf)
      if(kf[i].backdrop_path === null) continue;
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


document.addEventListener("DOMContentLoaded", autorun);
home.addEventListener("click", autorun)



// const img = document.getElementsByTagName("img")
// console.log(img)
// for(let i in img){
  
//   img[i].addEventListener("error", function(event) {
//     // console.log("clicked")
//     event.target.src = "https://i.stack.imgur.com/z0eJf.png"
//     event.onerror = null
//   })
// }



/*filter section*/

/*<a id="popularmovies" class="dropdown-item" href="#">Popular</a>
                        <a id="relasedate"class="dropdown-item" href="#">Relase date</a>
                        <a id="toprated"class="dropdown-item" href="#">Top rated</a>
                        <a id="nowplaying"class="dropdown-item" href="#">Now playing</a>
                        <a id="upcoming"class="dropdown-item" href="#">Up coming</a> */ 


const filtersNav = document.getElementById("filter")
//popular
const filterPopular = async () => {
  const url = constructUrl(`movie/popular`);
  const res = await fetch(url);
  const data = await res.json();
  renderMovies(data.results);
}  

const popular_movies = document.getElementById("popularmovies") 
popularmovies.addEventListener("click",filterPopular)


//latest

const filterrelasedate = async () => {
  const url = constructUrl(`movie/latest`);
  const res = await fetch(url);
  const data = await res.json();
  renderMovies(data.results)
}

const last_relesed = document.getElementById("relasedatemovies") 
relasedatemovies.addEventListener("click",filterrelasedate)

//top_rated

const filterToprated = async () => {
  const url = constructUrl(`movie/top_rated`);
  const res = await fetch(url);
  const data = await res.json();
  renderMovies(data.results);
}

const top_rated = document.getElementById("topratedmovies") 
topratedmovies.addEventListener("click",filterToprated)

//Now_plating

const filterNowplaying= async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  const data = await res.json();
  renderMovies(data.results);
}

const now_playing = document.getElementById("nowplayingmovies") 
nowplayingmovies.addEventListener("click",filterNowplaying)

//Up_coming

const filterUpcoming= async () => {
  const url = constructUrl(`movie/upcoming`);
  const res = await fetch(url);
  const data = await res.json();
  renderMovies(data.results);
}

const Upcoming_movies = document.getElementById("upcomingmovies") 
upcomingmovies.addEventListener("click",filterUpcoming)
