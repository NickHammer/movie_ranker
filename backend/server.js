// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Set up your PostgreSQL connection
const pool = new Pool({
  user: process.env.PG_USER,         // Replace with your PostgreSQL username
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,        // Your newly created database
  password: process.env.PG_PASSWORD, // Replace with your PostgreSQL password
  port: process.env.PG_PORT                         // Default PostgreSQL port
});

// API endpoint to fetch all movie assignments
app.get('/assignments', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM assignments ORDER BY id ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to add a new movie assignment
app.post('/assignments', async (req, res) => {
  const { movie_id, movie_title, column_id } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO assignments (movie_id, movie_title, column_id) VALUES ($1, $2, $3) RETURNING *',
      [movie_id, movie_title, column_id]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error('Error adding assignment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/assignments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM assignments WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
