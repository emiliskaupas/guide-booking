import React from 'react';
import { Box, Typography } from '@mui/material';
import type { PriceBreakdownDto } from '../types';

interface PriceDisplayProps {
  priceBreakdown: PriceBreakdownDto;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ priceBreakdown }) => {
  return (
    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
      <Typography>Base Tour Price: €{priceBreakdown.baseTourPrice.toFixed(2)}</Typography>
      <Typography>Extras Total: €{priceBreakdown.extrasTotal.toFixed(2)}</Typography>
      {priceBreakdown.discountAmount > 0 && (
        <Typography color="success.main">
          Discount: -€{priceBreakdown.discountAmount.toFixed(2)} ({priceBreakdown.discountReason})
        </Typography>
      )}
      <Typography variant="h6" color="primary">
        Total: €{priceBreakdown.totalPrice.toFixed(2)}
      </Typography>
    </Box>
  );
};

export default PriceDisplay;
