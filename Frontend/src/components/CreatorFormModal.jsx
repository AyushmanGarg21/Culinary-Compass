import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Fade,
  Slide,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Grow,
  Chip,
  InputAdornment
} from '@mui/material';
import {
  Close as CloseIcon,
  Star as StarIcon,
  Person as PersonIcon,
  Link as LinkIcon,
  Send as SendIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';

const CreatorFormModal = ({ open, handleClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    message: '',
    experience: '',
    links: '',
  });

  const steps = ['Tell us about yourself', 'Share your experience', 'Provide links'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Submitting Creator Form...', formData);
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Reset after showing success
      setTimeout(() => {
        setFormData({ message: '', experience: '', links: '' });
        setActiveStep(0);
        setIsSubmitted(false);
        handleClose();
      }, 2000);
    }, 1500);
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return formData.message.trim().length > 10;
      case 1:
        return formData.experience.trim().length > 5;
      case 2:
        return formData.links.trim().length > 0;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grow in={true} timeout={500}>
            <TextField
              label="Tell us why you want to become a creator"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Share your passion, goals, and what makes you unique..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
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
          </Grow>
        );
      case 1:
        return (
          <Grow in={true} timeout={500}>
            <TextField
              label="Relevant Experience"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Describe your background, skills, and previous work..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <StarIcon color="primary" />
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
          </Grow>
        );
      case 2:
        return (
          <Grow in={true} timeout={500}>
            <TextField
              label="Portfolio Links"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              name="links"
              value={formData.links}
              onChange={handleChange}
              placeholder="Share your portfolio, social media, or relevant links..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon color="primary" />
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
          </Grow>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="creator-form-modal"
      closeAfterTransition
    >
      <Fade in={open} timeout={400}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: '500px', md: '600px' },
            maxHeight: '90vh',
            overflow: 'auto'
          }}
        >
          <Paper
            elevation={24}
            sx={{
              p: 4,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              position: 'relative'
            }}
          >
            {/* Close Button */}
            <IconButton
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 16,
                top: 16,
                backgroundColor: 'rgba(0,0,0,0.05)',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Success State */}
            {isSubmitted ? (
              <Fade in={isSubmitted} timeout={600}>
                <Box className="text-center py-8">
                  <Grow in={isSubmitted} timeout={800}>
                    <CheckIcon
                      sx={{
                        fontSize: '4rem',
                        color: '#4caf50',
                        mb: 2
                      }}
                    />
                  </Grow>
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                      fontWeight: 700,
                      color: '#4caf50',
                      mb: 1
                    }}
                  >
                    Application Submitted!
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                      color: '#666'
                    }}
                  >
                    We'll review your application and get back to you soon.
                  </Typography>
                </Box>
              </Fade>
            ) : (
              <>
                {/* Header */}
                <Box className="text-center mb-6">
                  <Slide direction="down" in={open} timeout={600}>
                    <Box>
                      <StarIcon
                        sx={{
                          fontSize: '3rem',
                          color: 'primary.main',
                          mb: 2
                        }}
                      />
                      <Typography
                        variant="h4"
                        sx={{
                          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                          fontWeight: 700,
                          background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          mb: 1
                        }}
                      >
                        Become a Creator
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                          color: '#666'
                        }}
                      >
                        Join our community of talented creators
                      </Typography>
                    </Box>
                  </Slide>
                </Box>

                {/* Progress Stepper */}
                <Slide direction="up" in={open} timeout={800}>
                  <Box className="mb-6">
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
                </Slide>

                {/* Form Content */}
                <Box className="mb-6 min-h-[200px]">
                  {renderStepContent()}
                </Box>

                {/* Action Buttons */}
                <Slide direction="up" in={open} timeout={1000}>
                  <Box className="flex justify-between items-center">
                    <Button
                      onClick={handleBack}
                      disabled={activeStep === 0}
                      sx={{
                        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                        fontWeight: 500,
                        textTransform: 'none',
                        px: 3
                      }}
                    >
                      Back
                    </Button>

                    <Box className="flex gap-2 items-center">
                      {/* Progress Chips */}
                      {steps.map((_, index) => (
                        <Chip
                          key={index}
                          size="small"
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
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
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
                </Slide>
              </>
            )}
          </Paper>
        </Box>
      </Fade>
    </Modal>
  );
};

export default CreatorFormModal;
