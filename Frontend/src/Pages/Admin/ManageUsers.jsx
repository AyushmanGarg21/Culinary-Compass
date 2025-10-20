// ManageUsers.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../redux/features/Admin/manageSlice';
import ManageCard from '../../components/Admin/ManageCard';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const ManageUsers = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.manage.usersData.data);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery) || user.email.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Manage Users</h1>
          <p className="text-slate-600 font-medium">Oversee and manage user accounts</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-md">
            <TextField
              label="Search users by name or email"
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
                    borderColor: '#8b5cf6',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8b5cf6',
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.length === 0 ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="text-slate-500 font-medium">No users found</div>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <ManageCard
                key={user.id}
                id={user.id}
                name={user.name}
                phone={user.phone}
                email={user.email}
                role="user"
                onDelete={() => console.log(`Delete ${user.id}`)}
                onDeactivate={() => console.log(`Deactivate ${user.id}`)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
