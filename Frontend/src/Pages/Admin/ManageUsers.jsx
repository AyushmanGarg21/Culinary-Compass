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
        {filteredUsers.map((user) => (
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
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;
