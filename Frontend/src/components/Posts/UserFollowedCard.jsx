import { Typography, Button, Link } from '@mui/material';
import PersonRemoveRoundedIcon from '@mui/icons-material/PersonRemoveRounded';

const UserFollowedCard = ({ user }) => {
  return (
    <div className="flex items-center p-4 bg-white shadow-lg rounded-lg border border-gray-200 w-full max-w-xs">
      <img
        src={user.image}
        alt="avatar"
        className="w-10 h-10 rounded-full border border-gray-300"
        style={{ width: '42px', height: '42px' }}
      />
      <div className="flex flex-col ml-4 flex-grow min-w-0">
        <Link href={`/profile/${user.username}`} color="inherit" className="min-w-[80px]">
          <Typography variant="subtitle2" className="text-gray-800 truncate">
            {user.username}
          </Typography>
        </Link>
        <Typography variant="body2" className="text-gray-500 min-w-[80px] truncate">
          {user.foodpreference}
        </Typography>
      </div>
      <button className="bg-blue-50 text-blue-600 p-1 rounded-full shadow-sm ml-4">
        <PersonRemoveRoundedIcon fontSize="small" />
      </button>
    </div>
  );
};

export default UserFollowedCard;
