// src/components/MovieGrid.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MovieGrid.css';

const MovieGrid = ({ onMovieSelect }) => {
  const [movies, setMovies] = useState([]);
  const [gridPage, setGridPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(null);
  const [gridMapping, setGridMapping] = useState({});

  // Helper to pick a random page
  const getRandomPage = (max) => Math.floor(Math.random() * max) + 1;

  // 1) On mount, fetch page=1 to find total_pages
  useEffect(() => {
    const fetchTotalPages = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_TMDB_API_KEY}&page=1`
        );
        // Cap at 500 to avoid slow or invalid pages
        setTotalPages(Math.min(res.data.total_pages, 500));
      } catch (error) {
        console.error("Error fetching total pages:", error);
      }
    };

    fetchTotalPages();
  }, []);

  // 2) Whenever gridPage changes, generate a random page if none is assigned yet
  useEffect(() => {
    if (totalPages && !gridMapping[gridPage]) {
      const randomPage = getRandomPage(totalPages);
      setGridMapping((prev) => ({ ...prev, [gridPage]: randomPage }));
    }
  }, [gridPage, totalPages, gridMapping]);

  // 3) Fetch movies from the assigned random page for this gridPage
  useEffect(() => {
    const fetchMovies = async () => {
      if (!totalPages) return; // Wait until totalPages is known
      const randomPage = gridMapping[gridPage];
      if (!randomPage) return; // Wait until we’ve assigned a random page

      setLoading(true);
      try {
        // Fetch two consecutive pages to get up to ~40 results
        const [res1, res2] = await Promise.all([
          axios.get(
            `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_TMDB_API_KEY}&page=${randomPage}`
          ),
          axios.get(
            `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_TMDB_API_KEY}&page=${randomPage + 1}`
          ),
        ]);
        const combined = [...res1.data.results, ...res2.data.results];
        // Take first 36 for a 6×6 grid
        setMovies(combined.slice(0, 36));
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
      setLoading(false);
    };

    fetchMovies();
  }, [gridPage, gridMapping, totalPages]);

  // 4) Render the grid
  return (
    <div>
      {loading ? (
        <p>Loading movies...</p>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="movie-item"
              onClick={() => onMovieSelect && onMovieSelect(movie)}
              style={{ cursor: 'pointer' }}
            >
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
      )}
      <div className="pagination">
        <button onClick={() => setGridPage((p) => Math.max(p - 1, 1))}>
          Previous
        </button>
        <span style={{ margin: '0 1rem' }}>Page {gridPage}</span>
        <button onClick={() => setGridPage((p) => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default MovieGrid;
