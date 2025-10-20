import React from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CreatorRequestPopup = ({ request, onClose, onApprove, onReject }) => {
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
        Creator Post Request
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
          {/* User Info */}
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
            <img 
              src={request.profilePic} 
              alt="Profile" 
              className="w-12 h-12 rounded-full border-2 border-blue-200" 
            />
            <div>
              <h3 className="text-lg font-semibold text-slate-800 font-inter">{request.username}</h3>
              <span className="text-sm text-blue-600 font-medium">Creator Applicant</span>
            </div>
          </div>

          {/* Post Image */}
          <div className="rounded-lg overflow-hidden border border-slate-200">
            <img src={request.image} alt="Post" className="w-full h-auto" />
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold text-slate-700 mb-2 font-inter">Description</h4>
              <p className="text-slate-600 leading-relaxed">{request.description}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold text-slate-700 mb-2 font-inter">Materials</h4>
              <p className="text-slate-600">{request.materials.join(', ')}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold text-slate-700 mb-2 font-inter">Full Recipe</h4>
              <div 
                className="text-slate-600 leading-relaxed prose prose-sm max-w-none" 
                dangerouslySetInnerHTML={{ __html: request.fullRecipe }}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex gap-3">
          <Button 
            variant="contained" 
            fullWidth 
            onClick={onApprove}
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
            Approve Request
          </Button>
          <Button 
            variant="contained" 
            fullWidth 
            onClick={onReject}
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
            Reject Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatorRequestPopup;
