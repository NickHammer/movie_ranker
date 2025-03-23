// src/components/MovieSearch.js
import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';

const MovieSearch = ({ onSearchQueryChange, onMovieSelect }) => {
  const [options, setOptions] = useState([]);

  const fetchMovies = async (inputValue) => {
    if (!inputValue || inputValue.length < 3) {
      setOptions([]); // Clear options if input is too short
      return;
    }
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${inputValue}`
      );
      const movies = response.data.results.map(movie => ({
        value: movie.id,
        label: movie.title,
        poster_path: movie.poster_path, // include poster_path for display later
      }));
      console.log("Fetched movies:", movies); // Debug: log fetched movies
      setOptions(movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleInputChange = (inputValue, actionMeta) => {
    console.log("Input changed:", inputValue, actionMeta); // Debug log
    if (typeof onSearchQueryChange === 'function') {
      onSearchQueryChange(inputValue);
    }
    fetchMovies(inputValue);
    return inputValue;
  };

  return (
    <Select 
      options={options}
      onInputChange={handleInputChange}
      onChange={(selected) => {
        console.log("Movie selected:", selected); // Debug log
        onMovieSelect(selected);
      }}
      placeholder="Search for a movie..."
      isClearable
      noOptionsMessage={() => "No movies found."}
    />
  );
};

export default MovieSearch;
