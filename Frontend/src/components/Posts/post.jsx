import React, { useState } from 'react';
import { Box, Button, Typography, Avatar, Drawer, Chip, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import './CSS/Post.css';

const Post = ({ post }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open);
  };

  return (
    <Box className="post-container p-6 mb-8 bg-white rounded-lg shadow-md max-w-xl mx-auto">
      <Box className="flex items-center justify-between mb-4">
        {/* Profile Picture and Username */}
        <Box className="flex items-center space-x-4">
          <Avatar src={post.profilePic} alt={post.username} sx={{ width: 36, height: 36 }} />
          <Typography variant="subtitle1">{post.username}</Typography>
        </Box>

        {/* View Button at the end of the div */}
        <Button variant="outlined" size="small" onClick={toggleDrawer(true)}>
          View
        </Button>
      </Box>

      {/* Post Image */}
      <Box>
        <img src={post.image} alt="Recipe" className="w-full rounded-lg mb-2" />
      </Box>

      {/* Description */}
      <Typography variant="body2" className="text-gray-600">
        {post.description}
      </Typography>

      {/* Drawer for Recipe Detail */}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        className="recipe-drawer"
        variant={window.innerWidth > 768 ? 'persistent' : 'temporary'}
        onBackdropClick={toggleDrawer(false)} // Close on backdrop click
      >
        <Box className="p-4 w-96 sm:w-full">
          {/* Close Button */}
          <Box className="flex justify-end">
            <IconButton onClick={toggleDrawer(false)} aria-label="close">
              <Close />
            </IconButton>
          </Box>

          {/* Materials List */}
          <Box className="flex flex-wrap gap-2 mb-4">
            {post.materials.map((material, index) => (
              <Chip key={index} label={material} color="primary" />
            ))}
          </Box>

          {/* Full Recipe Content */}
          <Box
            dangerouslySetInnerHTML={{ __html: post.fullRecipe }}
            className="recipe-content mt-4"
          />
        </Box>
      </Drawer>
    </Box>
  );
};

export default Post;
