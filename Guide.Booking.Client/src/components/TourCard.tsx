import React from 'react';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';
import type { TourPackageDto } from '../types';

interface TourCardProps {
  tour: TourPackageDto;
  onBookNow: (tourId: number) => void;
}

const TourCard: React.FC<TourCardProps> = ({ tour, onBookNow }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" gutterBottom>
          {tour.name}
        </Typography>
        <Typography color="text.secondary" paragraph>
          {tour.description}
        </Typography>
        <Typography variant="h6" color="primary.main">
          €{tour.basePrice}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          base price (without discounts and extras)
        </Typography>
      </CardContent>
      <CardActions>
        <Button 
          fullWidth 
          variant="contained" 
          onClick={() => onBookNow(tour.id)}
        >
          Book Now
        </Button>
      </CardActions>
    </Card>
  );
};

export default TourCard;
