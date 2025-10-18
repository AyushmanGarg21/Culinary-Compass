// Profile.jsx
import React, { useState, useRef } from 'react';
import {
  Button,
  Avatar,
  Typography,
  Tooltip,
  Fade,
  Slide,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Edit as EditIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
  Star as StarIcon,
  Person as PersonIcon,
  CameraAlt as CameraIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import ProfileInfo from './ProfileInfo';
import CreatorFormModal from '../../../components/CreatorFormModal';

const Profile = () => {
  const role = localStorage.getItem('role');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showProfileUpdateMessage, setShowProfileUpdateMessage] = useState(false);
  const fileInputRef = useRef(null);
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
    username: 'User123',
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
    setShowProfileUpdateMessage(true);

    // In real implementation, you would call your API here:
    // updateProfile(profileData).then(() => {
    //   setIsEditing(false);
    //   setShowProfileUpdateMessage(true);
    // }).catch(() => {
    //   // Handle error
    // });
  };

  // Handle profile image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);

      const reader = new FileReader();
      reader.onload = (e) => {
        // Simulate API call delay
        setTimeout(() => {
          setProfileImage(e.target.result);
          setIsUploading(false);
          setShowSuccessMessage(true);

          // In real implementation, you would call your API here:
          // uploadProfileImage(file).then(() => {
          //   setProfileImage(e.target.result);
          //   setIsUploading(false);
          //   setShowSuccessMessage(true);
          // }).catch(() => {
          //   setIsUploading(false);
          //   // Handle error
          // });
        }, 2000); // 2 second delay to simulate upload
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  const handleCloseProfileUpdateMessage = () => {
    setShowProfileUpdateMessage(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-6 w-full min-h-[95vh] bg-gradient-to-br from-blue-50 to-indigo-100 relative">

      {/* Profile Header with Animation */}
      <Fade in={true} timeout={800}>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            {/* Upload Progress Ring */}
            {isUploading && (
              <CircularProgress
                size={140}
                thickness={3}
                sx={{
                  position: 'absolute',
                  top: -10,
                  left: -10,
                  color: '#4caf50',
                  zIndex: 1
                }}
              />
            )}

            <Avatar
              src={profileImage}
              onClick={!isUploading ? handleAvatarClick : undefined}
              sx={{
                width: 120,
                height: 120,
                bgcolor: 'primary.main',
                fontSize: '3rem',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease-in-out',
                cursor: isUploading ? 'default' : 'pointer',
                opacity: isUploading ? 0.7 : 1,
                '&:hover': !isUploading ? {
                  transform: 'scale(1.05)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                } : {}
              }}
            >
              {!profileImage && <PersonIcon fontSize="large" />}
            </Avatar>

            {/* Camera Icon */}
            <div
              className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 shadow-lg cursor-pointer hover:bg-blue-600 transition-colors"
              onClick={!isUploading ? handleAvatarClick : undefined}
              style={{
                opacity: isUploading ? 0.7 : 1,
                cursor: isUploading ? 'default' : 'pointer'
              }}
            >
              <CameraIcon sx={{ color: 'white', fontSize: '1.2rem' }} />
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />

          <div className="text-center">
            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: 700,
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
                mb: 1
              }}
            >
              {profileData.name} <span style={{
                fontSize: '0.7em',
                fontWeight: 500,
                color: '#666',
                background: 'none',
                WebkitTextFillColor: '#666'
              }}>({role})</span>
            </Typography>
          </div>
        </div>
      </Fade>

      {/* Action Buttons */}
      <Slide direction="up" in={true} timeout={600}>
        <div className="flex w-full max-w-[80%] gap-4 justify-between items-center">
          <Tooltip title={role === 'Creator' ? 'You are already a creator!' : 'Apply to become a content creator'}>
            <span>
              <Button
                disabled={role === 'Creator'}
                variant="contained"
                color="secondary"
                onClick={handleModalOpen}
                startIcon={<StarIcon />}
                sx={{
                  borderRadius: '25px',
                  px: 3,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: '1rem',
                  boxShadow: '0 4px 20px rgba(156, 39, 176, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 25px rgba(156, 39, 176, 0.4)'
                  },
                  '&:disabled': {
                    opacity: 0.6
                  }
                }}
              >
                Become a Creator
              </Button>
            </span>
          </Tooltip>

          <Tooltip title={isEditing ? 'Cancel editing' : 'Edit your profile'}>
            <Button
              variant={isEditing ? "outlined" : "contained"}
              color="primary"
              onClick={toggleEdit}
              startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
              sx={{
                borderRadius: '25px',
                px: 3,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '1rem',
                boxShadow: isEditing ? 'none' : '0 4px 20px rgba(25, 118, 210, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: isEditing ? '0 2px 10px rgba(25, 118, 210, 0.2)' : '0 6px 25px rgba(25, 118, 210, 0.4)'
                }
              }}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </Tooltip>
        </div>
      </Slide>

      {/* Profile Information */}
      <Fade in={true} timeout={1000}>
        <div className="w-full max-w-[80%]">
          <ProfileInfo
            profileData={profileData}
            isEditing={isEditing}
            setProfileData={setProfileData}
          />
        </div>
      </Fade>

      {/* Update Button with Animation */}
      {isEditing && (
        <Slide direction="up" in={isEditing} timeout={400}>
          <Tooltip title="Save your changes">
            <Button
              variant="contained"
              color="success"
              onClick={handleUpdate}
              startIcon={<SaveIcon />}
              sx={{
                borderRadius: '25px',
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '1.1rem',
                boxShadow: '0 4px 20px rgba(46, 125, 50, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 25px rgba(46, 125, 50, 0.4)'
                }
              }}
            >
              Save Changes
            </Button>
          </Tooltip>
        </Slide>
      )}

      <CreatorFormModal open={isModalOpen} handleClose={handleModalClose} />

      {/* Profile Picture Success Message */}
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={4000}
        onClose={handleCloseSuccessMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSuccessMessage}
          severity="success"
          variant="filled"
          icon={<CheckIcon />}
          sx={{
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 500
          }}
        >
          Profile picture updated successfully!
        </Alert>
      </Snackbar>

      {/* Profile Update Success Message */}
      <Snackbar
        open={showProfileUpdateMessage}
        autoHideDuration={4000}
        onClose={handleCloseProfileUpdateMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseProfileUpdateMessage}
          severity="success"
          variant="filled"
          icon={<CheckIcon />}
          sx={{
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 500
          }}
        >
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Profile;
