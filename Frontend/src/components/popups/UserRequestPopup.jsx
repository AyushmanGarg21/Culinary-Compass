import React from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const UserRequestPopup = ({ request, onClose, onAccept, onDecline }) => {
  return (
    <Dialog 
      open={!!request} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }
      }}
    >
      <DialogTitle sx={{ 
        fontFamily: 'Inter, system-ui, sans-serif',
        fontWeight: '700',
        fontSize: '1.5rem',
        color: '#1e293b',
        borderBottom: '1px solid #e2e8f0',
        pb: 2
      }}>
        User Application Request
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ 
            position: 'absolute', 
            right: 8, 
            top: 8,
            color: '#64748b',
            '&:hover': { backgroundColor: '#f1f5f9' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }} className="max-h-[75vh] overflow-y-auto">
        <div className="space-y-6">
          {/* User Info Header */}
          <div className="p-4 bg-orange-50 rounded-lg">
            <h3 className="text-xl font-semibold text-slate-800 font-inter mb-1">{request.name}</h3>
            <span className="text-sm text-orange-600 font-medium">User Application</span>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold text-slate-700 mb-2 font-inter">Email</h4>
              <p className="text-slate-600 break-all">{request.email}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold text-slate-700 mb-2 font-inter">Phone</h4>
              <p className="text-slate-600">{request.phone}</p>
            </div>
          </div>

          {/* Message */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold text-slate-700 mb-2 font-inter">Message</h4>
            <p className="text-slate-600 leading-relaxed">{request.message}</p>
          </div>

          {/* Experience */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold text-slate-700 mb-2 font-inter">Experience</h4>
            <p className="text-slate-600 leading-relaxed">{request.experience}</p>
          </div>

          {/* Links */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold text-slate-700 mb-2 font-inter">Portfolio Links</h4>
            <p className="text-slate-600 break-all">{request.links}</p>
          </div>
        </div>
        
        <div className="mt-6 flex gap-3">
          <Button 
            variant="contained" 
            fullWidth 
            onClick={onAccept}
            sx={{
              backgroundColor: '#10b981',
              '&:hover': { backgroundColor: '#059669' },
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: '600',
              fontFamily: 'Inter, system-ui, sans-serif',
              py: 1.5,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          >
            Accept Application
          </Button>
          <Button 
            variant="contained" 
            fullWidth 
            onClick={onDecline}
            sx={{
              backgroundColor: '#ef4444',
              '&:hover': { backgroundColor: '#dc2626' },
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: '600',
              fontFamily: 'Inter, system-ui, sans-serif',
              py: 1.5,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          >
            Decline Application
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserRequestPopup;
