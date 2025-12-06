import React from 'react';
import { Box} from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1a1a2e',
        color: 'white',
        py: 4,
        mt: 'auto',
      }}
    >
    </Box>
  );
};

export default Footer;