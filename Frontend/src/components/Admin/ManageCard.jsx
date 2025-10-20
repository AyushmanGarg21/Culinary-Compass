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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-200 hover:border-slate-300">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-800 font-inter truncate">{name}</h3>
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
            role === 'creator' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-purple-100 text-purple-700'
          }`}>
            {role === 'creator' ? 'Creator' : 'User'}
          </span>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-slate-600">
            <span className="font-medium text-slate-700">Phone:</span> {phone}
          </p>
          <p className="text-sm text-slate-600 truncate">
            <span className="font-medium text-slate-700">Email:</span> {email}
          </p>
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        {role === 'user' && (
          <Button 
            variant="contained" 
            onClick={handleDelete} 
            fullWidth
            sx={{
              backgroundColor: '#ef4444',
              '&:hover': { backgroundColor: '#dc2626' },
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: '600',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '0.875rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            Delete User
          </Button>
        )}
        
        <Button 
          variant="contained" 
          onClick={handleDeactivate} 
          fullWidth
          sx={{
            backgroundColor: '#f59e0b',
            '&:hover': { backgroundColor: '#d97706' },
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: '600',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '0.875rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          Deactivate
        </Button>
        
        {role === 'creator' && (
          <Button 
            variant="contained" 
            onClick={handleRemoveFromCreator} 
            fullWidth
            sx={{
              backgroundColor: '#8b5cf6',
              '&:hover': { backgroundColor: '#7c3aed' },
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: '600',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '0.875rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            Remove Creator
          </Button>
        )}
      </div>
    </div>
  );
};

export default ManageCard;
