import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Alert } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import emailjs from '@emailjs/browser'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState(''); 
  const [needs2FA, setNeeds2FA] = useState(false); 
  const [generatedCode, setGeneratedCode] = useState(''); 
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    if (needs2FA) {
      if (code === generatedCode) {

        const result = await login(email, password, code);
        if (result.success) {
          navigate('/');
        } else {
          setError(result.error);
        }
      } else {
        setError('Невірний код 2FA!');
      }
      return; 
    }

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/');
    } else if (result.requires2FA) {
      setNeeds2FA(true); 
      
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(newCode); 

      try {
        await emailjs.send(
          'service_tfnxhnd',     
          'template_cj4cb7p',    
          {
            to_email: email,      
            code: newCode        
          },
          'lEpA9kmUJv0S4L6gQ'       
        );
        
        setSuccessMsg('Код відправлено на вашу пошту!');
      } catch (err) {
        console.error('Помилка EmailJS:', err);
        setError('Не вдалося відправити код на пошту.');
      }

    } else {
      setError(result.error);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10, mb: 10 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center', color: '#0b2545' }}>
          Вхід у SkyDealer
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
        {!successMsg && needs2FA && <Alert severity="info" sx={{ mb: 2 }}>Введіть код двофакторної автентифікації</Alert>}
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField 
            label="Email" 
            fullWidth required margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={needs2FA} 
          />
          <TextField 
            label="Пароль" 
            type="password" 
            fullWidth required margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={needs2FA} 
          />
          
          {needs2FA && (
            <TextField 
              label="Код 2FA" 
              fullWidth required margin="normal"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoFocus
            />
          )}

          <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 3, mb: 2, borderRadius: 2 }}>
            {needs2FA ? 'Підтвердити код' : 'Увійти'}
          </Button>
        </Box>
        <Typography textAlign="center" variant="body2" color="text.secondary">
          Немає акаунту? <Link to="/register" style={{ color: '#d4af37', fontWeight: 'bold', textDecoration: 'none' }}>Зареєструватися</Link>
        </Typography>
      </Paper>
    </Container>
  );
}