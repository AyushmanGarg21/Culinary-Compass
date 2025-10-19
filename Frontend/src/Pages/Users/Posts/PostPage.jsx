import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Fade, Slide } from '@mui/material';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import SearchIcon from '@mui/icons-material/Search';
import FollowedList from '../../../sections/FollowedList';
import Posts from '../../../sections/posts';
import Search from '../../../components/common/search';
import UserCard from '../../../components/Posts/UserCard';
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "../../../redux/features/Users/usersSlice";
import { fetchPosts } from "../../../redux/features/Posts/postsSlice";
import { fetchFollowedUsers } from "../../../redux/features/FollowedUsers/followedUsersSlice";
import '../../../styles/animations.css';

const PostPage = () => {
  const dispatch = useDispatch();
  const [profileId, setProfileId] = useState(null);

  // Fetch data from Redux store
  const { users, loading: usersLoading } = useSelector((state) => state.users);
  const { loading: postsLoading } = useSelector((state) => state.posts);
  const { loading: followedLoading } = useSelector((state) => state.followedUsers);

  const isLoading = usersLoading || postsLoading || followedLoading;

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchPosts());
    dispatch(fetchFollowedUsers());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-3">
            <CircularProgress size={24} className="text-blue-600" />
            <span className="text-gray-700 font-medium">Loading content...</span>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4 px-4 py-6 max-w-7xl mx-auto">
        {/* Posts Section - Always First on Mobile */}
        <Fade in={!isLoading} timeout={800}>
          <Box className="order-1 lg:order-2 flex-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 overflow-hidden">
              <Posts />
            </div>
          </Box>
        </Fade>

        {/* Right Sidebar - Following and Discover */}
        <div className="order-2 lg:order-3 w-full lg:w-80 space-y-4">
          {/* Followed Users Section */}
          <Slide direction="left" in={!isLoading} timeout={1000}>
            <Box className="w-full">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 overflow-hidden">
                <FollowedList />
              </div>
            </Box>
          </Slide>

          {/* Discover Section - Smaller on tablet/desktop, below following on mobile */}
          <Slide direction="right" in={!isLoading} timeout={600}>
            <Box className="w-full md:block">
              {/* Search Card */}
              <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-2 mb-3 md:mb-4">
                  <SearchIcon className="text-blue-600" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-800">Discover Creators</h3>
                </div>

                <Search
                  list={users}
                  setId={setProfileId}
                  componentName="posts"
                />

                {profileId && (
                  <Fade in={true} timeout={300}>
                    <Button
                      variant="outlined"
                      onClick={() => setProfileId(null)}
                      className="w-full mt-3 md:mt-4 text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200 rounded-xl"
                      startIcon={<CancelRoundedIcon />}
                      size="small"
                    >
                      Clear Selection
                    </Button>
                  </Fade>
                )}
              </div>

              {/* User Profile Card */}
              {profileId && (
                <Fade in={true} timeout={500}>
                  <div className="mt-4 transform hover:scale-105 transition-transform duration-300">
                    <UserCard id={profileId} />
                  </div>
                </Fade>
              )}
            </Box>
          </Slide>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
