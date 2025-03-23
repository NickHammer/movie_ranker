// src/components/ColumnsView.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ColumnsView = () => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/assignments');
        setAssignments(res.data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };

    fetchAssignments();
  }, []);

  // Handle deleting an assignment
  const handleDelete = async (assignmentId) => {
    try {
      await axios.delete(`http://localhost:5000/assignments/${assignmentId}`);
      setAssignments(prev => prev.filter(a => a.id !== assignmentId));
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };

  // Group assignments by column_id (assuming 1 to 4)
  const columns = {
    1: [],
    2: [],
    3: [],
    4: []
  };

  assignments.forEach(item => {
    if (columns[item.column_id]) {
      columns[item.column_id].push(item);
    }
  });

  const percentageLabels = {
    1: '0%-25%',
    2: '25%-50%',
    3: '50%-75%',
    4: '75%-100%'
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Movie Assignments by Column
      </Typography>
      <Grid container spacing={2}>
        {Object.keys(columns).map(columnId => (
          <Grid item xs={12} md={6} lg={3} key={columnId}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {percentageLabels[columnId]}
                </Typography>
                {columns[columnId].length > 0 ? (
                  columns[columnId].map(assignment => (
                    <Box
                      key={assignment.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #ccc',
                        mb: 1,
                        pb: 1
                      }}
                    >
                      <Typography>
                        {assignment.movie_title}
                      </Typography>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(assignment.id)}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  ))
                ) : (
                  <Typography color="text.secondary">
                    No movies assigned.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ColumnsView;
