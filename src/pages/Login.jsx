import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Alert } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/'); // Успішно увійшли - перекидаємо на головну сторінку
    } else {
      setError(result.error); // Показує помилку від сервера
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10, mb: 10 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center', color: '#0b2545' }}>
          Вхід у SkyDealer
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField 
            label="Email" 
            fullWidth 
            required 
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField 
            label="Пароль" 
            type="password" 
            fullWidth 
            required 
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            size="large" 
            sx={{ mt: 3, mb: 2, borderRadius: 2 }}
          >
            Увійти
          </Button>
        </Box>
        <Typography textAlign="center" variant="body2" color="text.secondary">
          Немає акаунту? <Link to="/register" style={{ color: '#d4af37', fontWeight: 'bold', textDecoration: 'none' }}>Зареєструватися</Link>
        </Typography>
      </Paper>
    </Container>
  );
}