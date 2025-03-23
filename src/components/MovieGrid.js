// src/components/MovieGrid.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MovieGrid.css';

const MovieGrid = ({ onMovieSelect }) => {
  const [movies, setMovies] = useState([]);
  const [gridPage, setGridPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [gridMapping, setGridMapping] = useState({});

  // Helper: generate a random page number between 1 and max (inclusive)
  const getRandomPage = (max) => Math.floor(Math.random() * max) + 1;

  // On mount: fetch page 1 to get the total number of pages
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_TMDB_API_KEY}&page=1`
        );
        // TMDB may have many pages; cap at 500 for performance reasons.
        setTotalPages(Math.min(res.data.total_pages, 500));
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  // When gridPage changes, if we haven't generated a random page for it, do so.
  useEffect(() => {
    if (!gridMapping[gridPage] && totalPages) {
      const randomPage = getRandomPage(totalPages);
      setGridMapping(prev => ({ ...prev, [gridPage]: randomPage }));
    }
  }, [gridPage, totalPages, gridMapping]);

  // When gridPage or gridMapping changes, fetch movies for that grid page.
  useEffect(() => {
    const fetchMovies = async () => {
      if (!totalPages) return; // Wait until totalPages is set.
      // Wait until a random page is assigned for the current gridPage.
      const randomPage = gridMapping[gridPage];
      if (!randomPage) return;
      
      setLoading(true);
      try {
        // Optionally, fetch two consecutive TMDB pages to combine results.
        const [res1, res2] = await Promise.all([
          axios.get(
            `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_TMDB_API_KEY}&page=${randomPage}`
          ),
          axios.get(
            `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_TMDB_API_KEY}&page=${randomPage + 1}`
          )
        ]);
        const combined = [...res1.data.results, ...res2.data.results];
        // Take the first 36 movies for a 6x6 grid.
        const gridMovies = combined.slice(0, 36);
        setMovies(gridMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
      setLoading(false);
    };

    fetchMovies();
  }, [gridPage, gridMapping, totalPages]);

  return (
    <div>
      {loading ? (
        <p>Loading movies...</p>
      ) : (
        <div className="movie-grid">
          {movies.map(movie => (
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
        <button onClick={() => setGridPage(prev => Math.max(prev - 1, 1))}>
          Previous
        </button>
        <span style={{ margin: '0 1rem' }}>Page {gridPage}</span>
        <button onClick={() => setGridPage(prev => prev + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default MovieGrid;
