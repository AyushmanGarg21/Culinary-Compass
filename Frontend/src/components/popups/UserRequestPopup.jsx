import React from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const UserRequestPopup = ({ request, onClose, onAccept, onDecline }) => {
  return (
    <Dialog open={!!request} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        User Request Details
        <IconButton
          aria-label="close"
          onClick={onClose}
          style={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers className="max-h-[75vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-2">{request.name}</h2>
        <p className="mb-2"><strong>Email:</strong> {request.email}</p>
        <p className="mb-2"><strong>Phone:</strong> {request.phone}</p>
        <p className="mb-2"><strong>Message:</strong> {request.message}</p>
        <p className="mb-2"><strong>Experience:</strong> {request.experience}</p>
        <p className="mb-2"><strong>Links:</strong> {request.links}</p>
        
        <div className="mt-4 flex gap-4">
          <Button variant="contained" color="success" fullWidth onClick={onAccept}>
            Accept
          </Button>
          <Button variant="contained" color="error" fullWidth onClick={onDecline}>
            Decline
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserRequestPopup;
