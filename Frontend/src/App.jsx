import React, { useState, useEffect, useCallback, useRef } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import RecentSearches from './components/RecentSearches';
import { fetchWeather } from './api/weatherApi';
import { runSnowAnimation } from './snowAnimation'; 
import './main.css';
import './index.css';

const APP_BACKGROUNDS = {
    'Clear': 'https://images.unsplash.com/photo-1558485295-8b29ff0182f7?q=80&w=1974&auto=format&fit=crop',
    'Rain': 'https://images.unsplash.com/photo-1534082729780-b2ec10b001a4?q=80&w=1964&auto=format&fit=crop',
    'Drizzle': 'https://images.unsplash.com/photo-1534082729780-b2ec10b001a4?q=80&w=1964&auto=format&fit=crop',
    'Thunderstorm': 'https://images.unsplash.com/photo-1566417702336-d486bb731998?q=80&w=2070&auto=format&fit=crop',
    'Snow': 'https://images.unsplash.com/photo-1542601098-8fc114cd6985?q=80&w=1974&auto=format&fit=crop',
    'Clouds': 'https://images.unsplash.com/photo-1506729009945-a131b26d8ee1?q=80&w=2070&auto=format&fit=crop',
    'Mist': 'https://images.unsplash.com/photo-1487627407009-ff165275e3c7?q=80&w=1974&auto=format&fit=crop',
    'Fog': 'https://images.unsplash.com/photo-1487627407009-ff165275e3c7?q=80&w=1974&auto=format&fit=crop',
    'Haze': 'https://images.unsplash.com/photo-1487627407009-ff165275e3c7?q=80&w=1974&auto=format&fit=crop',
    'Default': 'https://images.unsplash.com/photo-1487627407009-ff165275e3c7?q=80&w=1974&auto=format&fit=crop'
};

const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const generateRainDrops = () => {
    const drops = [];
    for (let i = 0; i < 60; i++) {
        
        const duration = 0.5 + Math.random() * 1.0; 
        
        
        const dropHeight = 10 + Math.random() * 20;

        drops.push(<div key={i} className="rain-drop" style={{
            left: `${Math.random() * 100}vw`,
            
            animationDelay: `${Math.random() * -duration}s`, 
            animationDuration: `${duration}s`, 
            width: `${1 + Math.random()}px`,
            height: `${dropHeight}px`,
        }} />);
    }
    return drops;
};


const generateClouds = () => {
    const clouds = [];
    for (let i = 1; i <= 4; i++) {
        const top = `${(i * 20)}%`;
        const zIndex = (i % 2 !== 0) ? -1 : 0;
        
        const scale = (random(5, 10)) * 0.1; 
        const delay = `${random(4, 10)}s`; 

        clouds.push(
            <div 
                key={i} 
                className="cloud" 
                style={{
                    top: top,
                    zIndex: zIndex,
                    transform: `scale(${scale})`,
                    animationDelay: delay,
                }} 
            >
                {/* Cloud pseudo-elements are handled by CSS :before/:after */}
            </div>
        );
    }
    return clouds;
};

export default function App() {
    const [weatherResp, setWeatherResp] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [offline, setOffline] = useState(!navigator.onLine);
    const [recent, setRecent] = useState([]);
    const [backgroundImageUrl, setBackgroundImageUrl] = useState(`url(${APP_BACKGROUNDS['Default']})`);

    const weatherMainCondition = weatherResp?.data?.weather?.[0]?.main;
    const snowCanvasRef = useRef(null);

    
    const rainDrops = React.useMemo(() => generateRainDrops(), [weatherMainCondition]); 
    const movingClouds = React.useMemo(() => generateClouds(), []);

    
    useEffect(() => {
        const url = APP_BACKGROUNDS[weatherMainCondition] || APP_BACKGROUNDS['Default'];
        setBackgroundImageUrl(`url(${url})`);
    }, [weatherMainCondition]);

    
    useEffect(() => {
        let stopSnow = () => {};
        if (weatherMainCondition === 'Snow' && snowCanvasRef.current) {
            stopSnow = runSnowAnimation(snowCanvasRef.current);
        }
        return () => stopSnow(); 
    }, [weatherMainCondition]);

    
    useEffect(() => {
        try { setRecent(JSON.parse(localStorage.getItem('recentWeatherCities') || '[]')); }
        catch { setRecent([]); }
    }, []);

    
    useEffect(() => {
        const onOnline = () => setOffline(false);
        const onOffline = () => setOffline(true);
        window.addEventListener('online', onOnline);
        window.addEventListener('offline', onOffline);
        return () => {
            window.removeEventListener('online', onOnline);
            window.removeEventListener('offline', onOffline);
        };
    }, []);

    const saveRecent = (city) => {
        try {
            const current = JSON.parse(localStorage.getItem('recentWeatherCities') || '[]');
            const normalized = city.trim();
            const updated = [normalized, ...current.filter(c => c.toLowerCase() !== normalized.toLowerCase())].slice(0, 6);
            localStorage.setItem('recentWeatherCities', JSON.stringify(updated));
            setRecent(updated);
        } catch {}
    };

    const handleSearch = async (city) => {
        setError('');
        setWeatherResp(null);
        if (!city) { setError('Please enter a city'); return; }
        setLoading(true);

        const cityKey = city.toLowerCase();
        const lastKnownKey = `last-weather:${cityKey}`;
        
        try {
            
            const resp = await fetchWeather(city); 
            if (!resp?.ok) { setError(resp?.error || `Failed to fetch weather for ${city}`); }
            else {
                setWeatherResp(resp);
                try { localStorage.setItem(lastKnownKey, JSON.stringify(resp)); } catch {}
                saveRecent(city);
            }
        } catch (err) {
            const cached = localStorage.getItem(lastKnownKey);
            if (cached) {
                const cachedResp = JSON.parse(cached);
                cachedResp.source = 'offline_cache'; 
                setWeatherResp(cachedResp);
                setError(`Failed to connect. Showing last known data (offline).`);
            } else setError(err.message || 'Failed to fetch weather. Check connection or try another city.');
        } finally { setLoading(false); }
    };

    const appFrameClass = weatherMainCondition === 'Thunderstorm' ? 'app-full-frame thunder-flash' : 'app-full-frame';

    return ( 
        <div className={appFrameClass} style={{ backgroundImage: backgroundImageUrl }}>
            <div className="background-overlay"></div>

            {/* Dynamic Background Animations */}
            {weatherMainCondition === 'Clear' && (
                <div className="sun-animation-container">
                    {/* Sun fixed at top-left with rotation applied to the parent for the shine elements */}
                    <div className="sun-orbit-container">
                        <div className="moving-sun">
                            <div className="shine"></div>
                            <div className="shine"></div>
                            <div className="shine"></div>
                            <div className="shine"></div>
                            <div className="shine"></div>
                            <div className="shine"></div>
                            <div className="shine"></div>
                            <div className="shine"></div>
                            <div className="shine"></div>
                            <div className="shine"></div>
                        </div>
                    </div>
                </div>
            )}
            
            {weatherMainCondition === 'Clouds' && (
                <div className="cloud-animation-container">
                    {movingClouds}
                </div>
            )}

            {['Rain', 'Drizzle', 'Thunderstorm'].includes(weatherMainCondition) && (
                <div className="rain-animation-container">{rainDrops}</div>
            )}
            
            {weatherMainCondition === 'Snow' && (
                <canvas id="snow-canvas" ref={snowCanvasRef} className="snow-animation-container"></canvas>
            )}

            {['Mist', 'Haze', 'Fog'].includes(weatherMainCondition) && (
                <div className="fogwrapper">
                    <div id="foglayer_01" className="fog">
                        <div className="image01"></div>
                    </div>
                    <div id="foglayer_02" className="fog">
                        <div className="image01"></div>
                    </div>
                    <div id="foglayer_03" className="fog">
                        <div className="image01"></div>
                    </div>
                </div>
            )}

            {/* Application Content (Z-index: 2 ensures this is above animations) */}
            <div className="app-container">
                <header>
                    <h1>Weather Search</h1>
                    <p className="sub">Search current weather by city</p>
                </header>

                {offline && <div className="offline-banner">You are offline — app will use cached data where available</div>}

                <main style={{ width: '100%' }}> 
                    <SearchBar onSearch={handleSearch} loading={loading} />
                    {error && <div className="error">{error}</div>}

                    <div className="content-layout"> 
                        <div className="main-data-area">
                            {weatherResp?.data && <WeatherCard weather={weatherResp.data} source={weatherResp.source} fetchedAt={weatherResp.fetchedAt} />}
                        </div>
                        <div className="recent-sidebar">
                            <RecentSearches items={recent} onPick={handleSearch} />
                        </div>
                    </div>
                </main>

                <footer>
                    <small>Built with React • Backend: Node + Express • Data: OpenWeather</small>
                </footer>
            </div>
        </div>
    );
}