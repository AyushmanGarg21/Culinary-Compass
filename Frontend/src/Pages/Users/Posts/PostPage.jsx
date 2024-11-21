import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import FollowedList from '../../../sections/FollowedList';
import Posts from '../../../sections/posts';
import Search from '../../../components/common/search';
import UserCard from '../../../components/Posts/UserCard';
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "../../../redux/features/Users/usersSlice";

const PostPage = () => {
  const dispatch = useDispatch();
  const [profileId, setProfileId] = useState(null);

  // Fetch user data from Redux store
  const { users, loading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="flex flex-col md:flex-row justify-between gap-6 px-4 py-6">
      {/* Search Section */}
      <Box className="order-1 md:order-none w-full md:w-80 p-4 bg-gray-50 rounded-b-lg md:rounded-t-lg shadow-md">
        <Search
          list={users}
          setId={setProfileId}
          componentName="posts"
        />
        {profileId && (
          <Button
            variant="outlined"
            onClick={() => setProfileId(null)}
            className="flex items-center justify-center text-red-600 mt-2 hover:bg-red-50 transition duration-200 ease-in"
          >
            <CancelRoundedIcon />
            <span className="ml-2">Cancel</span>
          </Button>
        )}
        <Box className="flex justify-center mt-4">
          {profileId && (
            <UserCard id={profileId} />
          )}
        </Box>
      </Box>

      {/* Posts Section */}
      <Box className="order-2 md:order-none w-full md:flex-1 p-4 bg-gray-100 rounded-lg shadow-md">
        <Posts />
      </Box>

      {/* Followed List Section */}
      <Box className="order-3 md:order-none w-full md:w-80 p-4 bg-gray-100 rounded-lg shadow-md">
        <FollowedList />
      </Box>
    </div>
  );
};

export default PostPage;
