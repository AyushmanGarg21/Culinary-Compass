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
  Chip
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  RestaurantMenu,
  Star,
  TrendingUp,
  LocationOn,
  Create,
  People,
  FitnessCenter
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';

const BackgroundBox = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
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
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
    `,
  },
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
  background: 'linear-gradient(145deg, #f0f2f5 0%, #ffffff 100%)',
  padding: theme.spacing(3, 2),
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    width: '40%',
    height: '100%',
    padding: theme.spacing(4),
  },
}));

const LoginForm = styled('form')(({ theme }) => ({
  width: '100%',
  maxWidth: '400px',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  padding: theme.spacing(4),
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderRadius: '24px',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    },
    '&.Mui-focused': {
      backgroundColor: 'white',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.25)',
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
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 35px rgba(102, 126, 234, 0.5)',
  },
  '&:active': {
    transform: 'translateY(-1px)',
  },
}));

const FloatingElement = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
  animation: 'float 6s ease-in-out infinite',
  '@keyframes float': {
    '0%, 100%': {
      transform: 'translateY(0px) rotate(0deg)',
    },
    '50%': {
      transform: 'translateY(-20px) rotate(180deg)',
    },
  },
}));

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add login logic here
    localStorage.setItem('isLogin', true);
    localStorage.setItem('role', password);
    localStorage.setItem('accessToken', '1234567890');
    if (password === 'Admin') {
            navigate('/manageusers'); // Redirect Admin to manage users page
    } else {
      navigate('/dashboard'); // Redirect User/Creator to dashboard
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
            width: 80,
            height: 80,
            top: '10%',
            left: '10%',
            animationDelay: '0s'
          }}
        />
        <FloatingElement
          sx={{
            width: 120,
            height: 120,
            top: '60%',
            right: '15%',
            animationDelay: '2s'
          }}
        />
        <FloatingElement
          sx={{
            width: 60,
            height: 60,
            bottom: '20%',
            left: '20%',
            animationDelay: '4s'
          }}
        />

        <Fade in={isLoaded} timeout={1000}>
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
                  label="Recipe Posting"
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
                  label="Creator Community"
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
        <Slide direction="left" in={isLoaded} timeout={800}>
          <LoginForm onSubmit={handleSubmit}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}
              >
                Welcome Back! 👋
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500
                }}
              >
                Sign in to continue your culinary journey
              </Typography>
            </Box>

            <StyledTextField
              label="Email Address"
              variant="outlined"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              required
            />

            <StyledTextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
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

            <GradientButton
              type="submit"
              variant="contained"
              fullWidth
              size="large"
            >
              Sign In ✨
            </GradientButton>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 2
              }}
            >
              <Link
                href="#"
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline'
                  }
                }}
              >
                Forgot Password?
              </Link>
              <Link
                href="/register"
                variant="body2"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Create Account →
              </Link>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                By signing in, you agree to our Terms of Service and Privacy Policy
              </Typography>
            </Box>
          </LoginForm>
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
            label="Recipe Posting"
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
            label="Creator Community"
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

export default Login;
