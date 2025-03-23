// src/components/ColumnSelector.js
import React from 'react';
import { Button, Box, Typography } from '@mui/material';

const ColumnSelector = ({ selectedColumn, onSelectColumn }) => {
  const columns = [
    { id: 1, label: "0%-25%" },
    { id: 2, label: "25%-50%" },
    { id: 3, label: "50%-75%" },
    { id: 4, label: "75%-100%" },
  ];

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Select a Column
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {columns.map(col => (
          <Button
            key={col.id}
            variant={selectedColumn === col.id ? "contained" : "outlined"}
            onClick={() => onSelectColumn(col.id)}
          >
            {col.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default ColumnSelector;
