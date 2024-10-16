/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { data } from "autoprefixer";
import { useEffect, useState, useRef } from "react";
import "./App.css";
import { StarRating } from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const KEY = "6a3b612c";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function Search({ query, setQuery }) {
  // const [query, setQuery] = useState("");
  const myRef = useRef(null)

  useKey("enter",function(){
    console.log('enter')

    if(document.activeElement === myRef.current){
      return 
    }
      setQuery('')
      myRef.current.focus()
  })

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      ref={myRef}
      value={query}
      onChange={(e) => setQuery(e)}
    />
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function NumSearch({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Movie({ movie, onSelectMovies }) {
  return (
    <li onClick={() => onSelectMovies(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
        {movie.imdbRating ? (
          <p>
            <span>🗓</span>
            <span>{movie.imdbRating}</span>
          </p>
        ) : (
          ""
        )}
        {movie.userRating ? (
          <p>
            <span>🗓</span>
            <span>{movie.userRating}</span>
          </p>
        ) : (
          ""
        )}

        {movie.runtime ? (
          <p>
            <span>🗓</span>
            <span>{movie.runtime}</span>
          </p>
        ) : (
          ""
        )}
      </div>
    </li>
  );
}
function MovieList({ movies, onSelectMovies }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          onSelectMovies={onSelectMovies}
        />
      ))}
    </ul>
  );
}

// eslint-disable-next-line react/prop-types
function ButtonOpen({ isOpen, setIsOpen }) {
  return (
    <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
      {isOpen ? "–" : "+"}
    </button>
  );
}
function List({ movies, onSelectMovies }) {
  const [isOpen1, setIsOpen1] = useState(true);

  return (
    <div className="box">
      <ButtonOpen isOpen={isOpen1} setIsOpen={setIsOpen1} />
      {isOpen1 && <MovieList movies={movies} onSelectMovies={onSelectMovies} />}
    </div>
  );
}

function WatchedMovie({ watched, onDelete }) {
  return (
    <>
      <ul className="list list-movies">
        {watched.map((movie) => (
          <li key={movie.imdbID}>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
              {movie.imdbRating ? (
                <p>
                  <span>🗓</span>
                  <span>{movie.imdbRating}</span>
                </p>
              ) : (
                ""
              )}
              {movie.userRating ? (
                <p>
                  <span>🗓</span>
                  <span>{movie.userRating}</span>
                </p>
              ) : (
                ""
              )}

              {movie.Runtime ? (
                <p>
                  <span>🗓</span>
                  <span>{movie.Runtime}Min</span>
                </p>
              ) : (
                ""
              )}
              <button
                className="btn-delete"
                onClick={() => onDelete(movie.imdbID)}
              >
                X
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const countRef = useRef(0)
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
   const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    Plot: plot,
    imdbRating,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;
 
  function handleAdd() {
    const newMovie = {
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      imdbID: selectedId,
      Runtime: Number(movie.Runtime.split(" ").at(0)),
      imdbRating: Number(imdbRating),
      userRating,
      countRatingDecisions:countRef.current
    };
    onAddWatched(newMovie);
    onCloseMovie();
  }


useEffect(function(){

   if(userRating)countRef.current++;

},[userRating])

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        try {
          const response = await fetch(
            `https://www.omdbapi.com/?apikey=3305d42f&i=${selectedId}`
          );

        

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setMovie(data);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
        }
      }

      getMovieDetails();
    },
    [selectedId]
  );

   useEffect(function(){
    if(!title) return ;
     document.title = `movie | ${title}`
     return function(){
      document.title= 'usepopcorn'
     }
   },[title])



   useKey('Escape',onCloseMovie);
/*    useEffect(function(){
     function callback(e){
        if(e.code === 'Escape'){
          onCloseMovie()
          console.log()
        }
        
     }

     document.addEventListener('keydown',callback)

    return function(){
      document.removeEventListener('keydown',callback)
    }
 },[onCloseMovie])

 */  return (
    <div className="details box">
      {isLoading && <Loader />}
      <header>
        <button className="btn-back" onClick={onCloseMovie}>
          &larr;
        </button>
        <img alt={`poster of the ${movie} movie`} src={movie.Poster} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} |&bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐</span>
            {imdbRating} IMDB rating
          </p>
        </div>
      </header>
      <section>
        <div className="rating">
          {!isWatched ? (
            <>
              <StarRating
                maxRating={10}
                size="24"
                onSetRating={setUserRating}
              />
              {userRating > 0 && (
                <button className="btn-add" onClick={handleAdd}>
                  + Add to list
                </button>
              )}
            </>
          ) : (
            <p>
              you have rated this movie {watchedUserRating}
              <span>🌟</span>
            </p>
          )}
        </div>
        <p>
          <em>{plot}</em>
        </p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  );
}

function Summary({ watched, onDelete }) {
  const [isOpen2, setIsOpen2] = useState(true);
  const avgImdbRating = average( watched ?watched.map((movie) => movie.imdbRating):0);
  const avgUserRating = average(watched? watched.map((movie) => movie.userRating) :0);
  const avgRuntime = average( watched ?watched.map((movie) => movie.Runtime): 0);
  return (
    <div className="box">
      <ButtonOpen isOpen={isOpen2} setIsOpen={setIsOpen2} />
      {isOpen2 && (
        <>
          <div className="summary">
            <h2>Movies you watched</h2>
            <div>
              <p>
                <span>#️⃣</span>
                <span> {watched? watched.length: 0} movies</span>
              </p>
              <p>
                <span>⭐️</span>
                <span>{ avgImdbRating? avgImdbRating.toFixed(2):0}</span>
              </p>
              <p>
                <span>🌟</span>
                <span>{avgUserRating? avgUserRating.toFixed(2):0}</span>
              </p>
              <p>
                <span>⏳</span>
                <span>{ avgRuntime? avgRuntime.toFixed(2):0} min</span>
              </p>
            </div>
          </div>
          <WatchedMovie watched={watched} onDelete={onDelete} />
        </>
      )}
    </div>
  );
}
function Menu({ children }) {
  return <main className="main">{children}</main>;
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Loader() {
  return <p className="loader">....loading</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      {" "}
      <span>👧</span>
      {message}
    </p>
  );
}
export default function App() {

  

  const [watched,setWatched] = useLocalStorageState([],'watched')

  const [query, setQuery] = useState("");
 // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState("");
  const [selectedId, setSeclectedId] = useState(null);

  function handleAddWatch(movie) {
    setWatched((watched) => [...watched, movie]);
  //  localStorage.setItem('watched', JSON.stringify([...watched, movie]))
  }

 const {movies,isLoading, error} = useMovies(query,setSeclectedId)

  function handleSelectedId(id) {
    setSeclectedId((selectedId) => (id === selectedId ? null : id));
  }
  function handleCloseMovi() {
    setSeclectedId(null);
  }
  function changeQuery(event) {
    setQuery(event.target.value);
  }

  function habdleDelete(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }




  
  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={changeQuery} />
        <NumSearch movies={movies} />
      </NavBar>

      <Menu>
        {isLoading && <Loader />}
        {!isLoading && !error && (
          <List movies={movies} onSelectMovies={handleSelectedId} />
        )}
        {error && <ErrorMessage message={error} />}

        {selectedId ? (
          <MovieDetails
            selectedId={selectedId}
            onCloseMovie={handleCloseMovi}
            onAddWatched={handleAddWatch}
            watched={watched}
          />
        ) : (
          <Summary watched={watched} onDelete={habdleDelete} />
        )}
      </Menu>
    </>
  );
}
