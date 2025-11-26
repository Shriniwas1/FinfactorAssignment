import React, { useState, useCallback } from 'react';
import AutocompleteList from './AutocompleteList';

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [suggestionsCount, setSuggestionsCount] = useState(0);

  const handlePick = (name) => {
    onSearch(name);
    setQuery('');
    setActiveIndex(-1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeIndex >= 0) return;
    onSearch(query);
    setQuery('');
    setActiveIndex(-1);
  };

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!suggestionsCount) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < suggestionsCount - 1 ? prev + 1 : prev));
    } 
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
    } 
    else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
    } 
    else if (e.key === 'Escape') {
      setActiveIndex(-1);
      setQuery('');
    }
  }, [suggestionsCount, activeIndex]);

  return (
    <div>
      <form className="searchbar" onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          placeholder="Type city name (e.g. Pune)"
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <AutocompleteList
        query={query}
        onPick={handlePick}
        activeIndex={activeIndex}
        setSuggestionsCount={setSuggestionsCount}
      />
    </div>
  );
}
