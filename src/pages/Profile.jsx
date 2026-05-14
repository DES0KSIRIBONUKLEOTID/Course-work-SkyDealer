import React, { useRef, useState, useEffect } from 'react'; 
import { 
  Container, Typography, Box, Grid, Avatar, Paper, Divider, Button, 
  IconButton, Badge, Tabs, Tab, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, Rating, Tooltip, Switch, FormControlLabel
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'; 
import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';
import { useAuth } from '../context/AuthContext';
import { usePlanes } from '../context/PlaneContext';
import { useOrders } from '../context/OrderContext';
import PlaneCard from '../components/PlaneCard';
import { Navigate, Link } from 'react-router-dom';

export default function Profile() {
  const { user, favorites, logout, updateUserProfile, updateUserState } = useAuth();
  const { planes } = usePlanes();
  const { orders } = useOrders(); 
  
  const fileInputRef = useRef(null);
  
  const [tabValue, setTabValue] = useState(0);
  const [myComments, setMyComments] = useState([]);
  const [isUploading, setIsUploading] = useState(false); // Стан для завантаження фото

  useEffect(() => {
    if (user) {
      const savedComments = JSON.parse(localStorage.getItem('skydealer_comments')) || [];
      const userComments = savedComments.filter(c => c.userEmail === user.email);
      setMyComments(userComments);
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const favoritePlanes = planes.filter(plane => favorites.includes(plane.id));
  const myOrders = orders.filter(order => order.phone === user.email || order.name === user.name); 

  const handleFileChange = (event) => {
    const file = event.target.files[0]; 
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert("Будь ласка, завантажте файл формату JPG, PNG або WEBP.");
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      alert("Файл занадто великий! Максимальний розмір - 1MB для зберігання в БД.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await updateUserProfile(reader.result);
      } catch (error) {
        alert("Помилка завантаження фото на сервер.");
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteMyComment = (idToDelete) => {
    if (window.confirm("Видалити цей відгук?")) {
      const allComments = JSON.parse(localStorage.getItem('skydealer_comments')) || [];
      const updatedAll = allComments.filter(c => c.id !== idToDelete);
      localStorage.setItem('skydealer_comments', JSON.stringify(updatedAll));
      
      setMyComments(myComments.filter(c => c.id !== idToDelete));
    }
  };

  const handle2FAToggle = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://skydealer-backend.onrender.com/api/auth/2fa/toggle', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        if (updateUserState) {
           updateUserState({ isTwoFactorEnabled: data.isTwoFactorEnabled });
        } else {
           
           window.location.reload(); 
        }
      } else {
        alert("Помилка зміни статусу 2FA");
      }
    } catch (error) {
      console.error(error);
      alert("Помилка з'єднання з сервером");
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'Новий': return <Chip label="Очікує" size="small" sx={{ bgcolor: '#fff3e0', color: '#e65100', fontWeight: 'bold' }} />;
      case 'В роботі': return <Chip label="В обробці" size="small" sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 'bold' }} />;
      case 'Закрито': return <Chip label="Вирішено" size="small" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 'bold' }} />;
      default: return <Chip label={status} size="small" />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Особистий кабінет
      </Typography>

      <Grid container spacing={4} sx={{ mt: 1 }}>
        
        {/* ЛІВА КОЛОНКА (ПРОФІЛЬ) */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 3, position: 'sticky', top: 20 }}>
            
            <Box sx={{ display: 'inline-block', position: 'relative', mb: 2 }}>
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                        <IconButton 
                            onClick={() => fileInputRef.current.click()}
                            disabled={isUploading}
                            sx={{ 
                                bgcolor: 'white', 
                                boxShadow: 2,
                                '&:hover': { bgcolor: '#f0f0f0' },
                                border: '2px solid #0b2545' 
                            }} size="small">
                            <PhotoCameraIcon color={isUploading ? "disabled" : "primary"} fontSize="small" />
                        </IconButton>
                    }
                >
                    <Avatar 
                    src={user.avatar} 
                    sx={{ 
                        width: 120, 
                        height: 120, 
                        border: '4px solid #0b2545',
                        opacity: isUploading ? 0.5 : 1 
                    }} 
                    />
                </Badge>
            </Box>

            <input 
                type="file" 
                hidden 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/jpg, image/webp"
            />
            
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{user.name}</Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>{user.email}</Typography>
            
            <Typography variant="body2" sx={{ bgcolor: '#e3f2fd', color: '#0b2545', display: 'inline-block', px: 2, py: 0.5, borderRadius: 5, mb: 2 }}>
              Роль: {user.role === 'ADMIN' ? 'Адміністратор' : 'Клієнт'}
            </Typography>

            {/* БЛОК 2FA */}
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2, mb: 3, border: '1px solid #e0e0e0', textAlign: 'left' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SecurityIcon sx={{ color: '#0b2545', mr: 1, fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Безпека</Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch 
                    checked={user.isTwoFactorEnabled || false} 
                    onChange={handle2FAToggle} 
                    color="primary" 
                  />
                }
                label={<Typography variant="body2">Двофакторна автентифікація (2FA)</Typography>}
              />
            </Paper>

            <Divider sx={{ mb: 3 }} />
            
            <Button variant="outlined" color="error" fullWidth onClick={logout}>
              Вийти з акаунту
            </Button>
          </Paper>
        </Grid>

        {/* ПРАВА КОЛОНКА (ТАБИ) */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 0, borderRadius: 3, overflow: 'hidden', minHeight: 400 }}>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f8f9fa' }}>
              <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} variant="fullWidth">
                <Tab label={`Обране (${favorites.length})`} sx={{ fontWeight: 'bold' }} />
                <Tab label={`Мої Заявки (${myOrders.length})`} sx={{ fontWeight: 'bold' }} />
                <Tab label={`Відгуки (${myComments.length})`} sx={{ fontWeight: 'bold' }} />
              </Tabs>
            </Box>

            <Box sx={{ p: { xs: 2, md: 4 } }}>
              
              {tabValue === 0 && (
                <>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>Збережені літаки</Typography>
                  {favoritePlanes.length > 0 ? (
                    <Grid container spacing={3}>
                      {favoritePlanes.map(plane => (
                        <Grid item key={plane.id} xs={12} sm={6}>
                          <PlaneCard plane={plane} />
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography color="text.secondary" align="center" sx={{ py: 5 }}>Ви ще не додали жодного літака в обране.</Typography>
                  )}
                </>
              )}

              {tabValue === 1 && (
                <>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>Історія ваших запитів</Typography>
                  {myOrders.length > 0 ? (
                    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                            <TableCell>Дата</TableCell>
                            <TableCell>Літак</TableCell>
                            <TableCell>Статус</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {myOrders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell>{order.date}</TableCell>
                              <TableCell sx={{ fontWeight: 'bold', color: '#0b2545' }}>{order.planeTitle}</TableCell>
                              <TableCell>{getStatusChip(order.status)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography color="text.secondary" align="center" sx={{ py: 5 }}>У вас поки немає активних заявок на огляд літаків.</Typography>
                  )}
                </>
              )}

              {tabValue === 2 && (
                <>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>Ваші коментарі</Typography>
                  {myComments.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {myComments.map((comment) => (
                        <Paper key={comment.id} elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle2" color="text.secondary">
                                Для літака (ID: {comment.planeId})
                              </Typography>
                              {comment.rating && <Rating value={comment.rating} readOnly size="small" />}
                            </Box>
                            <Tooltip title="Видалити відгук">
                              <IconButton size="small" color="error" onClick={() => handleDeleteMyComment(comment.id)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                          <Typography variant="body1">{comment.text}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>{comment.date}</Typography>
                        </Paper>
                      ))}
                    </Box>
                  ) : (
                    <Typography color="text.secondary" align="center" sx={{ py: 5 }}>Ви ще не залишили жодного відгуку.</Typography>
                  )}
                </>
              )}

            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}