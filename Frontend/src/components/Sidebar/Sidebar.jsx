import * as React from 'react';
import { styled, keyframes } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExploreIcon from '@mui/icons-material/Explore';
import ChatIcon from '@mui/icons-material/Chat';
import PostAddIcon from '@mui/icons-material/PostAdd';
import GroupIcon from '@mui/icons-material/Group';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import { useDispatch, useSelector } from 'react-redux';
import { setDrawerOpen } from '../../redux/features/utils/actionSlice';
import { useNavigate } from 'react-router-dom';

// Animation keyframes
const slideInLeft = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const fadeInUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const iconFloat = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
`;

// Styled components
const AnimatedDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    background: 'linear-gradient(180deg, #604CC3 0%, #8B7ED8 50%, #604CC3 100%)',
    boxShadow: '4px 0 20px rgba(96, 76, 195, 0.3)',
    animation: `${slideInLeft} 0.4s ease-out`,
  },
}));

const AnimatedListItemButton = styled(ListItemButton)(({ theme }) => ({
  margin: '4px 8px',
  borderRadius: '12px',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: 'translateX(8px) scale(1.02)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  '&:active': {
    transform: 'translateX(8px) scale(0.98)',
  },
}));

const AnimatedListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: '40px',
  '& .MuiSvgIcon-root': {
    color: '#ffffff',
    fontSize: '1.4rem',
    transition: 'all 0.3s ease-in-out',
  },
  '&:hover .MuiSvgIcon-root': {
    animation: `${iconFloat} 0.6s ease-in-out`,
    color: '#f8f9fa',
  },
}));

const AnimatedListItemText = styled(ListItemText)(({ theme }) => ({
  '& .MuiListItemText-primary': {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease-in-out',
  },
}));

const SidebarHeader = styled(Box)(({ theme }) => ({
  padding: '20px 16px',
  textAlign: 'center',
  borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
  marginBottom: '8px',
}));

const AnimatedDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  margin: '4px 16px',
}));

export default function Sidebar() {
  const Role = localStorage.getItem('role');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { DrawerOpen } = useSelector((state) => state.action);

  const toggleDrawer = (newOpen) => () => {
    dispatch(setDrawerOpen({ DrawerOpen: newOpen }));
  };

  const handleNavigation = (route) => {
    navigate(route);
    dispatch(setDrawerOpen({ DrawerOpen: false }));
  };

  // Define menu items for each role with corresponding icons
  const menuItems = {
    User: [
      { text: "Profile", icon: <AccountCircleIcon /> },
      { text: "Recipe Search", icon: <SearchIcon /> },
      { text: "Meal Planner", icon: <CalendarTodayIcon /> },
      { text: "Dashboard", icon: <DashboardIcon /> },
      { text: "Posts by Creators", icon: <PostAddIcon /> },
      { text: "Explore Nearby", icon: <ExploreIcon /> },
      { text: "Messages", icon: <ChatIcon /> },
    ],
    Creator: [
      { text: "Profile", icon: <AccountCircleIcon /> },
      { text: "Recipe Search", icon: <SearchIcon /> },
      { text: "Meal Planner", icon: <CalendarTodayIcon /> },
      { text: "Dashboard", icon: <DashboardIcon /> },
      { text: "Posts by Creators", icon: <PostAddIcon /> },
      { text: "Explore Nearby", icon: <ExploreIcon /> },
      { text: "Messages", icon: <ChatIcon /> },
      { text: "Make a Post", icon: <PostAddIcon /> },
    ],
    Admin: [
      { text: "Manage Users", icon: <GroupIcon /> },
      { text: "Manage Creators", icon: <GroupIcon /> },
      { text: "Users Requests", icon: <RequestQuoteIcon /> },
      { text: "Creator Requests", icon: <RequestQuoteIcon /> },
      { text: "Messages", icon: <ChatIcon /> },
    ],
  };

  const renderDrawerList = (items) => (
    <Box sx={{ width: 280 }} role="presentation" onClick={toggleDrawer(false)}>
      <SidebarHeader>
        <Typography 
          variant="h5" 
          sx={{ 
            color: '#ffffff',
            fontWeight: 'bold',
            letterSpacing: '1px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}
        >
          FOODIE
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#ffffff', 
            opacity: 0.9,
            fontWeight: '500',
            marginTop: '4px'
          }}
        >
          {Role} Dashboard
        </Typography>
      </SidebarHeader>
      
      <List sx={{ padding: '8px 0' }}>
        {items && items.map(({ text, icon }, index) => (
          <React.Fragment key={text}>
            <ListItem 
              disablePadding 
              sx={{ 
                animation: `${fadeInUp} 0.4s ease-out ${index * 0.1}s both`
              }}
            >
              <AnimatedListItemButton 
                onClick={() => handleNavigation(`/${text.replace(/\s+/g, '').toLowerCase()}`)}
              >
                <AnimatedListItemIcon>
                  {icon}
                </AnimatedListItemIcon>
                <AnimatedListItemText primary={text} />
              </AnimatedListItemButton>
            </ListItem>
            {index < items.length - 1 && <AnimatedDivider />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <AnimatedDrawer 
        open={DrawerOpen} 
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(4px)',
          }
        }}
      >
        {renderDrawerList(menuItems[Role])}
      </AnimatedDrawer>
    </div>
  );
}
