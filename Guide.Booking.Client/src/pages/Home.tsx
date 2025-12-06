import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTours } from '../hooks/useTours';
import { useAuth } from '../context/AuthContext';
import TourCard from '../components/TourCard';

const Home: React.FC = () => {
  const { tours, loading, error } = useTours();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleBookNow = (tourId: number) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/create-booking', { state: { tourId } });
    }
  };

  if (loading) return <Container><Typography>Loading tours...</Typography></Container>;
  if (error) return <Container><Typography color="error">Error: {error}</Typography></Container>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Guide Booking
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Book guided city tours with ease
        </Typography>
      </Box>

      <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 3 }}>
        Available Tours
      </Typography>

      <Grid container spacing={3}>
        {tours.map((tour) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={tour.id}>
            <TourCard tour={tour} onBookNow={handleBookNow} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
