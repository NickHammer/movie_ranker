// src/App.js
import React from 'react';
import MovieSearch from './components/MovieSearch';
import MovieGrid from './components/MovieGrid';
import './App.css';

function App() {
  return (
    <div className="App" style={{ padding: '2rem' }}>
      <h1>Movie Ranker</h1>
      <MovieSearch onMovieSelect={() => { /* your logic here */ }} />
      <MovieGrid />
    </div>
  );
}

export default App;
