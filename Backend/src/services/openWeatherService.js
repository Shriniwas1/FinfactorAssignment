const axios = require('axios');

const API_KEY = process.env.OPENWEATHER_API_KEY; 
if (!API_KEY) {
  console.error('CRITICAL: OPENWEATHER_API_KEY missing in env. API calls will fail.');
}

const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const GEO_DIRECT_URL = 'https://api.openweathermap.org/geo/1.0/direct';

// Wrapper for OpenWeather API requests with error handling
async function makeOpenWeatherCall(url, params, timeout = 8000) {
  if (!API_KEY) {
    const err = new Error('API Key missing. Cannot proceed with external call.');
    err.status = 500;
    throw err;
  }
  
  const finalParams = { ...params, appid: API_KEY };

  try {
    const resp = await axios.get(url, { params: finalParams, timeout });
    return resp.data;
  } catch (err) {
    if (err.response) {
      const status = err.response.status;
      let message = err.response.data?.message || `API call failed with status ${status}`;

      if (status === 401) {
        message = 'Unauthorized. Invalid or inactive API key.';
      } else if (status === 404 && params.q) {
        message = `City "${params.q}" not found.`;
      }
      
      const customError = new Error(message);
      customError.status = status;
      throw customError;
    } 
    
    if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
      const timeoutError = new Error('Upstream API timeout.');
      timeoutError.status = 504;
      throw timeoutError;
    }
    
    const networkError = new Error(`Network error connecting to external API: ${err.message}`);
    networkError.status = 503;
    throw networkError;
  }
}

// Fetch and clean current weather data
async function fetchCurrentWeather(city) {
  const params = { q: city, units: 'metric' };
  const p = await makeOpenWeatherCall(WEATHER_URL, params, 8000);

  return {
    name: p.name,
    country: p.sys?.country,
    coords: p.coord,
    weather: p.weather?.map(w => ({ main: w.main, description: w.description, icon: w.icon })) || [],
    main: p.main,
    wind: p.wind,
    clouds: p.clouds,
    visibility: p.visibility,
    timezone: p.timezone,
    raw: p
  };
}

// Search cities by name
async function searchCityByName(q, limit = 5) {
  const params = { q, limit };
  const data = await makeOpenWeatherCall(GEO_DIRECT_URL, params, 6000);

  return data.map(item => ({
    name: item.name,
    state: item.state || '',
    country: item.country,
    lat: item.lat,
    lon: item.lon
  }));
}

module.exports = { fetchCurrentWeather, searchCityByName };
