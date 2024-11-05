import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

const CreatorFormModal = ({ open, handleClose }) => {
  const [formData, setFormData] = useState({
    message: '',
    experience: '',
    links: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    console.log('Submitting Creator Form...', formData);
    setFormData({ message: '', experience: '', links: '' });
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="creator-form-modal">
      <Box 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg max-w-lg w-full space-y-6"
      >
        <Typography id="creator-form-modal" variant="h6" component="h2" className="text-center mb-4">
          Become a Creator
        </Typography>

        <TextField
          label="Message"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="mb-4"
          InputProps={{
            style: { backgroundColor: 'white' },
          }}
        />

        <TextField
          label="Relevant Experience"
          variant="outlined"
          fullWidth
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          className="mb-4"
          InputProps={{
            style: { backgroundColor: 'white' },
          }}
        />

        <TextField
          label="Links"
          variant="outlined"
          fullWidth
          name="links"
          value={formData.links}
          onChange={handleChange}
          className="mb-4"
          InputProps={{
            style: { backgroundColor: 'white' },
          }}
        />

        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
          Submit Request
        </Button>
      </Box>
    </Modal>
  );
};

export default CreatorFormModal;
