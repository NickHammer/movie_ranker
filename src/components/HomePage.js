// src/components/HomePage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieSearch from './MovieSearch';
import MovieGrid from './MovieGrid';
import ColumnSelector from './ColumnSelector';
import axios from 'axios';

// Material UI imports
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Stack
} from '@mui/material';

const HomePage = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const navigate = useNavigate();

  const handleAddAssignment = async () => {
    if (!selectedMovie || !selectedColumn) {
      alert('Please select both a movie and a column!');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/assignments', {
        movie_id: selectedMovie.value || selectedMovie.id,
        movie_title: selectedMovie.label || selectedMovie.title,
        column_id: selectedColumn,
      });
      console.log("Assignment added:", response.data);
      // Reset selections
      setSelectedMovie(null);
      setSelectedColumn(null);
    } catch (error) {
      console.error("Error adding assignment:", error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Movie Ranker
      </Typography>

      {/* The search bar at the top */}
      <MovieSearch
        onMovieSelect={(movie) => {
          console.log("Movie selected:", movie);
          setSelectedMovie(movie);
        }}
      />

      {selectedMovie ? (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Selected Movie
          </Typography>

          <Card
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              p: 2,
              mb: 2
            }}
          >
            {selectedMovie.poster_path ? (
              <CardMedia
                component="img"
                image={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                alt={selectedMovie.label || selectedMovie.title}
                sx={{
                  width: { xs: '100%', sm: 160 },
                  height: { xs: 'auto', sm: 240 },
                  borderRadius: 2
                }}
              />
            ) : (
              <Box
                sx={{
                  width: { xs: '100%', sm: 160 },
                  height: { xs: 'auto', sm: 240 },
                  borderRadius: 2,
                  backgroundColor: '#eee',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography>No image available</Typography>
              </Box>
            )}

            <CardContent
              sx={{
                flex: '1 1 0',
                ml: { xs: 0, sm: 2 },
                mt: { xs: 2, sm: 0 }
              }}
            >
              <Typography variant="subtitle1">
                {selectedMovie.label || selectedMovie.title}
              </Typography>
            </CardContent>
          </Card>

          {/* Column selector */}
          <Box>
            <ColumnSelector
              selectedColumn={selectedColumn}
              onSelectColumn={setSelectedColumn}
            />
          </Box>

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="contained" onClick={handleAddAssignment}>
              Add Movie to Column
            </Button>
            <Button variant="outlined" onClick={() => setSelectedMovie(null)}>
              Cancel
            </Button>
          </Stack>
        </Box>
      ) : (
        <Box sx={{ mt: 3 }}>
          <MovieGrid
            onMovieSelect={(movie) => {
              console.log("Movie selected from grid:", movie);
              setSelectedMovie(movie);
            }}
          />
        </Box>
      )}

      <Box sx={{ mt: 3 }}>
        <Button
          variant="text"
          onClick={() => navigate('/columns')}
        >
          Go to Columns View
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
