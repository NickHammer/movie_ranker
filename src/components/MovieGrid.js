// src/components/MovieGrid.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MovieGrid.css';

const MovieGrid = () => {
    const [movies, setMovies] = useState([]);
    // gridPage is the “full grid” page, where each page shows 60 movies (10 rows x 6 columns)
    const [gridPage, setGridPage] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Calculate which TMDB pages to fetch.
        // For gridPage = 1, we fetch TMDB pages 1, 2, 3 (assuming each returns 20 movies)
        const startPage = (gridPage - 1) * 3 + 1;
        const endpoints = [startPage, startPage + 1, startPage + 2].map(page =>
          axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_TMDB_API_KEY}&page=${page}`)
        );
        const responses = await Promise.all(endpoints);
        // Combine results from all three pages into one array
        const combinedMovies = responses.reduce((acc, res) => {
          return acc.concat(res.data.results);
        }, []);
        setMovies(combinedMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, [gridPage]);

  return (
    <div>
      <div className="movie-grid">
        {movies.map(movie => (
          <div key={movie.id} className="movie-item">
            {movie.poster_path ? (
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title} 
              />
            ) : (
              <div className="no-image">No image available</div>
            )}
          </div>
        ))}
      </div>
      <div className="pagination">
        <button 
          onClick={() => setGridPage(prev => Math.max(prev - 1, 1))} 
          disabled={gridPage === 1}
        >
          Previous
        </button>
        <span>Page {gridPage}</span>
        <button onClick={() => setGridPage(prev => prev + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default MovieGrid;
