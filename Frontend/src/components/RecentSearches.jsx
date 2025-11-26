import React from 'react';

export default function RecentSearches({ items = [], onPick }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="recent">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h4>Recent</h4>
        <button className="link" onClick={() => { localStorage.removeItem('recentWeatherCities'); window.location.reload(); }}>Clear</button>
      </div>
      <div className="chips">
        {items.map((c, i) => (
          <button key={i} className="chip" onClick={() => onPick(c)}>{c}</button>
        ))}
      </div>
    </div>
  );
}