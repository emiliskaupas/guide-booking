import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, TextField, Button, MenuItem, FormGroup, FormControlLabel, Checkbox, Box, Alert, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTours, useExtras, usePriceCalculation } from '../hooks/useTours';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI } from '../services/api';
import type { TicketCategoryDto } from '../types';
import BackButton from '../components/BackButton';
import PriceDisplay from '../components/PriceDisplay';

const BookingForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { tours } = useTours();
  const { extras } = useExtras();
  const { priceBreakdown, calculatePrice } = usePriceCalculation();
  
  const preselectedTourId = location.state?.tourId;
  const selectedTour = tours.find(t => t.id === preselectedTourId);
  
  const [tourDate, setTourDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
  const [ticketCategories, setTicketCategories] = useState<TicketCategoryDto[]>([{ type: 'Adult', quantity: 1 }]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  
  const getTimeSlots = () => {
    if (selectedTour?.name === 'Nightlife Tour') {
      return ['18:00-20:00', '21:00-23:00', '00:00-02:00'];
    }
    return ['09:00-11:00', '12:00-14:00', '15:00-17:00', '18:00-20:00'];
  };

  const handleExtraChange = (extraId: number) => {
    setSelectedExtras((prev) =>
      prev.includes(extraId) ? prev.filter((id) => id !== extraId) : [...prev, extraId]
    );
  };

  const addTicketCategory = () => {
    if (ticketCategories.length >= 3) return;
    
    const existingTypes = ticketCategories.map(tc => tc.type);
    let newType: 'Adult' | 'Youth' | 'Child' = 'Adult';
    
    if (existingTypes.includes('Adult')) {
      if (!existingTypes.includes('Youth')) {
        newType = 'Youth';
      } else if (!existingTypes.includes('Child')) {
        newType = 'Child';
      } else {
        newType = 'Adult';
      }
    }
    
    setTicketCategories([...ticketCategories, { type: newType, quantity: 1 }]);
  };

  const removeTicketCategory = (index: number) => {
    setTicketCategories(ticketCategories.filter((_, i) => i !== index));
  };

  const updateTicketCategory = (index: number, field: 'type' | 'quantity', value: any) => {
    const updated = [...ticketCategories];
    updated[index] = { ...updated[index], [field]: value };
    setTicketCategories(updated);
  };

  useEffect(() => {
    if (preselectedTourId) {
      calculatePrice({
        tourPackageId: preselectedTourId,
        numberOfPeople: 1,
        extraIds: selectedExtras,
        ticketCategories: ticketCategories.length > 0 ? ticketCategories : undefined,
      });
    }
  }, [preselectedTourId, selectedExtras, ticketCategories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!user) {
      setError('You must be logged in to create a booking');
      return;
    }

    if (!selectedTime) {
      setError('Please select a time slot');
      return;
    }

    if (!preselectedTourId) {
      setError('No tour selected');
      return;
    }

    setConfirmDialogOpen(true);
  };

  const handleConfirmBooking = async () => {
    setConfirmDialogOpen(false);
    setError('');
    setSuccess('');

    if (!user) {
      setError('You must be logged in to create a booking');
      return;
    }
    
    try {
      const dateTimeString = `${tourDate}T${selectedTime.split('-')[0]}:00`;
      
      await bookingsAPI.createBooking({
        customerName: user.username,
        customerEmail: user.email,
        tourPackageId: preselectedTourId!,
        tourDate: dateTimeString,
        numberOfPeople: 1,
        extraIds: selectedExtras,
        ticketCategories: ticketCategories.length > 0 ? ticketCategories : undefined,
      });
      setSuccess('Booking created successfully!');
      setTimeout(() => navigate('/bookings'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(', ') : err.response?.data?.message || err.message || 'Failed to create booking');
    }
  };

  return (
    <Container maxWidth="md">
      <BackButton to="/home" label="Back to Home" />
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>Create Booking</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" color="primary">
                Tour: {selectedTour?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                 Base price (without discounts and extras): €{selectedTour?.basePrice}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Tour Date"
                type="date"
                value={tourDate}
                onChange={(e) => setTourDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: today }}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                select
                label="Time Slot"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
                disabled={!tourDate}
              >
                {getTimeSlots().map((slot) => (
                  <MenuItem key={slot} value={slot}>
                    {slot}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 3 }}>Ticket Categories (Optional)</Typography>
          {ticketCategories.map((tc, idx) => (
            <Grid container spacing={2} key={idx} sx={{ mt: 1 }}>
              <Grid size={{ xs: 5 }}>
                <TextField
                  fullWidth
                  select
                  label="Type"
                  value={tc.type}
                  onChange={(e) => updateTicketCategory(idx, 'type', e.target.value)}
                >
                  <MenuItem value="Adult">Adult (Full Price)</MenuItem>
                  <MenuItem value="Youth">Youth (25% off)</MenuItem>
                  <MenuItem value="Child">Child (50% off)</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 5 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Quantity"
                  value={tc.quantity}
                  onChange={(e) => updateTicketCategory(idx, 'quantity', Number(e.target.value))}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid size={{ xs: 2 }}>
                <IconButton 
                  onClick={() => removeTicketCategory(idx)} 
                  color="error"
                  disabled={ticketCategories.length === 1}
                >
                  <Remove />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button 
            startIcon={<Add />} 
            onClick={addTicketCategory} 
            sx={{ mt: 1 }}
            disabled={ticketCategories.length >= 3}
          >
            Add Ticket Category {ticketCategories.length >= 3 && '(Max 3)'}
          </Button>

          <Typography variant="h6" sx={{ mt: 3 }}>Extras</Typography>
          <FormGroup>
            {extras.map((extra) => (
              <FormControlLabel
                key={extra.id}
                control={
                  <Checkbox
                    checked={selectedExtras.includes(extra.id)}
                    onChange={() => handleExtraChange(extra.id)}
                  />
                }
                label={`${extra.name} - €${extra.price}`}
              />
            ))}
          </FormGroup>

          {priceBreakdown && <PriceDisplay priceBreakdown={priceBreakdown} />}

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            Create Booking
          </Button>
        </Box>
      </Paper>

      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Your Booking</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" gutterBottom>
              {selectedTour?.name}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Date:</Typography>
                <Typography fontWeight="medium">{new Date(tourDate).toLocaleDateString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Time:</Typography>
                <Typography fontWeight="medium">{selectedTime}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Tickets:</Typography>
                <Typography fontWeight="medium">
                  {ticketCategories.map(tc => `${tc.quantity} ${tc.type}`).join(', ')}
                </Typography>
              </Box>
              {selectedExtras.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Extras:</Typography>
                  <Typography fontWeight="medium">
                    {selectedExtras.map(id => extras.find(e => e.id === id)?.name).join(', ')}
                  </Typography>
                </Box>
              )}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  €{priceBreakdown?.totalPrice.toFixed(2) || '0.00'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmBooking} variant="contained" autoFocus>
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookingForm;
