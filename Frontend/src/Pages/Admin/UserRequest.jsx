import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserRequests, acceptUserRequest, declineUserRequest } from '../../redux/features/Admin/requestSlice';
import UserRequestPopup from '../../components/popups/UserRequestPopup';
import { Button, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const UserRequest = () => {
  const dispatch = useDispatch();
  const { userRequests, loading } = useSelector((state) => state.requests);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchUserRequests());
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleView = (request) => {
    setSelectedRequest(request);
  };

  const handleClosePopup = () => {
    setSelectedRequest(null);
  };

  const handleAccept = (id) => {
    dispatch(acceptUserRequest(id));
    handleClosePopup();
  };

  const handleDecline = (id) => {
    dispatch(declineUserRequest(id));
    handleClosePopup();
  };

  const filteredRequests = userRequests.filter((request) =>
    request.name.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="p-4 flex flex-col items-center">
      <div className="mb-6 w-3/4 md:w-1/2 lg:w-1/3">
        <TextField
          label="Search Users"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearch}
          className="rounded-full shadow-md bg-white"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: '#888' }} />
              </InputAdornment>
            ),
            style: {
              borderRadius: '9999px',
              padding: '10px 20px', 
              backgroundColor: '#f3f4f6',
              border: '1px solid #ddd',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            },
          }}
          InputLabelProps={{
            style: {
              fontSize: '1rem',
              color: '#888',
            },
          }}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          filteredRequests.map((request) => (
            <div key={request.id} className="w-full p-6 bg-white shadow-lg rounded-lg">
              <h2 className="text-xl font-semibold">{request.name}</h2>
              <p className="mb-4">Message: {request.message}</p>
              <Button variant="contained" color="primary" onClick={() => handleView(request)}>
                View
              </Button>
            </div>
          ))
        )}
      </div>
      {selectedRequest && (
        <UserRequestPopup
          request={selectedRequest}
          onClose={handleClosePopup}
          onAccept={() => handleAccept(selectedRequest.id)}
          onDecline={() => handleDecline(selectedRequest.id)}
        />
      )}
    </div>
  );
};

export default UserRequest;
