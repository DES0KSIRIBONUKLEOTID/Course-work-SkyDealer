import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Alert } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Перевірка паролів
    if (password !== confirmPassword) {
      return setError('Паролі не співпадають!');
    }

    try {
      const response = await fetch('https://skydealer-backend.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        const loginResult = await login(email, password);
        if (loginResult.success) {
          navigate('/'); 
        } else {
          navigate('/login'); 
        }
      } else {
        setError(data.error || 'Помилка реєстрації');
      }
    } catch (err) {
      setError('Помилка підключення до сервера');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10, mb: 10 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center', color: '#0b2545' }}>
          Реєстрація
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField 
            label="Ваше ім'я" 
            fullWidth 
            required 
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField 
            label="Email" 
            type="email"
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
          <TextField 
            label="Підтвердіть пароль" 
            type="password" 
            fullWidth 
            required 
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            size="large" 
            sx={{ mt: 3, mb: 2, borderRadius: 2 }}
          >
            Зареєструватися
          </Button>
        </Box>
        <Typography textAlign="center" variant="body2" color="text.secondary">
          Вже є акаунт? <Link to="/login" style={{ color: '#d4af37', fontWeight: 'bold', textDecoration: 'none' }}>Увійти</Link>
        </Typography>
      </Paper>
    </Container>
  );
}