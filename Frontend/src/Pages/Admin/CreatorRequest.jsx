import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostRequests, approvePostRequest, rejectPostRequest } from '../../redux/features/Admin/requestSlice';
import CreatorRequestPopup from '../../components/popups/CreatorRequestPopup';
import { Button, TextField ,InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const CreatorRequest = () => {
  const dispatch = useDispatch();
  const { postRequests, loading } = useSelector((state) => state.requests);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchPostRequests());
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

  const handleApprove = (id) => {
    dispatch(approvePostRequest(id));
    handleClosePopup();
  };

  const handleReject = (id) => {
    dispatch(rejectPostRequest(id));
    handleClosePopup();
  };

  const filteredRequests = postRequests.filter((request) =>
    request.username.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Creator Requests</h1>
          <p className="text-slate-600 font-medium">Review and manage creator applications</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-md">
            <TextField
              label="Search by username"
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
                    borderColor: '#3b82f6',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3b82f6',
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
              <div className="text-slate-500 font-medium">No creator requests found</div>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-200 hover:border-blue-200">
                <div className="flex items-center mb-4">
                  <img 
                    src={request.profilePic} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full border-2 border-slate-200 mr-3" 
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 font-inter">{request.username}</h3>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                      Creator Request
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                  <span className="font-medium text-slate-700">Description:</span> {request.description}
                </p>
                <Button 
                  variant="contained" 
                  onClick={() => handleView(request)}
                  sx={{
                    backgroundColor: '#3b82f6',
                    '&:hover': { backgroundColor: '#2563eb' },
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
        <CreatorRequestPopup
          request={selectedRequest}
          onClose={handleClosePopup}
          onApprove={() => handleApprove(selectedRequest.id)}
          onReject={() => handleReject(selectedRequest.id)}
        />
      )}
    </div>
  );
};

export default CreatorRequest;
