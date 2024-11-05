import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
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
    ],
  };

  const renderDrawerList = (items) => (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {items && items.map(({ text, icon }) => (
          <React.Fragment key={text}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigation(`/${text.replace(/\s+/g, '').toLowerCase()}`)}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <Drawer open={DrawerOpen} onClose={toggleDrawer(false)}>
        {renderDrawerList(menuItems[Role])}
      </Drawer>
    </div>
  );
}
