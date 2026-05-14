import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Container, Typography, Button, Box, Grid, Paper, Table, TableBody, 
  TableCell, TableContainer, TableRow, Divider, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, Chip, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { usePlanes } from '../context/PlaneContext'; 
import { useOrders } from '../context/OrderContext';
import CommentsSection from '../components/CommentsSection';
import LeaseCalculator from '../components/LeaseCalculator';
import PlaneCard from '../components/PlaneCard'; 

export default function PlaneDetails() {
  const { id } = useParams();
  const { planes } = usePlanes(); 
  const { addOrder } = useOrders();

  const plane = planes.find(p => String(p._id) === String(id));

  const [currentImage, setCurrentImage] = useState("");
  const [openOrder, setOpenOrder] = useState(false);
  const [orderData, setOrderData] = useState({ name: '', phone: '', message: '' });
  
  // Стейт для перемикача валют
  const [currency, setCurrency] = useState('USD');
  const exchangeRate = 0.92; 

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
    if (plane) {
      setCurrentImage(plane.images && plane.images.length > 0 ? plane.images[0] : plane.image);
    }
  }, [plane, id]); 

  if (!plane) {
    return (
      <Container sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h4">Літак не знайдено 😢</Typography>
        <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>На головну</Button>
      </Container>
    );
  }

  const similarPlanes = planes
    .filter(p => p.category === plane.category && p._id !== plane._id) 
    .slice(0, 3); 

  const handleSendOrder = () => {
    if (!orderData.name || !orderData.phone) return alert("Введіть ім'я та телефон.");
    addOrder({ ...orderData, planeTitle: plane.title, planeId: plane._id });
    alert("Заявку надіслано!");
    setOpenOrder(false);
    setOrderData({ name: '', phone: '', message: '' });
  };

  const handleCurrencyChange = (event, newCurrency) => {
    if (newCurrency !== null) {
      setCurrency(newCurrency);
    }
  };

  // Розрахунок ціни залежно від обраної валюти
  const displayPrice = currency === 'USD' ? plane.price : Math.round(plane.price * exchangeRate);
  const currencySymbol = currency === 'USD' ? '$' : '€';

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 10 }}>
        <Button component={Link} to="/" variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
            ← Назад до каталогу
        </Button>
        
        {/* ГАЛЕРЕЯ ФОТОГРАФІЙ */}
        <Box sx={{ mb: 4 }}>
          <Box component="img" src={currentImage || "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=1200&q=80"} alt={plane.title} sx={{ width: '100%', borderRadius: 4, height: { xs: 300, md: 500 }, objectFit: 'cover', boxShadow: 3, mb: 2, transition: 'opacity 0.3s ease-in-out' }} />
          {plane.images && plane.images.length > 1 && (
            <Grid container spacing={2}>
              {plane.images.map((img, index) => (
                <Grid item key={index} xs={4} sm={2}>
                  <Box component="img" src={img} onClick={() => setCurrentImage(img)} sx={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 2, cursor: 'pointer', border: currentImage === img ? '3px solid #d4af37' : '2px solid transparent', opacity: currentImage === img ? 1 : 0.6, transition: 'all 0.2s', '&:hover': { opacity: 1 } }} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
        
        <Grid container spacing={5} sx={{ mt: 1 }}>
          {/* ЛІВА КОЛОНКА */}
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 700, color: '#0b2545' }}>{plane.title}</Typography>
              {/* ДОДАНО: Статус */}
              <Chip label={plane.status || 'В наявності'} color={plane.status === 'Продано' ? 'error' : 'success'} sx={{ fontWeight: 'bold' }} />
            </Box>
            
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>{plane.manufacturer} • {plane.year} • {plane.category}</Typography>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Огляд</Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', whiteSpace: 'pre-line', color: 'text.secondary', lineHeight: 1.8 }}>{plane.description}</Typography>

            {plane.specs && (
              <Box sx={{ mt: 5 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>Технічні характеристики</Typography>
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3 }}>
                  <Table sx={{ minWidth: 300 }}>
                    <TableBody>
                      <TableRow><TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa', width: '40%' }}>Максимальна швидкість</TableCell><TableCell>{plane.specs.speed || 'N/A'}</TableCell></TableRow>
                      <TableRow><TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>Дальність польоту</TableCell><TableCell>{plane.specs.range || 'N/A'}</TableCell></TableRow>
                      <TableRow><TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>Висота польоту (стеля)</TableCell><TableCell>{plane.specs.altitude || 'N/A'}</TableCell></TableRow>
                      <TableRow><TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>Пасажиромісткість</TableCell><TableCell>{plane.specs.passengers || 'N/A'}</TableCell></TableRow>
                      <TableRow><TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>Двигуни</TableCell><TableCell>{plane.specs.engines || 'N/A'}</TableCell></TableRow>
                      <TableRow><TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8f9fa' }}>Вантажний відсік</TableCell><TableCell>{plane.specs.cargo || 'N/A'}</TableCell></TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Grid>

          {/* ПРАВА КОЛОНКА */}
          <Grid item xs={12} md={5}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4, position: 'sticky', top: 20 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" color="text.secondary">Вартість борту</Typography>
                
                {/* Конвертер валют */}
                <ToggleButtonGroup
                  value={currency}
                  exclusive
                  onChange={handleCurrencyChange}
                  size="small"
                  color="primary"
                >
                  <ToggleButton value="USD" sx={{ fontWeight: 'bold' }}>$</ToggleButton>
                  <ToggleButton value="EUR" sx={{ fontWeight: 'bold' }}>€</ToggleButton>
                </ToggleButtonGroup>
              </Box>
              
              <Typography variant="h3" color="secondary" sx={{ fontWeight: 'bold', mb: 3 }}>
                {currencySymbol}{displayPrice.toLocaleString()}
              </Typography>
              
              <Button onClick={() => setOpenOrder(true)} variant="contained" size="large" fullWidth sx={{ py: 1.5, borderRadius: 2, fontSize: '1.1rem' }}>Зв'язатися з продавцем</Button>
              <LeaseCalculator price={plane.price} />
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6 }} />

       {/* --- СХОЖІ ПРОПОЗИЦІЇ --- */}
        {similarPlanes.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: '#0b2545' }}>
              Схожі пропозиції
            </Typography>
            
            <Box 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: 3 
              }}
            >
              {similarPlanes.map(similarPlane => (
                <Box key={similarPlane._id} sx={{ width: '100%', minWidth: 0, overflow: 'hidden' }}>
                  <PlaneCard plane={similarPlane} />
                </Box>
              ))}
            </Box>
            
            <Divider sx={{ mt: 6 }} />
          </Box>
        )}

        <CommentsSection planeId={plane._id} />

        {/* МОДАЛЬНЕ ВІКНО ЗАЯВКИ */}
        <Dialog open={openOrder} onClose={() => setOpenOrder(false)} fullWidth maxWidth="xs">
          <DialogTitle sx={{ fontWeight: 'bold' }}>Заявка на огляд</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, mt: 1 }}>
              Ви залишаєте заявку на літак: <strong>{plane.title}</strong>
            </Typography>
            <TextField autoFocus margin="dense" label="Ваше ім'я *" fullWidth variant="outlined" value={orderData.name} onChange={(e) => setOrderData({...orderData, name: e.target.value})} />
            <TextField margin="dense" label="Номер телефону *" fullWidth variant="outlined" value={orderData.phone} onChange={(e) => setOrderData({...orderData, phone: e.target.value})} />
            <TextField margin="dense" label="Повідомлення (необов'язково)" fullWidth multiline rows={3} variant="outlined" value={orderData.message} onChange={(e) => setOrderData({...orderData, message: e.target.value})} />
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button onClick={() => setOpenOrder(false)} color="inherit" sx={{ fontWeight: 'bold' }}>Скасувати</Button>
            <Button onClick={handleSendOrder} variant="contained" color="primary" sx={{ borderRadius: 2 }}>Надіслати заявку</Button>
          </DialogActions>
        </Dialog>
        
    </Container>
  );
}