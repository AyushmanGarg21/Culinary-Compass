// ManageCard.jsx
import React from 'react';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { deleteUser, deactivateUser, removeFromCreator } from '../../redux/features/Admin/manageSlice';

const ManageCard = ({ id, name, phone, email, role }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteUser(id));
  };

  const handleDeactivate = () => {
    dispatch(deactivateUser(id));
  };

  const handleRemoveFromCreator = () => {
    dispatch(removeFromCreator(id));
  };

  return (
    <div className="w-full h-64 p-8 bg-white shadow-lg rounded-lg flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold">{name}</h2>
        <p>Phone: {phone}</p>
        <p>Email: {email}</p>
      </div>
      <div className="flex gap-4">
      {role === 'user' && (
        <Button variant="contained" color="error" onClick={handleDelete} fullWidth>
          Delete
        </Button>
         )}
        <Button variant="contained" color="warning" onClick={handleDeactivate} fullWidth>
          Deactivate
        </Button>
        {role === 'creator' && (
          <Button variant="contained" color="secondary" onClick={handleRemoveFromCreator} fullWidth>
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};

export default ManageCard;
