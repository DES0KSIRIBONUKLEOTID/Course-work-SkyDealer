import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = (e) => {
    e.preventDefault();
    
    // Валідація
    if (formData.password !== formData.confirmPassword) {
      alert("Паролі не співпадають!");
      return;
    }
    if (formData.password.length < 4) {
      alert("Пароль має бути не менше 4 символів");
      return;
    }

    // об'єкт користувача
    const newUser = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: 'USER', 
      avatar: "https://mui.com/static/images/avatar/2.jpg"
    };

    // Дістає вже існуючих користувачів 
    const existingUsers = JSON.parse(localStorage.getItem('skydealer_users')) || [];

    // чи немає вже такого email в базі
    const userExists = existingUsers.some(u => u.email === formData.email);
    if (userExists) {
      alert("Користувач з таким email вже існує!");
      return;
    }

    // Додає нового користувача в масив
    existingUsers.push(newUser);

    // Записує оновлений масив назад у Local Storage
    localStorage.setItem('skydealer_users', JSON.stringify(existingUsers));

    // Логінимо користувача в поточному сеансі та перекидаємо на головну
    login(newUser);
    navigate('/'); 
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Реєстрація
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal" required fullWidth label="Ваше Ім'я" name="name" autoFocus
            onChange={handleChange}
          />
          <TextField
            margin="normal" required fullWidth label="Email адреса" name="email" type="email"
            onChange={handleChange}
          />
          <TextField
            margin="normal" required fullWidth label="Пароль" name="password" type="password"
            onChange={handleChange}
          />
          <TextField
            margin="normal" required fullWidth label="Підтвердіть пароль" name="confirmPassword" type="password"
            onChange={handleChange}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Зареєструватися
          </Button>
          <Button component={Link} to="/login" fullWidth color="secondary">
            Вже є акаунт? Увійти
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}