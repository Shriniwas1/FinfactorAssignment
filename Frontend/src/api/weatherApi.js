import axios from "axios";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const fetchWeather = async (city) => {
    const response = await axios.get(`${baseUrl}/api/weather?city=${city}`);
    return response.data;
};

export const searchCities = async (query) => {
    if (!query) return [];
    const response = await axios.get(`${baseUrl}/api/search?q=${query}`);
    return response.data;
};
