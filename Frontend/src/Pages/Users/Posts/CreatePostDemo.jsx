// CreatePostDemo.jsx - Example usage of the enhanced CreatePost component
import { useState } from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import CreatePost from './CreatePost';

const CreatePostDemo = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box className="text-center mb-8">
        <Typography
          variant="h2"
          sx={{
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 700,
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          Culinary
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            color: '#666',
            mb: 4
          }}
        >
          Share your culinary adventures with the world
        </Typography>
        
        {!showCreatePost && ( 
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => setShowCreatePost(true)}
            sx={{
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '25px',
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 25px rgba(25, 118, 210, 0.4)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Create New Recipe
          </Button>
        )}
      </Box>

      {showCreatePost && <CreatePost />}
    </Container>
  );
};

export default CreatePostDemo;