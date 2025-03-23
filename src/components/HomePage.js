import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieSearch from './MovieSearch';
import MovieGrid from './MovieGrid';
import ColumnSelector from './ColumnSelector';
import axios from 'axios';

const HomePage = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  // This key is used to force remount the MovieGrid when changed.
  const [gridKey, setGridKey] = useState(0);
  const navigate = useNavigate();

  const handleAddAssignment = async () => {
    if (!selectedMovie || !selectedColumn) {
      alert('Please select both a movie and a column!');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/assignments', {
        movie_id: selectedMovie.value,
        movie_title: selectedMovie.label,
        column_id: selectedColumn,
      });
      console.log("Assignment added:", response.data);
      // Reset selections after adding (if desired)
      setSelectedMovie(null);
      setSelectedColumn(null);
      // Optionally force grid to reset when assignment is added:
      setGridKey(prev => prev + 1);
    } catch (error) {
      console.error("Error adding assignment:", error);
    }
  };

  // A Home button that resets the grid (and clears any selected movie)
  const handleHomeClick = () => {
    setSelectedMovie(null);
    setGridKey(prev => prev + 1);
    navigate('/'); // Navigate to Home if needed
  };

  return (
    <div>
      <h1>Movie Ranker</h1>
      <MovieSearch
        onMovieSelect={(movie) => {
          console.log("Movie selected:", movie);
          setSelectedMovie(movie);
        }}
      />

      {selectedMovie ? (
        // Display selected movie view if a movie is selected
        <div>
          <h2>Selected Movie:</h2>
          <div className="movie-item">
            {selectedMovie.poster_path ? (
              <img 
                src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`} 
                alt={selectedMovie.label} 
                style={{ maxWidth: '200px', borderRadius: '8px' }}
              />
            ) : (
              <div>No image available</div>
            )}
            <p>{selectedMovie.label}</p>
          </div>
          <ColumnSelector 
            selectedColumn={selectedColumn} 
            onSelectColumn={setSelectedColumn} 
          />
          <button onClick={handleAddAssignment}>
            Add Movie to Column
          </button>
          <button onClick={handleHomeClick}>
            Home
          </button>
        </div>
      ) : (
        // When no movie is selected, show the popular movie grid.
        // Pass gridKey as the key prop to force remounting.
        <MovieGrid key={gridKey} onMovieSelect={(movie) => {
          console.log("Movie selected from grid:", movie);
          setSelectedMovie(movie);
        }} />
      )}

      <button onClick={() => navigate('/columns')}>
        Go to Columns View
      </button>
    </div>
  );
};

export default HomePage;
