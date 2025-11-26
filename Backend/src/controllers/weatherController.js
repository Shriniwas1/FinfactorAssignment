const openWeatherService = require('../services/openWeatherService');
const Cache = require('../utils/lruCache');

// Initialize LRU cache
const TTL = (Number(process.env.CACHE_TTL_SECONDS) || 300) * 1000;
const MAX = Number(process.env.CACHE_MAX_ENTRIES) || 100;
const cache = new Cache(MAX, TTL);

// Get current weather
exports.getWeather = async (req, res, next) => {
  try {
    const city = (req.query.city || '').trim();
    if (!city) return res.status(400).json({ ok: false, error: 'Missing city query param' });

    const key = `weather:${city.toLowerCase()}`;

    // Try cache first
    const cached = cache.get(key);
    if (cached) {
      return res.json({
        ok: true,
        source: 'cache',
        fetchedAt: new Date().toISOString(),
        data: cached
      });
    }

    // Fetch from API if cache miss
    const cleaned = await openWeatherService.fetchCurrentWeather(city);
    cache.set(key, cleaned);

    res.json({
      ok: true,
      source: 'api',
      fetchedAt: new Date().toISOString(),
      data: cleaned
    });
  } catch (err) {
    next(err);
  }
};

// Search city suggestions
exports.searchCities = async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json([]);

    const suggestions = await openWeatherService.searchCityByName(q, 6);
    res.json(suggestions);
  } catch (err) {
    next(err);
  }
};
