import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  styled,
  Fade,
  Slide,
  IconButton,
  InputAdornment,
  Chip,
  Stepper,
  Step,
  StepLabel,
  LinearProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  CheckCircle,
  RestaurantMenu,
  Star,
  TrendingUp,
  LocationOn,
  Create,
  People,
  FitnessCenter
} from '@mui/icons-material';

const BackgroundBox = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    height: '100vh',
  },
}));

const MobileBrandingTop = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3, 2, 2, 2),
  background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  color: 'white',
  textAlign: 'center',
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

const MobileBrandingBottom = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2, 2, 3, 2),
  background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  color: 'white',
  textAlign: 'center',
  overflow: 'hidden',
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

const SlidingChipsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  animation: 'slideChips 15s linear infinite',
  whiteSpace: 'nowrap',
  '@keyframes slideChips': {
    '0%': {
      transform: 'translateX(100%)',
    },
    '100%': {
      transform: 'translateX(-100%)',
    },
  },
}));



const PatternSection = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 30% 70%, rgba(255, 154, 158, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 70% 30%, rgba(254, 207, 239, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(168, 237, 234, 0.2) 0%, transparent 50%)
    `,
  },
  display: 'none',
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    width: '60%',
  },
}));

const BrandingContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
  color: 'white',
  maxWidth: '500px',
}));

const FormSection = styled(Box)(({ theme }) => ({
  width: '100%',
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(145deg, #ffeef0 0%, #ffffff 100%)',
  padding: theme.spacing(3, 2),
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    width: '40%',
    height: '100%',
    padding: theme.spacing(4),
  },
}));

const RegisterForm = styled('form')(({ theme }) => ({
  width: '100%',
  maxWidth: '450px',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
  padding: theme.spacing(4),
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderRadius: '24px',
  boxShadow: '0 20px 40px rgba(255, 154, 158, 0.15)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(255, 154, 158, 0.1)',
    },
    '&.Mui-focused': {
      backgroundColor: 'white',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(255, 154, 158, 0.25)',
    },
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  borderRadius: '16px',
  padding: '16px 32px',
  fontSize: '16px',
  fontWeight: 600,
  textTransform: 'none',
  background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  boxShadow: '0 8px 25px rgba(255, 154, 158, 0.4)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #ff8a8e 0%, #fdbfdf 100%)',
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 35px rgba(255, 154, 158, 0.5)',
  },
  '&:active': {
    transform: 'translateY(-1px)',
  },
}));

const FloatingElement = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
  animation: 'float 8s ease-in-out infinite',
  '@keyframes float': {
    '0%, 100%': {
      transform: 'translateY(0px) rotate(0deg)',
    },
    '50%': {
      transform: 'translateY(-30px) rotate(180deg)',
    },
  },
}));

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // Calculate password strength
    const password = formData.password;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Add registration logic here
    localStorage.setItem('isLogin', true);
    localStorage.setItem('role', 'User');
    localStorage.setItem('accessToken', '1234567890');
    navigate('/');
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return 'error';
    if (passwordStrength < 50) return 'warning';
    if (passwordStrength < 75) return 'info';
    return 'success';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  return (
    <BackgroundBox>
      {/* Mobile Branding Top */}
      <MobileBrandingTop>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          🍽️ Foodies
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9, textAlign: 'center' }}>
          Your Food Journey Starts Here
        </Typography>
      </MobileBrandingTop>

      <PatternSection>
        {/* Floating Elements */}
        <FloatingElement
          sx={{
            width: 100,
            height: 100,
            top: '15%',
            left: '15%',
            animationDelay: '0s'
          }}
        />
        <FloatingElement
          sx={{
            width: 140,
            height: 140,
            top: '50%',
            right: '10%',
            animationDelay: '3s'
          }}
        />
        <FloatingElement
          sx={{
            width: 80,
            height: 80,
            bottom: '25%',
            left: '25%',
            animationDelay: '6s'
          }}
        />

        <Fade in={isLoaded} timeout={1200}>
          <BrandingContent>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  background: 'linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2
                }}
              >
                🍽️ Foodies
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 300,
                  opacity: 0.9,
                  mb: 4,
                  fontSize: { xs: '1.2rem', md: '1.5rem' }
                }}
              >
                Your Food Journey Starts Here
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center', maxWidth: '500px' }}>
                <Chip
                  icon={<RestaurantMenu />}
                  label="Meal Planning"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 500,
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
                <Chip
                  icon={<Star />}
                  label="Recipe Discovery"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 500,
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
                <Chip
                  icon={<TrendingUp />}
                  label="Calories Tracking"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 500,
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
                <Chip
                  icon={<LocationOn />}
                  label="Find Restaurants"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 500,
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
                <Chip
                  icon={<Create />}
                  label="Become Creator"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 500,
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
                <Chip
                  icon={<People />}
                  label="Creator Network"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 500,
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
              </Box>


            </Box>
          </BrandingContent>
        </Fade>
      </PatternSection>

      <FormSection>
        <Slide direction="left" in={isLoaded} timeout={1000}>
          <RegisterForm onSubmit={handleRegister}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}
              >
                Create Account 🚀
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500
                }}
              >
                Start your culinary journey with us
              </Typography>
            </Box>

            <StyledTextField
              label="Full Name"
              variant="outlined"
              fullWidth
              value={formData.fullName}
              onChange={handleInputChange('fullName')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              required
            />

            <StyledTextField
              label="Email Address"
              variant="outlined"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleInputChange('email')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              required
            />

            <Box>
              <StyledTextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                value={formData.password}
                onChange={handleInputChange('password')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                required
              />
              {formData.password && (
                <Box sx={{ mt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Password Strength: {getPasswordStrengthText()}
                    </Typography>
                    {passwordStrength === 100 && <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />}
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength}
                    color={getPasswordStrengthColor()}
                    sx={{ borderRadius: 1, height: 4 }}
                  />
                </Box>
              )}
            </Box>

            <StyledTextField
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={formData.confirmPassword && formData.password !== formData.confirmPassword}
              helperText={
                formData.confirmPassword && formData.password !== formData.confirmPassword
                  ? "Passwords don't match"
                  : ""
              }
              required
            />

            <GradientButton
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={
                !formData.fullName ||
                !formData.email ||
                !formData.password ||
                formData.password !== formData.confirmPassword ||
                passwordStrength < 50
              }
            >
              Create Account ✨
            </GradientButton>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Already have an account?{' '}
                <Link
                  href="/login"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Sign In →
                </Link>
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </Typography>
            </Box>
          </RegisterForm>
        </Slide>
      </FormSection>

      {/* Mobile Branding Bottom with Sliding Chips */}
      <MobileBrandingBottom>
        <SlidingChipsContainer>
          <Chip
            icon={<RestaurantMenu />}
            label="Meal Planning"
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 500,
              fontSize: '0.7rem',
              '& .MuiChip-icon': { color: 'white', fontSize: '0.9rem' },
              marginRight: 1
            }}
          />
          <Chip
            icon={<Star />}
            label="Recipe Discovery"
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 500,
              fontSize: '0.7rem',
              '& .MuiChip-icon': { color: 'white', fontSize: '0.9rem' },
              marginRight: 1
            }}
          />
          <Chip
            icon={<TrendingUp />}
            label="Calories Tracking"
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 500,
              fontSize: '0.7rem',
              '& .MuiChip-icon': { color: 'white', fontSize: '0.9rem' },
              marginRight: 1
            }}
          />
          <Chip
            icon={<LocationOn />}
            label="Find Restaurants"
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 500,
              fontSize: '0.7rem',
              '& .MuiChip-icon': { color: 'white', fontSize: '0.9rem' },
              marginRight: 1
            }}
          />
          <Chip
            icon={<Create />}
            label="Become Creator"
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 500,
              fontSize: '0.7rem',
              '& .MuiChip-icon': { color: 'white', fontSize: '0.9rem' },
              marginRight: 1
            }}
          />
          <Chip
            icon={<People />}
            label="Creator Network"
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 500,
              fontSize: '0.7rem',
              '& .MuiChip-icon': { color: 'white', fontSize: '0.9rem' },
              marginRight: 1
            }}
          />
          {/* Duplicate chips for seamless loop */}
          <Chip
            icon={<RestaurantMenu />}
            label="Meal Planning"
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 500,
              fontSize: '0.7rem',
              '& .MuiChip-icon': { color: 'white', fontSize: '0.9rem' },
              marginRight: 1
            }}
          />
          <Chip
            icon={<Star />}
            label="Recipe Discovery"
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 500,
              fontSize: '0.7rem',
              '& .MuiChip-icon': { color: 'white', fontSize: '0.9rem' },
              marginRight: 1
            }}
          />
          <Chip
            icon={<TrendingUp />}
            label="Calories Tracking"
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 500,
              fontSize: '0.7rem',
              '& .MuiChip-icon': { color: 'white', fontSize: '0.9rem' },
              marginRight: 1
            }}
          />
        </SlidingChipsContainer>
      </MobileBrandingBottom>

    </BackgroundBox>
  );
};

export default Register;
