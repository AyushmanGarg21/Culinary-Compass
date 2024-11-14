import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
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
    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
      <IconButton size="large" aria-label="show 4 new mails" onClick={handleMailClick}>
        <Badge badgeContent={4} color="error">
          <MailIcon />
        </Badge>
        <Typography variant="body2" sx={{ marginLeft: 1, color: 'grey.600' }}>Messages</Typography>
      </IconButton>

      <IconButton size="large" aria-label="show 17 new notifications" onClick={handleNotificationsClick}>
        <Badge badgeContent={17} color="error">
          <NotificationsIcon />
        </Badge>
        <Typography variant="body2" sx={{ marginLeft: 1, color: 'grey.600' }}>Notifications</Typography>
      </IconButton>

      <IconButton size="large" onClick={handleLogoutClick}>
        <LogoutIcon />
        <Typography variant="body2" sx={{ marginLeft: 0.3, color: 'grey.600' }}>Logout</Typography>
      </IconButton>
      
    </Box>
  );

  const renderIconMenu = (
    <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
      <IconButton size="large" aria-label="show 4 new mails" onClick={handleMailClick}>
        <Badge badgeContent={4} color="error">
          <MailIcon />
        </Badge>
      </IconButton>
      <IconButton size="large" aria-label="show 17 new notifications" onClick={handleNotificationsClick}>
        <Badge badgeContent={17} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <IconButton size="large" onClick={handleLogoutClick} aria-label="logout">
        <LogoutIcon />
      </IconButton>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: 3 }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={handleMenuClick}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ color: 'black' }}
          >
            LOGO
          </Typography>
          
          <Box sx={{ flexGrow: 1 }} />
          {renderFullMenu}
          {renderIconMenu}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
