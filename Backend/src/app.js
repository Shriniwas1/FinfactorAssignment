const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const weatherRoutes = require('./routes/weather');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API routes
app.use('/api', weatherRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Error handler (last middleware)
app.use(errorHandler);

module.exports = app;
