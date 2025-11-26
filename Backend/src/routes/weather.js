const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// Weather data
router.get('/weather', weatherController.getWeather);

// City search suggestions
router.get('/search', weatherController.searchCities);

module.exports = router;
