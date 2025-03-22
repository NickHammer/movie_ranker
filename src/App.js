// src/App.js
import React, { useState } from 'react';
import MovieSearch from './components/MovieSearch';
import ColumnSelector from './components/ColumnSelector';
import './App.css';

function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [columns, setColumns] = useState({
    1: [],
    2: [],
    3: [],
    4: []
  });

  const handleAddMovie = () => {
    if (selectedMovie && selectedColumn) {
      setColumns(prevColumns => {
        const updatedColumn = [...prevColumns[selectedColumn], selectedMovie];
        return { ...prevColumns, [selectedColumn]: updatedColumn };
      });
      // Optionally clear the movie selection after adding
      setSelectedMovie(null);
    }
  };

  return (
    <div className="App" style={{ padding: '2rem' }}>
      <h1>Movie Column Selector</h1>
      <div>
        <MovieSearch onMovieSelect={setSelectedMovie} />
        <ColumnSelector 
          selectedColumn={selectedColumn} 
          onSelectColumn={setSelectedColumn} 
        />
        <button onClick={handleAddMovie}>Add</button>
      </div>
      <div style={{ display: 'flex', marginTop: '2rem' }}>
        {[1,2,3,4].map((columnId) => (
          <div key={columnId} style={{ flex: 1, padding: '1rem', border: '1px solid #ccc', margin: '0 0.5rem'}}>
            <h2>Column {columnId}</h2>
            {columns[columnId].map(movie => (
              <div key={movie.value}>
                {movie.label}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
