import React, { useState } from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search...", 
  value = "",
  className = "",
  autoFocus = false 
}) => {
  const [searchValue, setSearchValue] = useState(value);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    if (onSearch) {
      onSearch(newValue);
    }
  };

  const handleClear = () => {
    setSearchValue('');
    if (onSearch) {
      onSearch('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  return (
    <form className={`search-bar ${className}`} onSubmit={handleSubmit}>
      <div className="search-input-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="search-input"
          autoFocus={autoFocus}
        />
        {searchValue && (
          <button 
            type="button" 
            className="clear-button"
            onClick={handleClear}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      <button type="submit" className="search-submit">
        Search
      </button>
    </form>
  );
};

// Advanced SearchBar with filters (if needed)
export const AdvancedSearchBar = ({ 
  onSearch, 
  onFilterChange,
  filters = {},
  placeholder = "Search businesses..."
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [localFilters, setLocalFilters] = useState(filters);

  const handleSearch = (value) => {
    setSearchValue(value);
    if (onSearch) {
      onSearch(value, localFilters);
    }
  };

  const handleFilterChange = (filterType, value) => {
    const updatedFilters = {
      ...localFilters,
      [filterType]: value
    };
    setLocalFilters(updatedFilters);
    if (onFilterChange) {
      onFilterChange(updatedFilters);
    }
    if (onSearch) {
      onSearch(searchValue, updatedFilters);
    }
  };

  return (
    <div className="advanced-search-bar">
      <SearchBar 
        onSearch={handleSearch}
        placeholder={placeholder}
        value={searchValue}
      />
      
      <div className="search-filters">
        <div className="filter-group">
          <label htmlFor="category">Category:</label>
          <select 
            id="category"
            value={localFilters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            <option value="salon">Salon</option>
            <option value="restaurant">Restaurant</option>
            <option value="clinic">Clinic</option>
            <option value="retail">Retail</option>
            <option value="spa">Spa</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            placeholder="City or ZIP"
            value={localFilters.location || ''}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>
            <input
              type="checkbox"
              checked={localFilters.openNow || false}
              onChange={(e) => handleFilterChange('openNow', e.target.checked)}
            />
            Open Now
          </label>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;