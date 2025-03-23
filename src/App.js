// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import ColumnsView from './components/ColumnsView';

function App() {
  return (
    <Router>
      <div style={{ padding: '2rem' }}>
        <nav>
          <Link to="/">Home</Link> | <Link to="/columns">View Columns</Link>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/columns" element={<ColumnsView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
