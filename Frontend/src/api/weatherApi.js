import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'; 

/**
 * Fetches current weather data for a given city from backend.
 * @param {string} city - The name of the city.
 * @returns {Promise<object>} The weather response object.
 */
export const fetchWeather = async (city) => {
    try {
        const response = await axios.get(`${baseUrl}/api/weather?city=${city}`);
        
        return response.data;
    } catch (error) {
        console.error("Error fetching weather:", error);
        return { ok: false, error: error.message || "Network error" };
    }
};

/**
 * Searches for city autocomplete suggestions.
 * @param {string} query - The search query.
 * @returns {Promise<Array>} List of city suggestions.
 */
export const searchCities = async (query) => {
    if (!query) return [];
    try {
        const response = await axios.get(`${baseUrl}/api/search?q=${query}`);
        
        return response.data;
    } catch (error) {
        console.error("Error searching cities:", error);
        return [];
    }
};