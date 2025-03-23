// src/components/ColumnsView.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  // Group assignments by column_id (assuming 1 to 4)
  const columns = {
    1: [],
    2: [],
    3: [],
    4: []
  };

  assignments.forEach(item => {
    // Check if the column exists; if so, push the assignment into that column
    if (columns[item.column_id]) {
      columns[item.column_id].push(item);
    }
  });

  // Define a mapping for percentage ranges, if needed
  const percentageLabels = {
    1: '0%-25%',
    2: '25%-50%',
    3: '50%-75%',
    4: '75%-100%'
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Movie Assignments by Column</h1>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {Object.keys(columns).map(columnId => (
          <div
            key={columnId}
            style={{
              flex: 1,
              border: '1px solid #ccc',
              padding: '1rem',
              borderRadius: '4px'
            }}
          >
            <h2>{percentageLabels[columnId]}</h2>
            {columns[columnId].length > 0 ? (
              columns[columnId].map(assignment => (
                <div key={assignment.id} style={{ marginBottom: '0.5rem' }}>
                  {assignment.movie_title}
                </div>
              ))
            ) : (
              <p>No movies assigned.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColumnsView;
