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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Manage Creators</h1>
            <p className="text-slate-600 font-medium">Oversee and manage creator accounts</p>
          </div>

          {/* Search Bar */}
          <div className="mb-8 flex justify-center">
            <div className="w-full max-w-md">
              <TextField
                label="Search creators by name or email"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon className="text-slate-400" />
                    </InputAdornment>
                  ),
                  style: {
                    borderRadius: '12px',
                    backgroundColor: 'white',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontWeight: '500',
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#e2e8f0',
                      borderWidth: '2px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#10b981',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#10b981',
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCreators.length === 0 ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="text-slate-500 font-medium">No creators found</div>
              </div>
            ) : (
              filteredCreators.map((creator) => (
                <ManageCard
                  key={creator.id}
                  id={creator.id}
                  name={creator.name}
                  phone={creator.phone}
                  email={creator.email}
                  role="creator"
                  onDelete={() => console.log(`Delete ${creator.id}`)}
                  onDeactivate={() => console.log(`Deactivate ${creator.id}`)}
                  onRemoveFromCreator={() => console.log(`Remove from Creator ${creator.id}`)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    );
  };
  

export default ManageCreators;
