import React from 'react';
import { IconButton, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  to: string;
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ to, label = 'Back' }) => {
  const navigate = useNavigate();

  return (
    <IconButton onClick={() => navigate(to)} sx={{ mt: 2 }}>
      <ArrowBack /> <Typography sx={{ ml: 1 }}>{label}</Typography>
    </IconButton>
  );
};

export default BackButton;
