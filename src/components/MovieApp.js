// // here you export the movieApp.js


import React, { useEffect, useState } from "react";
import './MovieApp.css'; // import the MovieApp.css
import { AiOutlineSearch } from "react-icons/ai"; // import the react icon
import axios from "axios"; // Axios is used to help to fetch data from Api

export default function MovieApp() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // usestate Hook
  const [sortBy, setSortBy] = useState('popularity.desc'); // Sorting in sortBy button
  const [genres, setGenres] = useState([]); // Genre
  const [selectedGenre, setSelectedGenre] = useState(''); // Genre
  const [expandedMovieId, setExpandedMovieId] = useState(null);

  useEffect(() => { // we use useEffect function to fetch Genre data
    const fetchGenres = async () => {
      const response = await axios.get(
        "https://api.themoviedb.org/3/genre/movie/list",
        {
          params: {
            api_key: 'ad62f36baea0f1efd8cd9981c7bdbca0',
          }
        }
      );
      setGenres(response.data.genres);
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      const response = await axios.get(
        "https://api.themoviedb.org/3/discover/movie",
        {
          params: {
            api_key: 'ad62f36baea0f1efd8cd9981c7bdbca0',
            sort_by: sortBy,
            page: 1,
            with_genres: selectedGenre,
            query: searchQuery,
          },
        }
      );
      setMovies(response.data.results);
    };
    fetchMovies();
  }, [searchQuery, sortBy, selectedGenre]);

  const handleSearchChange = (event) => { // Here search button or search bar become responsive
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = async () => { // Here we Fetch TMDB Api data
    const response = await axios.get(
      "https://api.themoviedb.org/3/search/movie",
      {
        params: {
          api_key: 'ad62f36baea0f1efd8cd9981c7bdbca0',
          query: searchQuery,
          sort_by: sortBy
        },
      }
    );
    setMovies(response.data.results);
  };

  const handleSortChange = (event) => { // here Sorting in SortBy
    setSortBy(event.target.value);
    handleSearchSubmit(); // Re-fetch movies when sort order changes
  };

  const handleGenreChange = (event) => { // handle GenreChange
    setSelectedGenre(event.target.value);
  }

  const toggleDescription = (movieId) => {
    setExpandedMovieId(expandedMovieId === movieId ? null : movieId);
  }
  return (
    /* Inside this div we make heading, search bar, Search button inside this search button we implement react search bar icon */
    <div>
      <h1>ScreenTime</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Movies..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button onClick={handleSearchSubmit} className="search-button">
          <AiOutlineSearch />
        </button>
      </div>

      <div className='filters'>
        {/* Here create sort BY button */}
        <label htmlFor="sort-by">Sort By:</label>
        <select id="sort-by" value={sortBy} onChange={handleSortChange}>
          <option value="popularity.desc">Popularity Descending</option>
          <option value="popularity.asc">Popularity Ascending</option>
          <option value="vote_average.desc">Rating Descending</option>
          <option value="vote_average.asc">Rating Ascending</option>
          <option value="release_date.desc">Release Date Descending</option>
          <option value="release_date.asc">Release Date Ascending</option>
        </select>
        {/* Here create Genre button */}
        <label htmlFor="genre">Genre:</label>
        <select id="genre" value={selectedGenre} onChange={handleGenreChange}>
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>
      </div>
      {/* Inside this div we add image, description, rating & read more or show less button */}
      <div className="movie-wrapper">
        {movies.map((movie) => (
          <div key={movie.id} className="movie">
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            <h2>{movie.title}</h2>
            <p className="rating">Rating: {movie.vote_average}</p>
            {expandedMovieId === movie.id ? (
              <p>{movie.overview}</p>
            ) : (
              <p>{movie.overview.substring(0, 150)}...</p>
            )}

            <button onClick={() =>
              toggleDescription(movie.id)}
              className="read-more">
              {expandedMovieId === movie.id ? "Show Less" : "Read More"}
            </button>

          </div>
        ))}
      </div>
    </div>
  )

}
