import React from 'react';
import { Card, CardContent, Button, Typography, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { BookingDto } from '../types';

interface BookingCardProps {
  booking: BookingDto;
  onDelete: (id: number) => void;
  formatTimeSlot: (tourDate: string) => string;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onDelete, formatTimeSlot }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{booking.tourPackage.name}</Typography>
        <Typography>Date: {new Date(booking.tourDate).toLocaleDateString()}</Typography>
        <Typography>Time: {formatTimeSlot(booking.tourDate)}</Typography>
        <Typography>
          People: {booking.ticketCategories.reduce((sum, tc) => sum + tc.quantity, 0) || booking.numberOfPeople}
        </Typography>
        <Typography variant="h6" color="primary">
          Total: €{booking.totalPrice}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button component={RouterLink} to={`/bookings/${booking.id}`} sx={{ mr: 1 }}>
            View Details
          </Button>
          <Button color="error" onClick={() => onDelete(booking.id)}>
            Delete
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
