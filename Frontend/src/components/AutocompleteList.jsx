import React, { useState, useEffect, useRef } from 'react';
import { searchCities } from '../api/weatherApi';

export default function AutocompleteList({ query, onPick, activeIndex, setSuggestionsCount }) {
  const [suggestions, setSuggestions] = useState([]);
  const listRef = useRef(null);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setSuggestionsCount(0);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const geoSuggestions = await searchCities(query);
        const formattedSuggestions = geoSuggestions.map(item => ({
            name: item.name,
            fullName: `${item.name}${item.state ? `, ${item.state}` : ''}, ${item.country}`
        }));
        
        setSuggestions(formattedSuggestions || []);
        setSuggestionsCount(formattedSuggestions.length);
      } catch (err) {
        console.error("Autocomplete Error:", err);
        setSuggestions([]);
        setSuggestionsCount(0);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, setSuggestionsCount]);

  useEffect(() => {
    const handleEnter = (e) => {
      if (e.key === 'Enter' && activeIndex >= 0 && suggestions.length > activeIndex) {
        onPick(suggestions[activeIndex].name);
      }
    };
    
    document.addEventListener('keydown', handleEnter);
    
    return () => document.removeEventListener('keydown', handleEnter);
  }, [activeIndex, suggestions, onPick]);

  if (!suggestions.length) return null;

  return (
    <ul className="autocomplete-list" ref={listRef}>
      {suggestions.map((item, i) => (
        <li 
          key={i} 
          onClick={() => onPick(item.name)}
          className={i === activeIndex ? 'active-suggestion' : ''}
        >
          <div className="city-name">{item.fullName}</div>
        </li>
      ))}
    </ul>
  );
}