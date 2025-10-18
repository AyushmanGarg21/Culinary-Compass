import * as React from 'react';
import { styled, alpha, keyframes } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useDispatch, useSelector } from 'react-redux';
import { setDrawerOpen } from '../../redux/features/utils/actionSlice';
import { useNavigate } from 'react-router-dom';

// Animation keyframes
const slideIn = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const shake = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-2px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(2px);
  }
`;

// Styled components
const AnimatedAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #604CC3 0%, #8B7ED8 50%, #604CC3 100%)',
  animation: `${slideIn} 0.6s ease-out`,
  boxShadow: '0 4px 20px rgba(96, 76, 195, 0.3)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 6px 25px rgba(96, 76, 195, 0.4)',
  },
}));

const AnimatedIconButton = styled(IconButton)(({ theme }) => ({
  transition: 'all 0.3s ease-in-out',
  borderRadius: '12px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: 'translateY(-2px)',
    animation: `${pulse} 0.6s ease-in-out`,
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
}));

const AnimatedBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
    boxShadow: '0 2px 8px rgba(255, 107, 107, 0.4)',
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #ffffff, #f8f9fa)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 'bold',
  fontSize: '1.5rem',
  letterSpacing: '2px',
  transition: 'all 0.3s ease-in-out',
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'scale(1.05)',
    cursor: 'pointer',
  },
}));

export default function Header() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMenuClick = () => {
    dispatch(setDrawerOpen({ DrawerOpen: true }));
  };

  const handleMailClick = () => {
    console.log("Mail Clicked");
    navigate('/messages');
  };

  const handleNotificationsClick = () => {
    console.log("Notifications Clicked");
  };

  const handleLogoutClick = () => {

    localStorage.removeItem('isLogin');
    localStorage.removeItem('role');
    localStorage.removeItem('accessToken');
    window.location.reload();
  };

  const renderFullMenu = (
    <Box sx={{
      display: { xs: 'none', md: 'flex' },
      alignItems: 'center',
      gap: 1
    }}>
      <AnimatedIconButton size="large" aria-label="show 4 new mails" onClick={handleMailClick}>
        <AnimatedBadge badgeContent={4} color="error">
          <MailIcon sx={{ color: '#ffffff' }} />
        </AnimatedBadge>
        <Typography
          variant="body2"
          sx={{
            marginLeft: 1,
            color: '#ffffff',
            fontWeight: 'medium',
            transition: 'color 0.3s ease'
          }}
        >
          Messages
        </Typography>
      </AnimatedIconButton>

      <AnimatedIconButton size="large" aria-label="show 17 new notifications" onClick={handleNotificationsClick}>
        <AnimatedBadge badgeContent={17} color="error">
          <NotificationsIcon sx={{ color: '#ffffff' }} />
        </AnimatedBadge>
        <Typography
          variant="body2"
          sx={{
            marginLeft: 1,
            color: '#ffffff',
            fontWeight: 'medium',
            transition: 'color 0.3s ease'
          }}
        >
          Notifications
        </Typography>
      </AnimatedIconButton>

      <AnimatedIconButton size="large" onClick={handleLogoutClick}>
        <LogoutIcon sx={{ color: '#ffffff' }} />
        <Typography
          variant="body2"
          sx={{
            marginLeft: 0.3,
            color: '#ffffff',
            fontWeight: 'medium',
            transition: 'color 0.3s ease'
          }}
        >
          Logout
        </Typography>
      </AnimatedIconButton>

    </Box>
  );

  const renderIconMenu = (
    <Box sx={{
      display: { xs: 'flex', md: 'none' },
      alignItems: 'center',
      gap: 0.5
    }}>
      <AnimatedIconButton size="large" aria-label="show 4 new mails" onClick={handleMailClick}>
        <AnimatedBadge badgeContent={4} color="error">
          <MailIcon sx={{ color: '#ffffff' }} />
        </AnimatedBadge>
      </AnimatedIconButton>
      <AnimatedIconButton size="large" aria-label="show 17 new notifications" onClick={handleNotificationsClick}>
        <AnimatedBadge badgeContent={17} color="error">
          <NotificationsIcon sx={{ color: '#ffffff' }} />
        </AnimatedBadge>
      </AnimatedIconButton>
      <AnimatedIconButton size="large" onClick={handleLogoutClick} aria-label="logout">
        <LogoutIcon sx={{ color: '#ffffff' }} />
      </AnimatedIconButton>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AnimatedAppBar position="static">
        <Toolbar sx={{ minHeight: '70px' }}>
          <AnimatedIconButton
            size="large"
            edge="start"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={handleMenuClick}
          >
            <MenuIcon sx={{ color: '#ffffff', fontSize: '1.8rem' }} />
          </AnimatedIconButton>

          <LogoText
            variant="h6"
            noWrap
            component="div"
          >
            FOODIE
          </LogoText>

          <Box sx={{ flexGrow: 1 }} />
          {renderFullMenu}
          {renderIconMenu}
        </Toolbar>
      </AnimatedAppBar>
    </Box>
  );
}
