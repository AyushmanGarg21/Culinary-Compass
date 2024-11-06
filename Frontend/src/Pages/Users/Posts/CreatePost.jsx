// CreatePost.jsx
import React, { useState } from 'react';
import { Button, TextField, Box, Chip, IconButton } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './CreatePost.css'; // For custom Tailwind styling if needed

const CreatePost = () => {
  const [overview, setOverview] = useState('');
  const [image, setImage] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [details, setDetails] = useState('');

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleKeywordAdd = () => {
    if (currentKeyword && keywords.length < 30) {
      setKeywords([...keywords, currentKeyword]);
      setCurrentKeyword('');
    }
  };

  const handleKeywordDelete = (keywordToDelete) => {
    setKeywords(keywords.filter(keyword => keyword !== keywordToDelete));
  };

  const handleSubmit = async () => {
    const postData = {
      overview,
      image,
      keywords,
      details
    };

    // Fake API call simulation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Data submitted:", postData);

    // Clear form
    setOverview('');
    setImage(null);
    setKeywords([]);
    setDetails('');
  };

  return (
    <Box className="create-post-container p-4 max-w-[60%] mx-auto mt-12">
      {/* Overview */}
      <TextField
        label="Recipe Overview"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={overview}
        onChange={(e) => setOverview(e.target.value)}
        inputProps={{ maxLength: 100 }}
        className="mb-4"
      />

      {/* Image Upload */}
      <Box className="image-upload mb-4">
        <input
          accept="image/*"
          type="file"
          style={{ display: 'none' }}
          id="upload-button"
          onChange={handleImageUpload}
        />
        <label htmlFor="upload-button">
          <IconButton color="primary" aria-label="upload image" component="span">
            <PhotoCamera />
          </IconButton>
          {image && <img src={image} alt="Preview" className="h-20 w-20 object-cover mt-2" />}
        </label>
      </Box>

      {/* Materials (Keywords) */}
      <Box className="keywords mb-4">
        <TextField
          label="Add Material"
          variant="outlined"
          fullWidth
          value={currentKeyword}
          onChange={(e) => setCurrentKeyword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleKeywordAdd()}
          className="mb-2"
        />
        <Box className="keyword-list flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <Chip
              key={index}
              label={keyword}
              variant="outlined"
              onDelete={() => handleKeywordDelete(keyword)}
              color="primary"
            />
          ))}
        </Box>
      </Box>

      {/* Details */}
      <ReactQuill
        value={details}
        onChange={setDetails}
        className="mb-4 mt-4"
        placeholder="Enter full cooking instructions here..."
      />

      {/* Submit Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Box>
  );
};

export default CreatePost;
