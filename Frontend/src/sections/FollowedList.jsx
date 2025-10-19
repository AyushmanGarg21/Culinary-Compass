import { useEffect, useState } from 'react';
import { Typography, CircularProgress, Fade, Slide, TextField, InputAdornment, IconButton } from '@mui/material';
import { People as PeopleIcon, Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
import UserFollowedCard from '../components/Posts/UserFollowedCard';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFollowedUsers } from '../redux/features/FollowedUsers/followedUsersSlice';

const FollowedList = () => {
  const dispatch = useDispatch();
  const { followedUsers, loading, error } = useSelector((state) => state.followedUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (followedUsers.length === 0) {
      dispatch(fetchFollowedUsers());
    }
  }, [dispatch, followedUsers.length]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(followedUsers);
    } else {
      const filtered = followedUsers.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.foodPreference.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, followedUsers]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4 p-6">
        <CircularProgress className="text-purple-600" size={40} />
        <Typography className="text-gray-600">Loading your network...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4 p-6">
        <Typography className="text-red-500">Error loading followed users: {error}</Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col mobile-following-height tablet-following-height desktop-following-height" style={{ height: '60vh' }}>
      {/* Header */}
      <Fade in={true} timeout={600}>
        <div className="flex items-center justify-center p-3 md:p-4 border-b border-gray-100 bg-white">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="p-1.5 md:p-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full">
              <PeopleIcon className="text-white text-sm md:text-base" />
            </div>
            <Typography 
              variant="h6" 
              className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-sm md:text-base"
            >
              Following
            </Typography>
          </div>
        </div>
      </Fade>

      {/* Search Bar */}
      <div className="p-2 md:p-3 bg-white border-b border-gray-100">
        <TextField
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search following..."
          fullWidth
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className="text-gray-400 text-sm" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton 
                  onClick={handleClearSearch} 
                  edge="end"
                  className="hover:bg-red-50 text-red-500"
                  size="small"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          className="bg-white/50 backdrop-blur-sm rounded-lg"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              fontSize: '0.875rem',
              '&:hover fieldset': {
                borderColor: '#8B5CF6',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#8B5CF6',
                borderWidth: '2px',
              },
            },
          }}
        />
      </div>

      {/* Users List - Fixed Height with Internal Scroll */}
      <div 
        className="flex-1 overflow-y-auto custom-scrollbar p-2 md:p-3 lg:p-4 bg-gray-50 mobile-following-content tablet-following-content desktop-following-content" 
        style={{ 
          height: 'calc(60vh - 140px)',
          maxHeight: 'calc(60vh - 140px)'
        }}
      >
        <div className="space-y-2 md:space-y-3">
          {filteredUsers.map((user, index) => (
            <Slide
              key={user.id}
              direction="left"
              in={true}
              timeout={300 + index * 100}
            >
              <div>
                <UserFollowedCard user={user} />
              </div>
            </Slide>
          ))}
        </div>

        {filteredUsers.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full space-y-2 md:space-y-4">
            <PeopleIcon className="text-gray-300 text-3xl md:text-4xl lg:text-6xl" />
            <Typography className="text-gray-500 text-center text-xs md:text-sm lg:text-base">
              {searchQuery ? 'No users found matching your search.' : 'No followed users yet.'}
              <br />
              {!searchQuery && 'Start following people to see them here!'}
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowedList;
