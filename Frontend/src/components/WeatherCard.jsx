import React from 'react';

function iconUrl(icon) {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

function formatTime(unix) {
  if (!unix) return '—';

  const dt = new Date(unix * 1000);

  return dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export default function WeatherCard({ weather, source, fetchedAt }) {
  if (!weather) return null;
  const primary = weather.weather && weather.weather[0];


  return (
    <div className="weather-card-container">
      <div className="card-content">

        <div className="main-weather-section">
          <div className="location-info">
            {primary && <img src={iconUrl(primary.icon)} alt={primary.description} className="weather-icon-large" />}
            <h2 className="city-name-large">{weather.name}{weather.country ? `, ${weather.country}` : ''}</h2>
            <div className="weather-description">{primary.main} — {primary.description}</div>
          </div>
          <div className="temperature-info">
            <span className="current-temp">{Math.round(weather.main.temp)}°C</span>
            <span className="feels-like">Feels like {Math.round(weather.main.feels_like)}°C</span>
          </div>
        </div>

        {/* Right Section: Detailed Weather Info */}
        <div className="detail-weather-section">
          <div className="detail-item">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{weather.main.humidity}%</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Pressure</span>
            <span className="detail-value">{weather.main.pressure} hPa</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Wind Speed</span>
            <span className="detail-value">{weather.wind?.speed} m/s</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Clouds</span>
            <span className="detail-value">{weather.clouds?.all}%</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Visibility</span>
            <span className="detail-value">{weather.visibility} m</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Timezone Offset</span>
            <span className="detail-value">{weather.timezone / 3600} hours</span>
          </div>
          {weather.raw?.sys?.sunrise && (
            <div className="detail-item">
              <span className="detail-label">Sunrise</span>
              <span className="detail-value">{formatTime(weather.raw.sys.sunrise)}</span>
            </div>
          )}
          {weather.raw?.sys?.sunset && (
            <div className="detail-item">
              <span className="detail-label">Sunset</span>
              <span className="detail-value">{formatTime(weather.raw.sys.sunset)}</span>
            </div>
          )}
          <div className="source-info">
            <span className="detail-label">Fetched At</span>
            <span className="detail-value">{fetchedAt ? new Date(fetchedAt).toLocaleTimeString() : '—'}</span>
            <span className="detail-label">Source</span>
            <span className="detail-value">{source}</span>
          </div>
        </div>
      </div>
    </div>
  );
}