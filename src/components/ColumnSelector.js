// src/components/ColumnSelector.js
import React from 'react';

const ColumnSelector = ({ selectedColumn, onSelectColumn }) => {
    const columns = [
        { id: 1, label: '0%-25%' },
        { id: 2, label: '25%-50%' },
        { id: 3, label: '50%-75%' },
        { id: 4, label: '75%-100%' },
    ];

    return (
        <div style={{ margin: '1rem 0' }}>
            {columns.map(column => (
        <label key={column.id} style={{ marginRight: '1rem' }}>
            <input 
                type="radio"
                name="column"
                value={column.id}
                checked={selectedColumn === column.id}
                onChange={() => onSelectColumn(column.id)}
            />
            {column.label}
        </label>
            ))}
    </div>
    );
};

export default ColumnSelector;
