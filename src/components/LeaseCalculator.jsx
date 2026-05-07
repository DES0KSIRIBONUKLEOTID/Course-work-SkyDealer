import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Slider, Paper } from '@mui/material';

export default function LeaseCalculator({ price }) {
  const [deposit, setDeposit] = useState(20); 
  const [term, setTerm] = useState(60); 
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  // Формула розрахунку
  useEffect(() => {
    const principal = price - (price * (deposit / 100)); // Сумма кредиту
    const interestRate = 0.05 / 12; 
    const payment = (principal * interestRate) / (1 - Math.pow(1 + interestRate, -term));
    
    setMonthlyPayment(payment);
  }, [price, deposit, term]);

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4, bgcolor: '#e3f2fd' }}>
      <Typography variant="h5" gutterBottom color="primary">
        Калькулятор Лізингу
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Перший внесок: {deposit}% (${(price * deposit / 100).toLocaleString()})</Typography>
        <Slider
          value={deposit}
          onChange={(e, val) => setDeposit(val)}
          min={10} max={50} step={5}
          valueLabelDisplay="auto"
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Термін лізингу: {term} місяців ({term/12} років)</Typography>
        <Slider
          value={term}
          onChange={(e, val) => setTerm(val)}
          min={12} max={120} step={12}
          marknps
        />
      </Box>

      <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        ${Math.round(monthlyPayment).toLocaleString()} / міс.
      </Typography>
    </Paper>
  );
}