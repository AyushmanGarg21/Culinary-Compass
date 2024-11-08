// ManageCreators.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCreators } from '../../redux/features/Admin/manageSlice';
import ManageCard from '../../components/Admin/ManageCard';
import { TextField ,InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const ManageCreators = () => {
    const dispatch = useDispatch();
    const creators = useSelector((state) => state.manage.creatorsData.data);
    const [searchQuery, setSearchQuery] = useState('');
  
    useEffect(() => {
      dispatch(fetchCreators());
    }, [dispatch]);
  
    const handleSearch = (e) => {
      setSearchQuery(e.target.value.toLowerCase());
    };
  
    const filteredCreators = creators.filter((creator) =>
      creator.name.toLowerCase().includes(searchQuery) || creator.email.toLowerCase().includes(searchQuery)
    );
  
    return (
      <div className="p-4 flex flex-col items-center">
         <div className="mb-6 w-3/4 md:w-1/2 lg:w-1/3">
        <TextField
          label="Search Users"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearch}
          className="rounded-full shadow-md bg-white"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: '#888' }} />
              </InputAdornment>
            ),
            style: {
              borderRadius: '9999px',
              padding: '10px 20px', 
              backgroundColor: '#f3f4f6',
              border: '1px solid #ddd',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            },
          }}
          InputLabelProps={{
            style: {
              fontSize: '1rem',
              color: '#888',
            },
          }}
        />
      </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
          {filteredCreators.map((creator) => (
            <ManageCard
              key={creator.id}
              id = {creator.id}
              name={creator.name}
              phone={creator.phone}
              email={creator.email}
              role="creator"
              onDelete={() => console.log(`Delete ${creator.id}`)}
              onDeactivate={() => console.log(`Deactivate ${creator.id}`)}
              onRemoveFromCreator={() => console.log(`Remove from Creator ${creator.id}`)}
            />
          ))}
        </div>
      </div>
    );
  };
  

export default ManageCreators;
