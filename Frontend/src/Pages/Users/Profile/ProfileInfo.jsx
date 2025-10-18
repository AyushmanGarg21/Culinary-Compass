// ProfileInfo.jsx
import React, { useState } from 'react';
import { 
  TextField, 
  Grid, 
  MenuItem, 
  Paper, 
  Typography, 
  Grow,
  Tooltip 
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Phone,
  Public,
  Language,
  Restaurant,
  Cake,
  FitnessCenter,
  Height,
  Wc,
  CalendarToday,
  LocationCity,
  AccountCircle,
  Lock,
  Info
} from '@mui/icons-material';

const countries = ['United States', 'Canada', 'Australia', 'United Kingdom', 'Germany', 'India', 'France'];
const genders = ['Male', 'Female', 'Other'];

const ProfileInfo = ({ profileData, isEditing, setProfileData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((showPassword) => !showPassword);

  const filteredCountries = countries.filter(country =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFieldIcon = (key) => {
    const iconMap = {
      name: <Person />,
      email: <Email />,
      phone: <Phone />,
      country: <Public />,
      language: <Language />,
      foodPreference: <Restaurant />,
      age: <Cake />,
      weight: <FitnessCenter />,
      height: <Height />,
      gender: <Wc />,
      dateOfBirth: <CalendarToday />,
      city: <LocationCity />,
      username: <AccountCircle />,
      password: <Lock />,
      aboutMe: <Info />
    };
    return iconMap[key] || <Person />;
  };

  const getFieldLabel = (key) => {
    const labelMap = {
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      country: 'Country',
      language: 'Language',
      foodPreference: 'Food Preference',
      age: 'Age',
      weight: 'Weight (kg)',
      height: 'Height (cm)',
      gender: 'Gender',
      dateOfBirth: 'Date of Birth',
      city: 'City',
      username: 'Username',
      password: 'Password',
      aboutMe: 'About Me'
    };
    return labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4, 
        borderRadius: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
      }}
    >
      <Grid container spacing={3} className="w-full">
      {Object.keys(profileData).map((key, index) => {
        const commonProps = {
          label: getFieldLabel(key),
          variant: "outlined",
          fullWidth: true,
          value: profileData[key],
          InputProps: {
            readOnly: key === 'email' ? true : !isEditing,
            startAdornment: (
              <InputAdornment position="start">
                {getFieldIcon(key)}
              </InputAdornment>
            ),
            sx: {
              backgroundColor: isEditing && key !== 'email' ? 'white' : '#f8f9fa',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              '&:hover': {
                backgroundColor: isEditing && key !== 'email' ? '#ffffff' : '#f0f2f5',
              },
              '&.Mui-focused': {
                backgroundColor: 'white',
                boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
              }
            }
          },
          sx: {
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: isEditing ? 'primary.main' : 'grey.400',
              }
            },
            '& .MuiInputLabel-root': {
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              fontWeight: 500
            }
          }
        };

        if (key === 'foodPreference') {
          return (
            <Grid item xs={12} sm={4} key={key}>
              <Grow in={true} timeout={300 + index * 100}>
                <TextField
                  {...commonProps}
                  select
                  onChange={(e) => setProfileData({ ...profileData, [key]: e.target.value })}
                >
                  <MenuItem value="Vegetarian">🥗 Vegetarian</MenuItem>
                  <MenuItem value="Non-Vegetarian">🍖 Non-Vegetarian</MenuItem>
                  <MenuItem value="Vegan">🌱 Vegan</MenuItem>
                </TextField>
              </Grow>
            </Grid>
          );
        } else if (key === 'country') {
          return (
            <Grid item xs={12} sm={4} key={key}>
              <Grow in={true} timeout={300 + index * 100}>
                <TextField
                  {...commonProps}
                  select
                  onChange={(e) => setProfileData({ ...profileData, [key]: e.target.value })}
                  onInput={(e) => setSearchTerm(e.target.value)}
                >
                  {filteredCountries.map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </TextField>
              </Grow>
            </Grid>
          );
        } else if (key === 'age') {
          return (
            <Grid item xs={12} sm={4} key={key}>
              <Grow in={true} timeout={300 + index * 100}>
                <TextField
                  {...commonProps}
                  type="number"
                  onChange={(e) => {
                    if (e.target.value >= 0) {
                      setProfileData({ ...profileData, [key]: e.target.value });
                    }
                  }}
                />
              </Grow>
            </Grid>
          );
        } else if (key === 'height') {
          return (
            <Grid item xs={12} sm={4} key={key}>
              <Grow in={true} timeout={300 + index * 100}>
                <TextField
                  {...commonProps}
                  type="number"
                  onChange={(e) => setProfileData({ ...profileData, [key]: e.target.value })}
                />
              </Grow>
            </Grid>
          );
        } else if (key === 'weight') {
          return (
            <Grid item xs={12} sm={4} key={key}>
              <Grow in={true} timeout={300 + index * 100}>
                <TextField
                  {...commonProps}
                  type="number"
                  onChange={(e) => setProfileData({ ...profileData, [key]: e.target.value })}
                />
              </Grow>
            </Grid>
          );
        } else if (key === 'gender') {
          return (
            <Grid item xs={12} sm={4} key={key}>
              <Grow in={true} timeout={300 + index * 100}>
                <TextField
                  {...commonProps}
                  select
                  onChange={(e) => setProfileData({ ...profileData, [key]: e.target.value })}
                >
                  {genders.map((gender) => (
                    <MenuItem key={gender} value={gender}>
                      {gender}
                    </MenuItem>
                  ))}
                </TextField>
              </Grow>
            </Grid>
          );
        } else if (key === 'dateOfBirth') {
          return (
            <Grid item xs={12} sm={4} key={key}>
              <Grow in={true} timeout={300 + index * 100}>
                <TextField
                  {...commonProps}
                  type="date"
                  onChange={(e) => setProfileData({ ...profileData, [key]: e.target.value })}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grow>
            </Grid>
          );
        } else if (key === 'password') {
          return (
            <Grid item xs={12} sm={4} key={key}>
              <Grow in={true} timeout={300 + index * 100}>
                <TextField
                  {...commonProps}
                  type={showPassword ? 'text' : 'password'}
                  onChange={(e) => setProfileData({ ...profileData, [key]: e.target.value })}
                  slotProps={{
                    input: {
                      ...commonProps.InputProps,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title={showPassword ? "Hide password" : "Show password"}>
                            <IconButton
                              onClick={handleClickShowPassword}
                              edge="end"
                              sx={{
                                transition: 'transform 0.2s ease',
                                '&:hover': {
                                  transform: 'scale(1.1)'
                                }
                              }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      )
                    }
                  }}
                />
              </Grow>
            </Grid>
          );
        } else if (key === 'aboutMe') {
          return (
            <Grid item xs={12} key={key}>
              <Grow in={true} timeout={300 + index * 100}>
                <TextField
                  {...commonProps}
                  multiline
                  rows={4}
                  onChange={(e) => setProfileData({ ...profileData, [key]: e.target.value })}
                  placeholder="Share something interesting about yourself..."
                />
              </Grow>
            </Grid>
          );
        } else {
          return (
            <Grid item xs={12} sm={4} key={key}>
              <Grow in={true} timeout={300 + index * 100}>
                <TextField
                  {...commonProps}
                  onChange={(e) => {
                    if (key !== 'email') {
                      setProfileData({ ...profileData, [key]: e.target.value });
                    }
                  }}
                />
              </Grow>
            </Grid>
          );
        }
      })}
      </Grid>
    </Paper>
  );
};

export default ProfileInfo;
