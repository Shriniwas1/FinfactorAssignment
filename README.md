# Weatheriea a Weather App
A simple full-stack weather application with a Node.js/Express backend and a React frontend, using the OpenWeather API with caching.

## Table of Contents

1. Overview  
2. Environment Setup  
3. Install Dependencies  
4. Running the Application  
5. Technical Documentation  

## Live Demo Link
https://finfactor-assignment-seven.vercel.app/
## 1. Overview

This project has two main parts:  
- Backend service using Node.js and Express to communicate with the OpenWeather API and implement caching.  
- Frontend using React to display weather data and manage user interactions.

## 2. Environment Setup
1. Clone the Repository

- Begin by cloning the project repository to your local machine:

```bash
git clone https://github.com/Shriniwas1/FinfactorAssignment.git
cd FinfactorAssignment
```
2. Create an environment variable file 


3. Open `.env` and replace the placeholder with your actual API key:
```bash
PORT=5000
OPENWEATHER_API_KEY=YOUR_ACTUAL_API_KEY_HERE
CACHE_TTL_SECONDS=300
CACHE_MAX_ENTRIES=100
```

## 3. Install Dependencies

### Backend

1. Navigate to the backend directory:

2. Install backend packages:



3. Key backend dependencies include:  
- `express`: API server  
- `axios`: HTTP requests  
- `dotenv`: Environment variables  
- `cors`: Cross-origin resource sharing  
- `morgan`: Request logging  
- `nodemon` (dev dependency): Hot reload during development  

### Frontend

1. Navigate to the frontend directory:

2. Install frontend packages:



3. Key frontend dependencies include:  
- `react`: UI framework  
- `axios`: Client-side HTTP requests  
 

## 4. Running the Application

You need two separate terminals for running backend and frontend concurrently.

1. Terminal 1 - Start Backend:
```bash 
npm run dev
```


Backend runs at: http://localhost:5000

2. Terminal 2 - Start Frontend:
```bash 
npm run dev
```


Frontend opens automatically at: http://localhost:5173

## 5. Technical Documentation

- **Web Service API**  
  - **Technology:** Node.js (Express)  
  - **File:** `src/services/openWeatherService.js`  
  - **Responsibility:** Handles communication with the external OpenWeather API.

- **Caching (LRU/TTL)**  
  - **Technology:** JavaScript  
  - **File:** `src/utils/lruCache.js`  
  - **Responsibility:** Implements LRU cache logic with TTL and max entry limits.

- **Routing / Controller**  
  - **Technology:** Express  
  - **File:** `src/controllers/weatherController.js`  
  - **Responsibility:** Manages caching, API calls, and HTTP responses.

- **Frontend UI**  
  - **Technology:** React, CSS Modules  
  - **File:** `src/components/WeatherCard.jsx`  
  - **Responsibility:** Renders weather data and manages time conversions.

- **State Management**  
  - **Technology:** React  
  - **File:** `src/components/SearchBar.jsx`  
  - **Responsibility:** Handles input state, debounced search, and keyboard navigation.
