import React, { useState, useEffect } from 'react';
import { IconButton, TextField, InputAdornment, Avatar, Fade, Grow } from '@mui/material';
import { Close as CloseIcon, Search as SearchIcon } from '@mui/icons-material';

const Search = ({ list, setId, action = null, componentName }) => {
  const [query, setQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);
    setIsSearching(value.length > 0);

    const results = list.filter((item) =>
      item.name.toLowerCase().includes(value)
    );
    setFilteredResults(results);
  };

  const handleSelect = (item) => {
    setId(item.id);
    setQuery('');
    setFilteredResults([]);
    setIsSearching(false);
    if (action) {
      action(item, componentName);
    }
  };

  const handleClear = () => {
    setQuery('');
    setFilteredResults([]);
    setIsSearching(false);
  };

  useEffect(() => {
    if (query === '') {
      setFilteredResults([]);
      setIsSearching(false);
    }
  }, [query]);

  return (
    <div className="relative w-full">
      <TextField
        value={query}
        onChange={handleSearch}
        placeholder="Search creators..."
        fullWidth
        variant="outlined"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon className="text-gray-400" />
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton 
                onClick={handleClear} 
                edge="end"
                className="hover:bg-red-50 text-red-500"
                size="small"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
        className="bg-white/50 backdrop-blur-sm rounded-xl"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            '&:hover fieldset': {
              borderColor: '#3B82F6',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#3B82F6',
              borderWidth: '2px',
            },
          },
        }}
      />

      {isSearching && (
        <Fade in={true} timeout={300}>
          <div className="absolute top-full mt-2 w-full bg-white/95 backdrop-blur-sm shadow-2xl rounded-xl border border-white/20 overflow-hidden" style={{ zIndex: 9999 }}>
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              {filteredResults.length > 0 ? (
                <div className="py-2">
                  {filteredResults.map((item, index) => (
                    <Grow
                      key={item.id}
                      in={true}
                      timeout={200 + index * 50}
                    >
                      <div
                        onClick={() => handleSelect(item)}
                        className="flex items-center space-x-3 p-3 mx-2 cursor-pointer hover:bg-blue-50 rounded-lg transition-all duration-200 hover:shadow-md"
                      >
                        <Avatar
                          src={item.profileImage}
                          alt={item.name}
                          className="w-10 h-10 border-2 border-white shadow-sm"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.country}</div>
                        </div>
                        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                          {item.foodPreference}
                        </div>
                      </div>
                    </Grow>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <SearchIcon className="text-gray-300 text-4xl mb-2" />
                  <p className="text-gray-500">No users found</p>
                  <p className="text-sm text-gray-400">Try a different search term</p>
                </div>
              )}
            </div>
          </div>
        </Fade>
      )}
    </div>
  );
};

export default Search;
