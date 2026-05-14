// ProfileInfo.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField,
  Grid,
  MenuItem,
  Paper,
  Grow,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Public,
  Language,
  Cake,
  FitnessCenter,
  Height,
  Wc,
  LocationCity,
} from '@mui/icons-material';
import {
  fetchCountries,
  fetchCitiesByCountry,
} from '../../../redux/features/utils/masterSlice';

const genders = ['Male', 'Female', 'Other'];

// Fields to render in the grid (dateOfBirth, password, foodPreference excluded)
const FIELD_ORDER = [
  'email', 'phone', 'country', 'city',
  'language', 'gender',
  'age', 'weight', 'height',
];

const getFieldIcon = (key) => {
  const iconMap = {
    email: <Email />,
    phone: <Phone />,
    country: <Public />,
    city: <LocationCity />,
    language: <Language />,
    age: <Cake />,
    weight: <FitnessCenter />,
    height: <Height />,
    gender: <Wc />,
  };
  return iconMap[key] || <Person />;
};

const getFieldLabel = (key) => {
  const labelMap = {
    email: 'Email Address',
    phone: 'Phone Number',
    country: 'Country',
    city: 'City',
    language: 'Language',
    age: 'Age',
    weight: 'Weight (kg)',
    height: 'Height (cm)',
    gender: 'Gender',
  };
  return labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
};

const ProfileInfo = ({ profileData, isEditing, setProfileData }) => {
  const dispatch = useDispatch();
  const { countries, citiesByCountry, loadingCountries, loadingCities } = useSelector(
    (state) => state.master
  );

  // Fetch countries once on mount
  useEffect(() => {
    if (countries.length === 0) {
      dispatch(fetchCountries());
    }
  }, [dispatch, countries.length]);

  // When the selected country changes, fetch its cities (use cache if available)
  const selectedCountryId = profileData.countryId;
  useEffect(() => {
    if (selectedCountryId && !citiesByCountry[selectedCountryId]) {
      dispatch(fetchCitiesByCountry(selectedCountryId));
    }
  }, [dispatch, selectedCountryId, citiesByCountry]);

  const currentCities = citiesByCountry[selectedCountryId] || [];

  const handleCountryChange = (e) => {
    const countryId = e.target.value;
    const countryObj = countries.find((c) => c.id === countryId);
    setProfileData({
      ...profileData,
      countryId,
      country: countryObj?.name || '',
      // Reset city when country changes
      cityId: '',
      city: '',
    });
  };

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    const cityObj = currentCities.find((c) => c.id === cityId);
    setProfileData({
      ...profileData,
      cityId,
      city: cityObj?.name || '',
    });
  };

  const commonInputSx = (key) => ({
    backgroundColor: isEditing && key !== 'email' ? 'white' : '#f8f9fa',
    borderRadius: 2,
    transition: 'all 0.3s ease',
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    '&:hover': {
      backgroundColor: isEditing && key !== 'email' ? '#ffffff' : '#f0f2f5',
    },
    '&.Mui-focused': {
      backgroundColor: 'white',
      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
    },
  });

  const commonFieldSx = {
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': { borderColor: isEditing ? 'primary.main' : 'grey.400' },
    },
    '& .MuiInputLabel-root': {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
    },
  };

  const renderField = (key, index) => {
    const baseProps = {
      label: getFieldLabel(key),
      variant: 'outlined',
      fullWidth: true,
      InputProps: {
        readOnly: key === 'email' ? true : !isEditing,
        startAdornment: (
          <InputAdornment position="start">{getFieldIcon(key)}</InputAdornment>
        ),
        sx: commonInputSx(key),
      },
      sx: commonFieldSx,
    };

    // ── Country dropdown ──────────────────────────────────────────────────────
    if (key === 'country') {
      return (
        <Grid item xs={12} sm={4} key={key}>
          <Grow in={true} timeout={300 + index * 100}>
            <TextField
              {...baseProps}
              select
              value={profileData.countryId || ''}
              onChange={handleCountryChange}
              InputProps={{
                ...baseProps.InputProps,
                readOnly: !isEditing,
                endAdornment: loadingCountries ? (
                  <InputAdornment position="end">
                    <CircularProgress size={16} />
                  </InputAdornment>
                ) : null,
              }}
            >
              {countries.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>
          </Grow>
        </Grid>
      );
    }

    // ── City dropdown ─────────────────────────────────────────────────────────
    if (key === 'city') {
      return (
        <Grid item xs={12} sm={4} key={key}>
          <Grow in={true} timeout={300 + index * 100}>
            <TextField
              {...baseProps}
              select
              value={profileData.cityId || ''}
              onChange={handleCityChange}
              disabled={!profileData.countryId}
              InputProps={{
                ...baseProps.InputProps,
                readOnly: !isEditing,
                endAdornment: loadingCities ? (
                  <InputAdornment position="end">
                    <CircularProgress size={16} />
                  </InputAdornment>
                ) : null,
              }}
            >
              {currentCities.length === 0 ? (
                <MenuItem disabled value="">
                  {profileData.countryId ? 'No cities available' : 'Select a country first'}
                </MenuItem>
              ) : (
                currentCities.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))
              )}
            </TextField>
          </Grow>
        </Grid>
      );
    }

    // ── Gender ────────────────────────────────────────────────────────────────
    if (key === 'gender') {
      return (
        <Grid item xs={12} sm={4} key={key}>
          <Grow in={true} timeout={300 + index * 100}>
            <TextField
              {...baseProps}
              select
              value={profileData[key]}
              onChange={(e) => setProfileData({ ...profileData, [key]: e.target.value })}
            >
              {genders.map((g) => (
                <MenuItem key={g} value={g}>{g}</MenuItem>
              ))}
            </TextField>
          </Grow>
        </Grid>
      );
    }

    // ── Numeric fields ────────────────────────────────────────────────────────
    if (['age', 'weight', 'height'].includes(key)) {
      return (
        <Grid item xs={12} sm={4} key={key}>
          <Grow in={true} timeout={300 + index * 100}>
            <TextField
              {...baseProps}
              type="number"
              value={profileData[key]}
              onChange={(e) => {
                if (Number(e.target.value) >= 0) {
                  setProfileData({ ...profileData, [key]: e.target.value });
                }
              }}
            />
          </Grow>
        </Grid>
      );
    }

    // ── Default text field ────────────────────────────────────────────────────
    return (
      <Grid item xs={12} sm={4} key={key}>
        <Grow in={true} timeout={300 + index * 100}>
          <TextField
            {...baseProps}
            value={profileData[key]}
            onChange={(e) => {
              if (key !== 'email') {
                setProfileData({ ...profileData, [key]: e.target.value });
              }
            }}
          />
        </Grow>
      </Grid>
    );
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      }}
    >
      <Grid container spacing={3} className="w-full">
        {FIELD_ORDER.map((key, index) => renderField(key, index))}
      </Grid>
    </Paper>
  );
};

export default ProfileInfo;
