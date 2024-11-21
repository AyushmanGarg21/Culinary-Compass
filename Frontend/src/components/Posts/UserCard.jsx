import React from "react";
import { useSelector } from "react-redux";
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';

const UserCard = ({ id }) => {
  // Fetch user data from Redux store
  const user = useSelector((state) =>
    state.users.users.find((user) => user.id === id)
  );

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div
      className="w-full max-w-xs bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
      style={{ maxHeight: "300px" }}
    >
      {/* Profile Image */}
      <div className="relative">
        <img
          src={user.profileImage || "https://via.placeholder.com/100"}
          alt={`${user.name}'s profile`}
          className="w-full h-32 object-cover"
        />
      </div>

      {/* User Details */}
      <div className="p-4 overflow-y-auto custom-scrollbar" style={{ maxHeight: "200px" }}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-gray-800">{user.name}</h2>
            <button className="bg-blue-50 text-blue-600 p-1 rounded-full shadow-sm ml-4">
                <PersonAddAlt1RoundedIcon fontSize="small" />
            </button>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          {user.aboutMe || "No information available."}
        </p>

        <div className="text-sm text-gray-700">
          <p className="mb-1">
            <strong>Country:</strong> {user.country || "N/A"}
          </p>
          <p className="mb-1">
            <strong>Food Preference:</strong> {user.foodPreference || "N/A"}
          </p>
          <p className="mb-1">
            <strong>Gender:</strong> {user.gender || "N/A"}
          </p>
          <p className="mb-1">
            <strong>Age:</strong> {user.age || "N/A"}
          </p>
          <p className="mb-1">
            <strong>Language:</strong> {user.language || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
