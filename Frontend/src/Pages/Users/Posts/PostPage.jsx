import { Box } from '@mui/material';
import FollowedList from '../../../sections/FollowedList';
import Posts from '../../../sections/posts';

const PostPage = () => {
  return (
    <div className="flex flex-col md:flex-row">
      {/* Posts Section */}
      <Box className="order-1 md:order-none m-8 flex-1">
        <Posts />
      </Box>
      
      {/* Followed List Section */}
      <Box className="order-2 md:order-none m-8 flex-1 md:max-w-xs">
        <FollowedList />
      </Box>
    </div>
  );
};

export default PostPage;
