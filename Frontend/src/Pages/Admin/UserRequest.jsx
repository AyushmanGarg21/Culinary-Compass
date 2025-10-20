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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">User Requests</h1>
          <p className="text-slate-600 font-medium">Review and manage user applications</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-md">
            <TextField
              label="Search by name"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="text-slate-400" />
                  </InputAdornment>
                ),
                style: {
                  borderRadius: '12px',
                  backgroundColor: 'white',
                  fontFamily: 'Inter, system-ui, sans-serif',
                },
              }}
              InputLabelProps={{
                style: {
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: '500',
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#e2e8f0',
                    borderWidth: '2px',
                  },
                  '&:hover fieldset': {
                    borderColor: '#f97316',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#f97316',
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="text-slate-500 font-medium">Loading requests...</div>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="text-slate-500 font-medium">No user requests found</div>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-200 hover:border-orange-200">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-slate-800 font-inter">{request.name}</h3>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
                      User Request
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                  <span className="font-medium text-slate-700">Message:</span> {request.message}
                </p>
                <Button
                  variant="contained"
                  onClick={() => handleView(request)}
                  sx={{
                    backgroundColor: '#f97316',
                    '&:hover': { backgroundColor: '#ea580c' },
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: '600',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  }}
                  fullWidth
                >
                  Review Request
                </Button>
              </div>
            ))
          )}
        </div>
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
