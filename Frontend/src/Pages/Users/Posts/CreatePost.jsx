// CreatePost.jsx
import { useState, useRef } from 'react';
import {
  Button,
  TextField,
  Box,
  Chip,
  IconButton,
  Typography,
  Paper,
  Fade,
  Grow,
  LinearProgress,
  InputAdornment,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Restaurant as RestaurantIcon,
  Timer as TimerIcon,
  People as PeopleIcon,
  HourglassEmpty as PendingIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './CSS/CreatePost.css';

const CreatePost = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [overview, setOverview] = useState('');
  const [title, setTitle] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [servings, setServings] = useState('');
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const steps = ['Recipe Basics', 'Add Image', 'Ingredients', 'Instructions'];

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handleKeywordAdd = () => {
    if (currentKeyword.trim() && keywords.length < 20 && !keywords.includes(currentKeyword.trim())) {
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword('');
    }
  };

  const handleKeywordDelete = (keywordToDelete) => {
    setKeywords(keywords.filter(keyword => keyword !== keywordToDelete));
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return title.trim().length > 0 && overview.trim().length > 10;
      case 1:
        return true; // Image is optional
      case 2:
        return keywords.length > 0;
      case 3:
        return details.trim().length > 20;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const postData = {
      title,
      overview,
      cookingTime,
      servings,
      image: imageFile,
      keywords,
      details
    };

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log("Data submitted:", postData);

    setIsSubmitting(false);
    setIsSubmitted(true);
    setShowSuccess(true);

    // Reset form after success
    setTimeout(() => {
      setTitle('');
      setOverview('');
      setCookingTime('');
      setServings('');
      setImage(null);
      setImageFile(null);
      setKeywords([]);
      setDetails('');
      setActiveStep(0);
      setIsSubmitted(false);
    }, 3000);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grow in={true} timeout={500}>
            <Box className="space-y-6">
              <TextField
                label="Recipe Title"
                variant="outlined"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your recipe a name..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RestaurantIcon color="primary" />
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: 'white',
                    borderRadius: 2,
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                  }
                }}
                sx={{
                  '& .MuiInputLabel-root': {
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 500
                  }
                }}
              />

              <TextField
                label="Recipe Overview"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                slotProps={{ htmlInput: { maxLength: 200 } }}
                placeholder="Describe your recipe..."
                helperText={`${overview.length}/200 characters`}
                InputProps={{
                  sx: {
                    backgroundColor: 'white',
                    borderRadius: 2,
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                  }
                }}
              />

              <Box className="flex gap-4">
                <TextField
                  label="Cooking Time"
                  variant="outlined"
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value)}
                  placeholder="30 mins"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TimerIcon color="primary" />
                      </InputAdornment>
                    ),
                    sx: { backgroundColor: 'white', borderRadius: 2 }
                  }}
                  sx={{ flex: 1 }}
                />

                <TextField
                  label="Servings"
                  variant="outlined"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  placeholder="4 people"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PeopleIcon color="primary" />
                      </InputAdornment>
                    ),
                    sx: { backgroundColor: 'white', borderRadius: 2 }
                  }}
                  sx={{ flex: 1 }}
                />
              </Box>
            </Box>
          </Grow>
        );

      case 1:
        return (
          <Grow in={true} timeout={500}>
            <Box className="space-y-4">
              <Typography variant="h6" className="text-center mb-4" sx={{ fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif' }}>
                Add a photo of your recipe
              </Typography>

              <Card
                className={`border-2 border-dashed transition-all duration-300 cursor-pointer ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                sx={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <CardContent className="text-center">
                  {image ? (
                    <Box className="relative">
                      <img
                        src={image}
                        alt="Recipe preview"
                        className="max-h-48 max-w-full object-cover rounded-lg mx-auto"
                      />
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setImage(null);
                          setImageFile(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-600"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box>
                      <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6" sx={{ fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif' }}>
                        Drop your image here or click to browse
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Supports JPG, PNG, GIF up to 5MB
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>

              <input
                ref={fileInputRef}
                accept="image/*"
                type="file"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
            </Box>
          </Grow>
        );

      case 2:
        return (
          <Grow in={true} timeout={500}>
            <Box className="space-y-4">
              <Typography variant="h6" sx={{ fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif' }}>
                Add Ingredients ({keywords.length}/20)
              </Typography>

              <TextField
                label="Add Ingredient"
                variant="outlined"
                fullWidth
                value={currentKeyword}
                onChange={(e) => setCurrentKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleKeywordAdd();
                  }
                }}
                placeholder="e.g., 2 cups flour, 1 tsp salt..."
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleKeywordAdd}
                        disabled={!currentKeyword.trim() || keywords.length >= 20}
                        color="primary"
                      >
                        <AddIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { backgroundColor: 'white', borderRadius: 2 }
                }}
              />

              <Box className="flex flex-wrap gap-2 min-h-[100px] p-4 bg-gray-50 rounded-lg">
                {keywords.length === 0 ? (
                  <Typography variant="body2" color="textSecondary" className="w-full text-center py-8">
                    No ingredients added yet. Start typing above!
                  </Typography>
                ) : (
                  keywords.map((keyword, index) => (
                    <Fade in={true} key={index} timeout={300}>
                      <Chip
                        label={keyword}
                        variant="filled"
                        onDelete={() => handleKeywordDelete(keyword)}
                        color="primary"
                        sx={{
                          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                          '&:hover': { transform: 'scale(1.05)' },
                          transition: 'transform 0.2s ease'
                        }}
                      />
                    </Fade>
                  ))
                )}
              </Box>
            </Box>
          </Grow>
        );

      case 3:
        return (
          <Grow in={true} timeout={500}>
            <Box className="space-y-4">
              <Typography variant="h6" sx={{ fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif' }}>
                Cooking Instructions
              </Typography>

              <Box className="bg-white rounded-lg">
                <ReactQuill
                  value={details}
                  onChange={setDetails}
                  placeholder="Write step-by-step cooking instructions..."
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, false] }],
                      ['bold', 'italic', 'underline'],
                      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                      ['clean']
                    ],
                  }}
                  style={{ minHeight: '200px' }}
                />
              </Box>

              <Typography variant="caption" color="textSecondary">
                Tip: Use numbered lists for clear step-by-step instructions
              </Typography>
            </Box>
          </Grow>
        );

      default:
        return null;
    }
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <Box className="max-w-4xl mx-auto px-4">
        {/* Success State */}
        {isSubmitted ? (
          <Fade in={isSubmitted} timeout={600}>
            <Paper
              elevation={24}
              sx={{
                p: 6,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
                textAlign: 'center'
              }}
            >
              <Grow in={isSubmitted} timeout={800}>
                <PendingIcon sx={{ fontSize: '4rem', color: '#f59e0b', mb: 2 }} />
              </Grow>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: 700,
                  color: '#f59e0b',
                  mb: 1
                }}
              >
                Recipe Submitted!
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  color: '#666',
                  mb: 2
                }}
              >
                Your recipe has been submitted for review.
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  color: '#888',
                  fontStyle: 'italic'
                }}
              >
                You'll be notified once it's approved and published to the community.
              </Typography>
            </Paper>
          </Fade>
        ) : (
          <Paper
            elevation={24}
            sx={{
              p: 4,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
            }}
          >
            {/* Header */}
            <Box className="text-center mb-8">
              <RestaurantIcon sx={{ fontSize: '3rem', color: 'primary.main', mb: 2 }} />
              <Typography
                variant="h3"
                sx={{
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 3
                }}
              >
                Share Your Recipe
              </Typography>
            </Box>

            {/* Stepper */}
            <Box className="mb-8">
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      sx={{
                        '& .MuiStepLabel-label': {
                          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                          fontWeight: 500,
                          fontSize: '0.875rem'
                        }
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            {/* Form Content */}
            <Box className="mb-2 min-h-[350px]">
              {renderStepContent()}
            </Box>

            {/* Navigation */}
            <Box className="flex justify-between items-center">
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={{
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: 500,
                  textTransform: 'none',
                  px: 4,
                  py: 1.5
                }}
              >
                Back
              </Button>

              <Box className="flex gap-2 items-center">
                {steps.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: index <= activeStep ? 'primary.main' : 'grey.300',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </Box>

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isSubmitting}
                  startIcon={isSubmitting ? null : <SendIcon />}
                  sx={{
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: '25px',
                    px: 4,
                    py: 1.5,
                    boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 25px rgba(25, 118, 210, 0.4)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isSubmitting ? 'Submitting Recipe...' : 'Submit for Review'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  sx={{
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: '25px',
                    px: 4,
                    py: 1.5,
                    boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 25px rgba(25, 118, 210, 0.4)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Next
                </Button>
              )}
            </Box>
          </Paper>
        )}

        {/* Success Snackbar */}
        <Snackbar
          open={showSuccess}
          autoHideDuration={3000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="info" sx={{ width: '100%' }}>
            Recipe submitted for admin review!
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default CreatePost;
