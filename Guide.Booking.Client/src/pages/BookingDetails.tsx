import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper, CircularProgress, Alert, Box, Chip, Divider } from '@mui/material';
import { useBookingById } from '../hooks/useBookingById';
import BackButton from '../components/BackButton';

const BookingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { booking, loading, error } = useBookingById(id);

  const formatTimeSlot = (tourDate: string) => {
    const date = new Date(tourDate);
    const startHour = date.getHours();
    const endHour = startHour + 2;
    return `${String(startHour).padStart(2, '0')}:00-${String(endHour).padStart(2, '0')}:00`;
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!booking) return <Typography>Booking not found</Typography>;

  return (
    <Container maxWidth="md">
      <BackButton to="/bookings" label="Back to Bookings" />
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Booking Details</Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6">Tour: {booking.tourPackage.name}</Typography>
        <Typography>{booking.tourPackage.description}</Typography>
        <Box sx={{ mt: 2 }}>
          <Typography><strong>Date:</strong> {new Date(booking.tourDate).toLocaleDateString()}</Typography>
          <Typography><strong>Time:</strong> {formatTimeSlot(booking.tourDate)}</Typography>
          <Typography><strong>Number of People:</strong> {booking.ticketCategories.reduce((sum, tc) => sum + tc.quantity, 0) || booking.numberOfPeople}</Typography>
        </Box>
        {booking.ticketCategories.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Ticket Categories:</Typography>
            {booking.ticketCategories.map((tc, idx) => (
              <Chip key={idx} label={`${tc.type}: ${tc.quantity}`} sx={{ mr: 1, mt: 1 }} />
            ))}
          </Box>
        )}
        {booking.extras.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Extras:</Typography>
            {booking.extras.map((extra) => (
              <Chip key={extra.id} label={`${extra.name} (€${extra.price})`} sx={{ mr: 1, mt: 1 }} />
            ))}
          </Box>
        )}
        <Typography variant="h5" color="primary" sx={{ mt: 3 }}>
          Total Price: €{booking.totalPrice}
        </Typography>
      </Paper>
    </Container>
  );
};

export default BookingDetails;
