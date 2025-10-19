import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress, Fade, Grow } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import Post from '../components/Posts/post';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '../redux/features/Posts/postsSlice';

const Posts = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    if (posts.length === 0) {
      dispatch(fetchPosts());
    }
  }, [dispatch, posts.length]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <CircularProgress className="text-blue-600" size={40} />
        <Typography className="text-gray-600">Loading delicious posts...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Typography className="text-red-500">Error loading posts: {error}</Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ height: '80vh' }}>
      {/* Header */}
      <Fade in={true} timeout={600}>
        <div className="flex items-center justify-center p-4 border-b border-gray-100 bg-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full">
              <RestaurantIcon className="text-white" />
            </div>
            <Typography 
              variant="h5" 
              className="font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"
            >
              Food Posts
            </Typography>
          </div>
        </div>
      </Fade>

      {/* Posts Container - Fixed Height with Internal Scroll */}
      <Box 
        className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50" 
        style={{ 
          height: 'calc(80vh - 80px)',
          maxHeight: 'calc(80vh - 80px)'
        }}
      >
        <div className="space-y-4 p-4">
          {posts.map((post, index) => (
            <Grow
              key={post.id}
              in={true}
              timeout={300 + index * 100}
              style={{ transformOrigin: '0 0 0' }}
            >
              <div className="flex items-center justify-center">
                <div className="w-full max-w-lg">
                  <Post post={post} />
                </div>
              </div>
            </Grow>
          ))}
        </div>
        
        {posts.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <RestaurantIcon className="text-gray-300 text-6xl" />
            <Typography className="text-gray-500 text-center">
              No posts available yet.<br />
              Check back later for delicious content!
            </Typography>
          </div>
        )}
      </Box>
    </div>
  );
};

export default Posts;
