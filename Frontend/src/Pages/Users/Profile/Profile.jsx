// Profile.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Avatar,
  Typography,
  Tooltip,
  Fade,
  Slide,
  CircularProgress,
  Alert,
  Snackbar,
  TextField,
  Paper
} from '@mui/material';
import {
  Edit as EditIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
  Star as StarIcon,
  Person as PersonIcon,
  CameraAlt as CameraIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import ProfileInfo from './ProfileInfo';
import CreatorFormModal from '../../../components/CreatorFormModal';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import {
  fetchProfile,
  updateProfile,
  uploadProfilePicture,
  clearMessages,
} from '../../../redux/features/Users/profileSlice';
import { fetchCitiesByCountry } from '../../../redux/features/utils/masterSlice';

// Map API field names → local profileData keys
const apiToForm = (user) => ({
  name: user.name || user.full_name || '',
  email: user.email || '',
  phone: user.phone_no || user.phone || '',
  countryId: user.country_id || '',
  country: user.country || '',
  language: user.language || '',
  gender: user.gender || '',
  age: user.age != null ? String(user.age) : '',
  weight: user.weight != null ? String(user.weight) : '',
  height: user.height != null ? String(user.height) : '',
  cityId: user.city_id || '',
  city: user.city || '',
  aboutMe: user.about_me || '',
  foodPreference: user.food_preference || '',
});

// Map local profileData keys → API payload (exact schema)
const formToApi = (form) => {
  const payload = {
    name: form.name || undefined,
    phone_no: form.phone || undefined,
    country_id: form.countryId ? Number(form.countryId) : undefined,
    city_id: form.cityId ? Number(form.cityId) : undefined,
    gender: form.gender || undefined,
    language: form.language || undefined,
    age: form.age ? Number(form.age) : undefined,
    height: form.height ? Number(form.height) : undefined,
    weight: form.weight ? Number(form.weight) : undefined,
    about_me: form.aboutMe || undefined,
    food_preference: form.foodPreference || undefined,
  };
  // Remove undefined keys
  return Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined));
};

const Profile = () => {
  const dispatch = useDispatch();
  const { data: user, loading, saving, uploadingPicture, error, saveError, successMessage } =
    useSelector((state) => state.profile);

  const role = localStorage.getItem('role');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    countryId: '',
    country: '',
    language: '',
    gender: '',
    age: '',
    weight: '',
    height: '',
    cityId: '',
    city: '',
    aboutMe: '',
    foodPreference: '',
  });

  // Load profile on mount
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Populate form when API data arrives; also pre-fetch cities for the saved country
  useEffect(() => {
    if (user) {
      const formData = apiToForm(user);
      setProfileData(formData);
      if (formData.countryId) {
        dispatch(fetchCitiesByCountry(formData.countryId));
      }
    }
  }, [user, dispatch]);

  // Auto-clear messages after snackbar closes
  const handleCloseSnackbar = () => {
    dispatch(clearMessages());
  };

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const toggleEdit = () => {
    if (isEditing && user) {
      // Cancel — reset to server data
      setProfileData(apiToForm(user));
    }
    setIsEditing((prev) => !prev);
  };

  const handleUpdate = async () => {
    const result = await dispatch(updateProfile(formToApi(profileData)));
    if (!result.error) {
      setIsEditing(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      dispatch(uploadProfilePicture(file));
    }
  };

  const handleAvatarClick = () => {
    if (!uploadingPicture) fileInputRef.current?.click();
  };

  if (loading && !user) {
    return <LoadingSpinner />;
  }

  const profilePicSrc = user?.profile_picture || user?.profilePic || null;

  return (
    <div className="p-3 sm:p-6 w-full min-h-[95vh] bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Action Buttons at Top */}
      <Slide direction="down" in={true} timeout={600}>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end items-stretch sm:items-center mb-4 sm:mb-6">
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
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1, sm: 1.5 },
                  textTransform: 'none',
                  fontWeight: 600,
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  boxShadow: '0 4px 20px rgba(156, 39, 176, 0.3)',
                  transition: 'all 0.3s ease',
                  width: { xs: '100%', sm: 'auto' },
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 25px rgba(156, 39, 176, 0.4)' },
                  '&:disabled': { opacity: 0.6 }
                }}
              >
                Become a Creator
              </Button>
            </span>
          </Tooltip>

          <Tooltip title={isEditing ? 'Cancel editing' : 'Edit your profile'}>
            <Button
              variant={isEditing ? 'outlined' : 'contained'}
              color="primary"
              onClick={toggleEdit}
              startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
              sx={{
                borderRadius: '25px',
                px: { xs: 2, sm: 3 },
                py: { xs: 1, sm: 1.5 },
                textTransform: 'none',
                fontWeight: 600,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                boxShadow: isEditing ? 'none' : '0 4px 20px rgba(25, 118, 210, 0.3)',
                transition: 'all 0.3s ease',
                width: { xs: '100%', sm: 'auto' },
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: isEditing ? '0 2px 10px rgba(25, 118, 210, 0.2)' : '0 6px 25px rgba(25, 118, 210, 0.4)'
                }
              }}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </Tooltip>

          {isEditing && (
            <Tooltip title="Save your changes">
              <Button
                variant="contained"
                color="success"
                onClick={handleUpdate}
                disabled={saving}
                startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                sx={{
                  borderRadius: '25px',
                  px: { xs: 2, sm: 4 },
                  py: { xs: 1, sm: 1.5 },
                  textTransform: 'none',
                  fontWeight: 600,
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  boxShadow: '0 4px 20px rgba(46, 125, 50, 0.3)',
                  transition: 'all 0.3s ease',
                  width: { xs: '100%', sm: 'auto' },
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 25px rgba(46, 125, 50, 0.4)' }
                }}
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </Button>
            </Tooltip>
          )}
        </div>
      </Slide>

      {/* API error banner */}
      {(error || saveError) && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={handleCloseSnackbar}>
          {error || saveError}
        </Alert>
      )}

      {/* Main Profile Content */}
      <Fade in={true} timeout={800}>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Left Side - Profile Picture and About Me */}
          <div className="flex flex-col space-y-4 lg:space-y-6 w-full lg:w-80">
            {/* Profile Picture */}
            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
              }}
            >
              <div className="relative">
                {uploadingPicture && (
                  <CircularProgress
                    size={140}
                    thickness={3}
                    sx={{ position: 'absolute', top: -10, left: -10, color: '#4caf50', zIndex: 1 }}
                  />
                )}

                <Avatar
                  src={profilePicSrc}
                  onClick={handleAvatarClick}
                  sx={{
                    width: { xs: 100, sm: 120 },
                    height: { xs: 100, sm: 120 },
                    bgcolor: 'primary.main',
                    fontSize: { xs: '2.5rem', sm: '3rem' },
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease-in-out',
                    cursor: uploadingPicture ? 'default' : 'pointer',
                    opacity: uploadingPicture ? 0.7 : 1,
                    '&:hover': !uploadingPicture ? {
                      transform: 'scale(1.05)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                    } : {}
                  }}
                >
                  {!profilePicSrc && <PersonIcon fontSize="large" />}
                </Avatar>

                <div
                  className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 shadow-lg cursor-pointer hover:bg-blue-600 transition-colors"
                  onClick={handleAvatarClick}
                  style={{ opacity: uploadingPicture ? 0.7 : 1, cursor: uploadingPicture ? 'default' : 'pointer' }}
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
                {isEditing ? (
                  <TextField
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                        fontWeight: 700,
                        textAlign: 'center',
                        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                      }
                    }}
                  />
                ) : (
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                      fontWeight: 700,
                      background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      letterSpacing: '-0.02em',
                      mb: 1,
                      fontSize: { xs: '1.5rem', sm: '2.125rem' },
                      textAlign: 'center'
                    }}
                  >
                    {profileData.name || 'Your Name'}
                  </Typography>
                )}
                <Typography
                  variant="subtitle1"
                  sx={{ color: '#666', fontWeight: 500, fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif' }}
                >
                  ({role})
                </Typography>
              </div>
            </Paper>

            {/* About Me Section */}
            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <InfoIcon sx={{ color: 'primary.main' }} />
                <Typography
                  variant="h6"
                  sx={{ fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif', fontWeight: 600, color: '#333' }}
                >
                  About Me
                </Typography>
              </div>

              <TextField
                value={profileData.aboutMe}
                onChange={(e) => setProfileData({ ...profileData, aboutMe: e.target.value })}
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                placeholder="Share something interesting about yourself..."
                InputProps={{
                  readOnly: !isEditing,
                  sx: {
                    backgroundColor: isEditing ? 'white' : '#f8f9fa',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    '&:hover': { backgroundColor: isEditing ? '#ffffff' : '#f0f2f5' },
                    '&.Mui-focused': { backgroundColor: 'white', boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)' }
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: isEditing ? 'primary.main' : 'grey.400' }
                  }
                }}
              />
            </Paper>
          </div>

          {/* Right Side - Profile Information */}
          <div className="flex-1 w-full">
            <ProfileInfo
              profileData={profileData}
              isEditing={isEditing}
              setProfileData={setProfileData}
            />
          </div>
        </div>
      </Fade>

      <CreatorFormModal open={isModalOpen} handleClose={handleModalClose} />

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          icon={<CheckIcon />}
          sx={{ fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif', fontWeight: 500 }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Profile;
