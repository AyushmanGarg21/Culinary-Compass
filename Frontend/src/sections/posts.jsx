// Posts.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import Post from '../components/Posts/post';

const dummyPosts = [
    {
      id: 1,
      username: 'John Doe',
      profilePic: 'https://via.placeholder.com/40',
      image: 'https://via.placeholder.com/400x300',
      description: 'A delicious and easy-to-make recipe for everyone!',
      materials: ['Salt', 'Pepper', 'Olive Oil', 'Garlic'],
      fullRecipe: '<p>This is the full recipe with all instructions, ingredients, etc.</p>'
    },
    {
      id: 2,
      username: 'Jane Doe',
      profilePic: 'https://via.placeholder.com/40',
      image: 'https://via.placeholder.com/400x300',
      description: 'Another delicious recipe for you to try!',
      materials: ['Salt', 'Pepper', 'Olive Oil', 'Garlic'],
      fullRecipe: '<p>This is the full recipe with all instructions, ingredients, etc.</p>'
    },


    // Additional posts
  ];

const Posts = () => {
  return (
    <div className="flex flex-col">
        <div className='flex item-center'>
            <Typography variant="h4" className="font-bold">POSTS</Typography>
        </div>
        <Box className="posts-container p-4 overflow-y-auto h-[70vh] custom-scrollbar mt-8">
            {dummyPosts.map((post) => (
                <Post key={post.id} post={post} />
            ))}
        </Box>
    </div>
  );
};

export default Posts;
