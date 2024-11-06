// Profile.jsx
import React, { useState } from 'react';
import { Button, Avatar, TextField, Modal, Box, Typography } from '@mui/material';
import ProfileInfo from './ProfileInfo';
import CreatorFormModal from '../../../components/CreatorFormModal';

const Profile = () => {
  const role = localStorage.getItem('role');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Dummy Name',
    email: 'dummy@example.com',
    phone: '123-456-7890',
    country: '',
    language: 'English',
    foodPreference: 'Vegetarian',
    age: '25',
    weight: '70',
    height: '175',
    gender: '',
    dateOfBirth: '',
    city: '',
    password: '',
    aboutMe: '',
  });

  // Toggle modal visibility
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  // Handle edit toggle
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Handle update data
  const handleUpdate = () => {
    // Fake API call
    console.log('Updating data...', profileData);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-4 w-full h-[95vh] bg-gray-100 relative">
      
      <Typography variant="subtitle">{role}</Typography>


      {/* Action Buttons */}
      <div className="flex w-full max-w-[80%]">
        <Button 
        className='flex-2'
        disabled={role === 'Creator'}
        variant="outlined" color="secondary" onClick={handleModalOpen}>
          Become a Creator
        </Button>
        {/* Edit Button */}
        <div className='flex-1' ></div>
        <Button
            variant="outlined"
            color="primary"
            onClick={toggleEdit}
            className='flex-2'
        >
            {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>

      <ProfileInfo 
        profileData={profileData} 
        isEditing={isEditing} 
        setProfileData={setProfileData} 
      />
      {isEditing && (
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Update
          </Button>
        )}

      <CreatorFormModal open={isModalOpen} handleClose={handleModalClose} />
    </div>
  );
};

export default Profile;
