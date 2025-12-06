import React, { type ReactNode } from 'react';
import { Box } from '@mui/material';
import Navigation from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', height: '100%' }}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1, py: 3, width: '100%' }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
