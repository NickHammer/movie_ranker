// src/components/MovieSearch.js
import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';

const MovieSearch = ({ onMovieSelect }) => {
  const [options, setOptions] = useState([]);

  // Async function to fetch movies
  const fetchMovies = async (inputValue) => {
    if (inputValue.length < 3) return;
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${inputValue}`
      );
      const movies = response.data.results.map(movie => ({
        value: movie.id,
        label: movie.title,
      }));
      setOptions(movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  // Synchronous handler for onInputChange
  const handleInputChange = (inputValue) => {
    fetchMovies(inputValue); // fire off async fetch but don't await it here
    return inputValue;       // immediately return the input value so react-select works as expected
  };

  return (
    <Select 
      options={options}
      onInputChange={handleInputChange}
      onChange={(selected) => onMovieSelect(selected)}
      placeholder="Search for a movie..."
      isClearable
    />
  );
};

export default MovieSearch;
