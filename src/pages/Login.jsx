import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, Alert, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import emailjs from '@emailjs/browser'; 

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  const [step, setStep] = useState(1); 
  const [generatedCode, setGeneratedCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [tempUser, setTempUser] = useState(null); 

  const handleInitialLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Шукає користувачів
    const savedUsers = JSON.parse(localStorage.getItem('users')) || JSON.parse(localStorage.getItem('skydealer_users')) || [];
    
    let userToLogin = savedUsers.find(u => u.email === email && u.password === password);
    
    // Адмін
    if (email === 'admin@gmail.com' && password === 'admin123' || email === 'admin' && password === 'admin') {
       userToLogin = { email: 'admin@gmail.com', name: 'admin', role: 'ADMIN', avatar: '' };
    }

    if (userToLogin) {
      setTempUser(userToLogin);
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);

      // --- КЛЮЧІ З EMAILJS ---
      const serviceId = 'service_tfnxhnd';    
      const templateId = 'template_cj4cb7p';  
      const publicKey = 'lEpA9kmUJv0S4L6gQ';    

      const templateParams = {
        to_email: email, 
        to_name: userToLogin.name || 'Клієнт',
        code: code
      };

      // Відправляємо реальний лист!
      emailjs.send(serviceId, templateId, templateParams, publicKey)
        .then((response) => {
          console.log('Лист відправлено!', response.status, response.text);
          setStep(2); // Перемикаємо на крок 2
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Помилка відправки:', err);
          setError('Помилка сервера пошти. Перевір ключі EmailJS у коді!');
          setIsLoading(false);
        });

    } else {
      setError('Невірний email або пароль!');
      setIsLoading(false);
    }
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    if (inputCode === generatedCode) {
      login(tempUser); 
      navigate('/profile');
    } else {
      setError('❌ Невірний код підтвердження! Спробуйте ще раз.');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10, mb: 10 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 4, bgcolor: 'white' }}>
        
        {step === 1 && (
          <Box component="form" onSubmit={handleInitialLogin}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <LockIcon color="primary" sx={{ fontSize: 50, mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#0b2545' }}>Вхід у систему</Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <TextField
              fullWidth label="Email" variant="outlined" margin="normal"
              value={email} onChange={(e) => setEmail(e.target.value)} required
              InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment> }}
            />
            <TextField
              fullWidth label="Пароль" type={showPassword ? 'text' : 'password'} variant="outlined" margin="normal"
              value={password} onChange={(e) => setPassword(e.target.value)} required
              InputProps={{
                startAdornment: <InputAdornment position="start"><VpnKeyIcon color="action" /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button 
              type="submit" fullWidth variant="contained" size="large" 
              disabled={isLoading}
              sx={{ mt: 3, mb: 2, borderRadius: 2 }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Увійти'}
            </Button>
            <Typography variant="body2" align="center" color="text.secondary">
              Немає акаунту? <Link to="/register" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 'bold' }}>Зареєструватись</Link>
            </Typography>
          </Box>
        )}

        {step === 2 && (
          <Box component="form" onSubmit={handleVerifyCode}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <MarkEmailReadIcon color="secondary" sx={{ fontSize: 60, mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#0b2545' }}>Двофакторна авторизація</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Ми відправили 6-значний код на вашу адресу: <br/> <strong>{email}</strong>
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <TextField
              fullWidth variant="outlined" margin="normal"
              placeholder="000000"
              value={inputCode} onChange={(e) => setInputCode(e.target.value)}
              inputProps={{ 
                maxLength: 6, 
                style: { textAlign: 'center', letterSpacing: '12px', fontSize: '2rem', fontWeight: 'bold', color: '#0b2545' } 
              }}
              required autoFocus
            />

            <Button type="submit" fullWidth variant="contained" color="secondary" size="large" sx={{ mt: 3, mb: 2, borderRadius: 2 }}>
              Підтвердити та увійти
            </Button>
            
            <Button fullWidth variant="text" color="inherit" onClick={() => { setStep(1); setInputCode(''); setError(''); }}>
              Повернутися назад
            </Button>
          </Box>
        )}

      </Paper>
    </Container>
  );
}