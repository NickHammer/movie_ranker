import React from 'react';

const ColumnSelector = ({ selectedColumn, onSelectColumn }) => {
  const columns = [
    { id: 1, label: "0%-25%" },
    { id: 2, label: "25%-50%" },
    { id: 3, label: "50%-75%" },
    { id: 4, label: "75%-100%" },
  ];

  return (
    <div>
      <h3>Select a Column</h3>
      {columns.map((col) => (
        <button
          key={col.id}
          onClick={() => onSelectColumn(col.id)}
          style={{
            backgroundColor: selectedColumn === col.id ? 'lightblue' : 'white',
            margin: '0.5rem',
            padding: '0.5rem 1rem',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        >
          {col.label}
        </button>
      ))}
    </div>
  );
};

export default ColumnSelector;
