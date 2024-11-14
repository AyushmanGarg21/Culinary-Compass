import React from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CreatorRequestPopup = ({ request, onClose, onApprove, onReject }) => {
  return (
    <Dialog open={!!request} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Post Request Details
        <IconButton
          aria-label="close"
          onClick={onClose}
          style={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers className="max-h-[75vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-2">{request.username}</h2>
        <img src={request.image} alt="Post" className="w-full h-auto mb-4" />
        <p className="mb-2"><strong>Description:</strong> {request.description}</p>
        <p className="mb-2"><strong>Materials:</strong> {request.materials.join(', ')}</p>
        <div className="mb-4" dangerouslySetInnerHTML={{ __html: request.fullRecipe }}></div>
        
        <div className="mt-4 flex gap-4">
          <Button variant="contained" color="success" fullWidth onClick={onApprove}>
            Approve
          </Button>
          <Button variant="contained" color="error" fullWidth onClick={onReject}>
            Reject
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatorRequestPopup;
