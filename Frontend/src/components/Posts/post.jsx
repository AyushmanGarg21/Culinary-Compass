import { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Avatar, 
  Drawer, 
  Chip, 
  IconButton,
  Fade
} from '@mui/material';
import { 
  Close, 
  Visibility as VisibilityIcon,
  AccessTime as AccessTimeIcon,
  LocalOffer as LocalOfferIcon,
  Schedule as ScheduleIcon,
  Restaurant as RestaurantIcon,
  People as PeopleIcon
} from '@mui/icons-material';

const Post = ({ post }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open);
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const getCuisineColor = (cuisine) => {
    const colors = {
      'Italian': 'bg-red-100 text-red-800',
      'Healthy': 'bg-green-100 text-green-800',
      'Pakistani': 'bg-orange-100 text-orange-800',
      'Mexican': 'bg-yellow-100 text-yellow-800',
      'Japanese': 'bg-purple-100 text-purple-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[cuisine] || colors.default;
  };

  return (
    <Fade in={true} timeout={600}>
      <Box className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Header */}
        <Box className="flex items-center justify-between p-4 border-b border-gray-100">
          <Box className="flex items-center space-x-3">
            <Avatar 
              src={post.profilePic} 
              alt={post.username} 
              className="w-12 h-12 border-2 border-white shadow-md"
            />
            <div>
              <Typography variant="subtitle1" className="font-semibold text-gray-800">
                {post.username}
              </Typography>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <AccessTimeIcon fontSize="small" />
                <span>{formatTimeAgo(post.createdAt)}</span>
                <span>•</span>
                <Chip 
                  label={post.cuisine_type}
                  size="small"
                  className={`text-xs ${getCuisineColor(post.cuisine_type)}`}
                />
              </div>
            </div>
          </Box>

          <Button 
            variant="outlined" 
            size="small" 
            onClick={toggleDrawer(true)}
            startIcon={<VisibilityIcon />}
            className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:border-blue-300 rounded-xl transition-all duration-200"
          >
            Recipe
          </Button>
        </Box>

        {/* Post Image */}
        <Box className="relative overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title} 
            className={`w-full h-64 object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
          )}
        </Box>

        {/* Content */}
        <Box className="p-4">
          {/* Recipe Title */}
          <Typography variant="h6" className="font-bold text-gray-800 mb-2">
            {post.title}
          </Typography>

          {/* Overview */}
          <Typography variant="body2" className="text-gray-600 mb-3 leading-relaxed">
            {post.overview}
          </Typography>

          {/* Ingredients Preview (up to 3) */}
          <Box className="flex flex-wrap gap-2 mb-3">
            <LocalOfferIcon className="text-gray-400 text-sm mt-1" />
            {post.ingredients.slice(0, 3).map((ingredient, index) => (
              <Chip 
                key={index} 
                label={ingredient.name} 
                size="small"
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              />
            ))}
            {post.ingredients.length > 3 && (
              <Chip 
                label={`+${post.ingredients.length - 3} more`}
                size="small"
                className="bg-blue-100 text-blue-700"
              />
            )}
          </Box>
        </Box>

        {/* Enhanced Recipe Drawer */}
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={toggleDrawer(false)}
          className="recipe-drawer"
          slotProps={{
            paper: {
              className: "w-96 bg-gradient-to-br from-white to-gray-50"
            }
          }}
        >
          <Box className="h-full flex flex-col">
            {/* Drawer Header */}
            <Box className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
              <Typography variant="h6" className="font-bold text-gray-800">
                {post.title}
              </Typography>
              <IconButton 
                onClick={toggleDrawer(false)} 
                className="text-gray-500 hover:bg-gray-100"
              >
                <Close />
              </IconButton>
            </Box>

            {/* Drawer Content */}
            <Box className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Recipe Image */}
              <Box className="relative">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-48 object-cover rounded-xl shadow-md"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
              </Box>

              {/* Recipe Info */}
              <Box className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <ScheduleIcon className="text-blue-600 mb-1" />
                  <Typography variant="caption" className="block text-gray-600">
                    Cook Time
                  </Typography>
                  <Typography variant="body2" className="font-semibold">
                    {post.cooking_time} min
                  </Typography>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <RestaurantIcon className="text-green-600 mb-1" />
                  <Typography variant="caption" className="block text-gray-600">
                    Cuisine
                  </Typography>
                  <Typography variant="body2" className="font-semibold">
                    {post.cuisine_type}
                  </Typography>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <PeopleIcon className="text-purple-600 mb-1" />
                  <Typography variant="caption" className="block text-gray-600">
                    Servings
                  </Typography>
                  <Typography variant="body2" className="font-semibold">
                    {post.servings}
                  </Typography>
                </div>
              </Box>

              {/* Overview */}
              <Box>
                <Typography variant="subtitle1" className="font-semibold text-gray-800 mb-2">
                  Overview
                </Typography>
                <Typography variant="body2" className="text-gray-600 leading-relaxed">
                  {post.overview}
                </Typography>
              </Box>

              {/* Ingredients */}
              <Box>
                <Typography variant="subtitle1" className="font-semibold text-gray-800 mb-3 flex items-center">
                  <LocalOfferIcon className="mr-2 text-orange-500" />
                  Ingredients
                </Typography>
                <Box className="flex flex-wrap gap-2">
                  {post.ingredients.map((ingredient, index) => (
                    <Fade key={index} in={true} timeout={300 + index * 50}>
                      <Chip 
                        label={ingredient.name}
                        size="small"
                        className="bg-orange-50 text-orange-800 hover:bg-orange-100 transition-colors text-xs"
                      />
                    </Fade>
                  ))}
                </Box>
              </Box>

              {/* Instructions */}
              <Box>
                <Typography variant="subtitle1" className="font-semibold text-gray-800 mb-3">
                  Instructions
                </Typography>
                <Box 
                  className="bg-gray-50 p-4 rounded-xl prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.instructions }}
                />
              </Box>
            </Box>
          </Box>
        </Drawer>
      </Box>
    </Fade>
  );
};

export default Post;
