import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', email);
    setError('');
    try {
      await login({ email, password });
      console.log('Login successful');
      navigate('/');
    } catch (err: any) {
      console.error('Login error caught:', err);
      console.error('Error response:', err.response);
      const errorMessage = err.response?.data?.errors 
        ? Object.values(err.response.data.errors).flat().join(', ') 
        : err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      setPassword('');
      console.log('Error set:', errorMessage);
    }
  };

  return (
    <Container maxWidth="sm">
      <BackButton to="/home" label="Back to Home" />
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>Login</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            margin="normal"
            inputProps={{ maxLength: 100 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
            inputProps={{ maxLength: 100 }}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>Login</Button>
          <Button 
            variant="text" 
            fullWidth 
            sx={{ mt: 2 }} 
            onClick={() => navigate('/register')}
          >
            Don't have an account? Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
