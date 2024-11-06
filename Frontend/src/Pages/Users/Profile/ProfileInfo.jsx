// ProfileInfo.jsx
import React, { useState } from 'react';
import { TextField, Grid, MenuItem } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const countries = ['United States', 'Canada', 'Australia', 'United Kingdom', 'Germany', 'India', 'France'];
const genders = ['Male', 'Female', 'Other'];

const ProfileInfo = ({ profileData, isEditing, setProfileData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((showPassword) => !showPassword);

  const filteredCountries = countries.filter(country =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Grid container spacing={2} className="w-full max-w-[80%]">
      {Object.keys(profileData).map((key) => {
        if (key === 'foodPreference') {
          return (
            <Grid item xs={12} sm={4} key={key}>
              <TextField
                select
                label="Food Preference"
                variant="outlined"
                fullWidth
                value={profileData[key]}
                onChange={(e) => setProfileData({ ...profileData, [key]: e.target.value })}
                InputProps={{
                  readOnly: !isEditing,
                  style: { backgroundColor: isEditing ? 'white' : '#f0f0f0' },
                }}
              >
                <MenuItem value="Vegetarian">Vegetarian</MenuItem>
                <MenuItem value="Non-Vegetarian">Non-Vegetarian</MenuItem>
                <MenuItem value="Vegan">Vegan</MenuItem>
              </TextField>
            </Grid>
          );
        } else if (key === 'country') {
          return (
            <Grid item xs={12} sm={4} key={key}>
              <TextField
                select
                label="Country"
                variant="outlined"
                fullWidth
                value={profileData[key]}
                onChange={(e) => setProfileData({ ...profileData, [key]: e.target.value })}
                onInput={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  readOnly: !isEditing,
                  style: { backgroundColor: isEditing ? 'white' : '#f0f0f0' },
                }}
              >
                {filteredCountries.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          );
        } else if (key === 'age') {
          return (
            <Grid item xs={12} sm={4} key={key}>
              <TextField
                label="Age"
                variant="outlined"
                fullWidth
                type="number"
                value={profileData[key]}
                onChange={(e) => {
                  if (e.target.value >= 0) {
                    setProfileData({ ...profileData, [key]: e.target.value });
                  }
                }}
                InputProps={{
                  readOnly: !isEditing,
                  style: { backgroundColor: isEditing ? 'white' : '#f0f0f0' },
                }}
              />
            </Grid>
          );
        } else if (key === 'height') {
          return (
            <Grid item xs={12} sm={4} key={key}>
              <TextField
                label="Height (cm)"
                variant="outlined"
                fullWidth
                type="number"
                value={profileData[key]} // Keep as cm
                onChange={(e) => setProfileData({ ...profileData, [key]: e.target.value })}
                InputProps={{
                  readOnly: !isEditing,
                  style: { backgroundColor: isEditing ? 'white' : '#f0f0f0' },
                }}
              />
            </Grid>
          );
        } else if (key === 'weight') {
          return (
            <Grid item xs={12} sm={4} key={key}>
              <TextField
                label="Weight (kg)"
                variant="outlined"
                fullWidth
                type="number"
                value={profileData[key]}
                onChange={(e) => setProfileData({ ...profileData, [key]: e.target.value })}
                InputProps={{
                  readOnly: !isEditing,
                  style: { backgroundColor: isEditing ? 'white' : '#f0f0f0' },
                }}
              />
            </Grid>
          );
        } else if (key === 'gender') {
          return (
            <Grid item xs={12} sm={4} key={key}>
              <TextField
                select
                label="Gender"
                variant="outlined"
                fullWidth
                value={profileData[key]}
                onChange={(e) => setProfileData({ ...profileData, [key]: e.target.value })}
                InputProps={{
                  readOnly: !isEditing,
                  style: { backgroundColor: isEditing ? 'white' : '#f0f0f0' },
                }}
              >
                {genders.map((gender) => (
                  <MenuItem key={gender} value={gender}>
                    {gender}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          );
        } else if (key === 'dateOfBirth') {
          return (
            <Grid item xs={12} sm={4} key={key}>
              <TextField
                label="Date of Birth"
                variant="outlined"
                fullWidth
                type="date"
                value={profileData[key]}
                onChange={(e) => setProfileData({ ...profileData, [key]: e.target.value })}
                InputProps={{
                  readOnly: !isEditing,
                  style: { backgroundColor: isEditing ? 'white' : '#f0f0f0' },
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          );
        }  else if (key === 'city') {
          return (
            <Grid item xs={12} sm={4} key={key}>
              <TextField
                label="City"
                variant="outlined"
                fullWidth
                value={profileData[key]}
                onChange={(e) => setProfileData({ ...profileData, [key]: e.target.value })}
                InputProps={{
                  readOnly: !isEditing,
                  style: { backgroundColor: isEditing ? 'white' : '#f0f0f0' },
                }}
              />
            </Grid>
          );
        } else if (key === 'password') {
          return (
            <Grid item xs={12} sm={4} key={key}>
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                type={showPassword ? 'text' : 'password'}
                value={profileData[key]}
                onChange={(e) => setProfileData({ ...profileData, [key]: e.target.value })}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword ? 'hide the password' : 'display the password'
                      }
                      onClick={handleClickShowPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                InputProps={{
                  readOnly: !isEditing,
                  style: { backgroundColor: isEditing ? 'white' : '#f0f0f0' },
                }}
              />
            </Grid>
          );
        } 
        else if (key === 'aboutMe') {
          return (
            <Grid item xs={12} key={key}>
              <TextField
                label="About Me"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={profileData[key]}
                onChange={(e) => setProfileData({ ...profileData, [key]: e.target.value })}
                InputProps={{
                  readOnly: !isEditing,
                  style: { backgroundColor: isEditing ? 'white' : '#f0f0f0' },
                }}
              />
            </Grid>
          );
        }
        else {
          return (
            <Grid item xs={12} sm={4} key={key}>
              <TextField
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                variant="outlined"
                fullWidth
                value={profileData[key]}
                onChange={(e) => {
                  if (key !== 'email') {
                    setProfileData({ ...profileData, [key]: e.target.value });
                  }
                }}
                InputProps={{
                  readOnly: !(isEditing && key !== 'email'),
                  style: { backgroundColor: isEditing ? 'white' : '#f0f0f0' },
                }}
              />
            </Grid>
          );
        }
      })}
    </Grid>
  );
};

export default ProfileInfo;
