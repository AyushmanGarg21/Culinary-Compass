import React, { useState, useEffect } from 'react';
import { IconButton, TextField, InputAdornment } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const Search = ({ list, setId, action = null, componentName }) => {
  const [query, setQuery] = useState('');
  const [num, setNum] = useState(10);
  const [filteredResults, setFilteredResults] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);

    const results = list.filter((item) =>
      item.name.toLowerCase().includes(value)
    );
    setFilteredResults(results);
  };

  const handleSelect = (item) => {
    setId(item.id);
    if (action) {
      action(item, componentName);
    }
  };

  const handleClear = () => {
    setQuery('');
    setFilteredResults([]);
  };

  useEffect(() => {
    if (query === '') {
      setFilteredResults([]);
    }
  }, [query]);

  useEffect(() => {
    setNum(Math.max(Math.min(filteredResults.length * 60, 200) + 10, 70));
  }, [filteredResults, query]);

  return (
    <>
      <div className="relative w-full mt-4">
        <TextField
          value={query}
          onChange={handleSearch}
          placeholder="Search..."
          fullWidth
          variant="outlined"
          size="small"
          InputProps={{
            endAdornment: query && (
              <InputAdornment position="end">
                <IconButton onClick={handleClear} edge="end">
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        {query && (
          <div
            className="absolute top-full mt-2 w-full bg-white shadow-xl rounded-md z-50 custom-scrollbar"
            style={{ maxHeight: '200px', overflowY: 'auto' }}
          >
            {filteredResults.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {filteredResults.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className="p-4 cursor-pointer hover:bg-blue-100 transition"
                  >
                    <span className="font-medium text-gray-800">{item.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-4 text-gray-500">No results found.</p>
            )}
          </div>
        )}
      </div>
      <div style={{ marginTop: `${num}px` }}></div>
    </>
  );
};

export default Search;
