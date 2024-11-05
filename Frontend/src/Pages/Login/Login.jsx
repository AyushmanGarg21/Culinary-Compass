import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Link , styled } from '@mui/material';
// import { setLoginData } from '../../redux/features/auth/authSlice';
import { useDispatch } from 'react-redux';

const BackgroundBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
}));

const PatternSection = styled(Box)(({ theme }) => ({
  width: '100%',
  backgroundImage: 'linear-gradient(135deg, #D4F6FF 25%, #B0E1FF 50%, #84CDFF 75%)',
  display: 'none',
  [theme.breakpoints.up('md')]: {
    display: 'block',
    width: '60%',
  },
}));

const FormSection = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#FBFBFB',
  padding: theme.spacing(4),
  [theme.breakpoints.up('md')]: {
    width: '40%',
  },
}));

const LoginForm = styled('form')(({ theme }) => ({
  width: '100%',
  maxWidth: '400px',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add login logic here
    localStorage.setItem('isLogin', true);
    localStorage.setItem('role', password);
    localStorage.setItem('accessToken', '1234567890');
    navigate('/');
  };

  return (
    <BackgroundBox>
      <PatternSection />

      <FormSection>
        <LoginForm onSubmit={handleSubmit}>
          <Typography variant="h5" align="center" gutterBottom>
            Sign In
          </Typography>

          <TextField
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>

          <Box display="flex" justifyContent="space-between" mt={2}>
            <Link href="#" variant="body2">
              Forgot Password?
            </Link>
            <Link href="/register" variant="body2">
              Register
            </Link>
          </Box>
        </LoginForm>
      </FormSection>
    </BackgroundBox>
  );
};

export default Login;
