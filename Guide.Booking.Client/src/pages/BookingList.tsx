import React, { useState } from 'react';
import { Container, Typography, CircularProgress, Alert, Box, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Paper, TextField, MenuItem, Accordion, AccordionSummary, AccordionDetails, Chip } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClearIcon from '@mui/icons-material/Clear';
import { useBookings } from '../hooks/useBookings';
import { useTours } from '../hooks/useTours';
import BackButton from '../components/BackButton';
import BookingCard from '../components/BookingCard';
import type { BookingFilterDto } from '../types';

const BookingList: React.FC = () => {
  const [filters, setFilters] = useState<BookingFilterDto>({});
  const { bookings, loading, error, deleteBooking } = useBookings(filters);
  const { tours } = useTours();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<number | null>(null);

  const formatTimeSlot = (tourDate: string) => {
    const date = new Date(tourDate);
    const startHour = date.getHours();
    const endHour = startHour + 2;
    return `${String(startHour).padStart(2, '0')}:00-${String(endHour).padStart(2, '0')}:00`;
  };

  const handleDelete = (id: number) => {
    setBookingToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (bookingToDelete !== null) {
      try {
        await deleteBooking(bookingToDelete);
        setDeleteDialogOpen(false);
        setBookingToDelete(null);
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setBookingToDelete(null);
  };

  const handleFilterChange = (field: keyof BookingFilterDto, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value || undefined
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== undefined && v !== '').length;

  if (loading) return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <CircularProgress />
    </Container>
  );
  if (error) return (
    <Container sx={{ mt: 4 }}>
      <Alert severity="error">{error}</Alert>
    </Container>
  );

  return (
    <Container maxWidth="lg">
      <BackButton to="/home" label="Back to Home" />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h3">My Bookings</Typography>
          {bookings.length > 0 && (
            <Chip label={`${bookings.length} booking${bookings.length !== 1 ? 's' : ''}`} color="primary" />
          )}
        </Box>
      </Box>

      {/* Filters */}
      <Accordion sx={{ mb: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterListIcon />
            <Typography>Filters</Typography>
            {activeFilterCount > 0 && (
              <Chip size="small" label={activeFilterCount} color="primary" />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <TextField
                fullWidth
                label="From Date"
                type="date"
                value={filters.fromDate || ''}
                onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <TextField
                fullWidth
                label="To Date"
                type="date"
                value={filters.toDate || ''}
                onChange={(e) => handleFilterChange('toDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <TextField
                fullWidth
                select
                label="Tour Type"
                value={filters.tourPackageId || ''}
                onChange={(e) => handleFilterChange('tourPackageId', e.target.value ? Number(e.target.value) : undefined)}
              >
                <MenuItem value="">All Tours</MenuItem>
                {tours.map((tour) => (
                  <MenuItem key={tour.id} value={tour.id}>
                    {tour.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <TextField
                fullWidth
                label="Min Group Size"
                type="number"
                value={filters.minGroupSize || ''}
                onChange={(e) => handleFilterChange('minGroupSize', e.target.value ? Number(e.target.value) : undefined)}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <TextField
                fullWidth
                label="Max Group Size"
                type="number"
                value={filters.maxGroupSize || ''}
                onChange={(e) => handleFilterChange('maxGroupSize', e.target.value ? Number(e.target.value) : undefined)}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                disabled={activeFilterCount === 0}
                sx={{ height: '56px' }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Bookings Grid */}
      {bookings.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            {activeFilterCount > 0 ? 'No bookings match your filters' : 'No bookings found'}
          </Typography>
          {activeFilterCount > 0 && (
            <Button sx={{ mt: 2 }} onClick={clearFilters} variant="outlined">
              Clear Filters
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid size={{ xs: 12, md: 6 }} key={booking.id}>
              <BookingCard 
                booking={booking} 
                onDelete={handleDelete} 
                formatTimeSlot={formatTimeSlot} 
              />
            </Grid>
          ))}
        </Grid>
      )}
      
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this booking? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookingList;
