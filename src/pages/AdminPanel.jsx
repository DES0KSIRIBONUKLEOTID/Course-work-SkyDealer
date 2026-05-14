import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, IconButton, Box, Dialog, DialogTitle, 
  DialogContent, TextField, DialogActions, Tabs, Tab, Select, MenuItem, Rating, Tooltip 
} from '@mui/material'; 
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import { usePlanes } from '../context/PlaneContext'; 
import { useOrders } from '../context/OrderContext';

export default function AdminPanel() {
  const { planes, deletePlane, addPlane, updatePlane } = usePlanes();
  const { orders, updateOrderStatus, deleteOrder } = useOrders();
  
  const [tabValue, setTabValue] = useState(0); 
  const [comments, setComments] = useState([]);
  const [viewComment, setViewComment] = useState(null);

  // Стейт для додавання/редагування літаків
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [planeData, setPlaneData] = useState({ title: '', price: '', images: [], description: '', category: '' });

  useEffect(() => {
    const savedComments = localStorage.getItem('skydealer_comments');
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, []);

  const handleDeleteComment = (idToDelete) => {
    if (window.confirm("Ви дійсно хочете видалити цей коментар?")) {
      const updatedComments = comments.filter(c => c.id !== idToDelete);
      setComments(updatedComments);
      localStorage.setItem('skydealer_comments', JSON.stringify(updatedComments));
    }
  };

  const handleDeleteAllByUser = (userEmail, userName) => {
    if (window.confirm(`🛑 АНТИ-СПАМ: Ви дійсно хочете видалити ВСІ відгуки від користувача ${userName} (${userEmail})?`)) {
      const updatedComments = comments.filter(c => c.userEmail !== userEmail);
      setComments(updatedComments);
      localStorage.setItem('skydealer_comments', JSON.stringify(updatedComments));
    }
  };

  // ФУНКЦІЯ: Збереження або Оновлення літака
  const handleSavePlane = () => {
    if (!planeData.title || !planeData.price) {
      alert("Заповніть обов'язкові поля: Назва та Ціна!");
      return;
    }

    const planeToSave = {
      ...planeData,
      price: Number(planeData.price),
      images: planeData.images?.length > 0 ? planeData.images : ["https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=80"]
    };

    if (isEditing) {
      updatePlane({ ...planeToSave, _id: currentId });
    } else {
      addPlane(planeToSave);
    }
    setOpen(false); 
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 10 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 'bold' }}>Панель керування</Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)}>
          <Tab label={`Літаки (${planes.length})`} />
          <Tab label={`Заявки (${orders.length})`} />
          <Tab label={`Відгуки (${comments.length})`} />
        </Tabs>
      </Box>

      {/* ВКЛАДКА 1: ЛІТАКИ */}
      {tabValue === 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              color="success" 
              onClick={() => { 
                setIsEditing(false); 
                setPlaneData({title:'', price:'', images:[], description:'', category:''}); 
                setOpen(true); 
              }}
            >
              Додати літак
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell>ID</TableCell>
                  <TableCell>Фото</TableCell>
                  <TableCell>Назва</TableCell>
                  <TableCell>Ціна</TableCell>
                  <TableCell align="right">Дії</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {planes.map((plane) => (
                  <TableRow key={plane._id || plane.id}>
                    <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                      {plane._id}
                    </TableCell>
                    <TableCell>
                      <img 
                        src={plane.images && plane.images.length > 0 ? plane.images[0] : "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=50&q=80"} 
                        alt="plane" 
                        style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} 
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{plane.title}</TableCell>
                    <TableCell>${plane.price ? plane.price.toLocaleString() : "0"}</TableCell>
                    <TableCell align="right">
                      <IconButton 
                        color="primary" 
                        onClick={() => { 
                          setIsEditing(true); 
                          setCurrentId(plane._id); 
                          setPlaneData(plane); 
                          setOpen(true); 
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => deletePlane(plane._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* ВКЛАДКА 2: ЗАЯВКИ */}
      {tabValue === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell>Дата</TableCell>
                <TableCell>Клієнт</TableCell>
                <TableCell>Літак</TableCell>
                <TableCell>Контакти</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell align="right">Дії</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id || order.id}>
                  <TableCell variant="body2">{order.date}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{order.name}</TableCell>
                  <TableCell>{order.planeTitle}</TableCell>
                  <TableCell>{order.phone}</TableCell>
                  <TableCell>
                    <Select 
                      size="small" value={order.status} 
                      onChange={(e) => updateOrderStatus(order._id || order.id, e.target.value)} sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="Новий">Новий</MenuItem>
                      <MenuItem value="В роботі">В роботі</MenuItem>
                      <MenuItem value="Закрито">Закрито</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="error" onClick={() => deleteOrder(order._id || order.id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ВКЛАДКА 3: ВІДГУКИ */}
      {tabValue === 2 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell>Дата</TableCell>
                <TableCell>Користувач</TableCell>
                <TableCell>ID Літака</TableCell>
                <TableCell>Оцінка</TableCell>
                <TableCell>Відгук</TableCell>
                <TableCell align="center">Дії</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <TableRow key={comment._id || comment.id}>
                    <TableCell variant="body2">{comment.date}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{comment.userName}</TableCell>
                    <TableCell>{comment.planeId}</TableCell>
                    <TableCell>
                      {comment.rating ? <Rating value={comment.rating} readOnly size="small" /> : '-'}
                    </TableCell>
                    <TableCell 
                      sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer', color: '#0b2545' }}
                      onClick={() => setViewComment(comment)}
                    >
                      {comment.text}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Читати повністю">
                        <IconButton color="info" onClick={() => setViewComment(comment)}><VisibilityIcon /></IconButton>
                      </Tooltip>
                      <Tooltip title="Видалити 1 відгук">
                        <IconButton color="error" onClick={() => handleDeleteComment(comment._id || comment.id)}><DeleteIcon /></IconButton>
                      </Tooltip>
                      <Tooltip title="Анти-спам: Видалити ВСІ відгуки цього користувача">
                        <IconButton color="warning" onClick={() => handleDeleteAllByUser(comment.userEmail, comment.userName)}><BlockIcon /></IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">Коментарів поки немає.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* МОДАЛЬНЕ ВІКНО ДЛЯ ПЕРЕГЛЯДУ КОМЕНТАРІВ */}
      <Dialog open={!!viewComment} onClose={() => setViewComment(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 'bold', pb: 1 }}>
          Відгук від {viewComment?.userName}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">Оцінка:</Typography>
            <Rating value={viewComment?.rating || 0} readOnly size="small" />
          </Box>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line', fontSize: '1.1rem' }}>
            {viewComment?.text}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setViewComment(null)} variant="contained" sx={{ borderRadius: 2 }}>
            Закрити
          </Button>
        </DialogActions>
      </Dialog>

      {/* МОДАЛЬНЕ ВІКНО ДОДАВАННЯ/РЕДАГУВАННЯ ЛІТАКА */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {isEditing ? 'Редагувати літак' : 'Додати новий літак'}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField 
              label="Назва літака *" 
              fullWidth 
              value={planeData.title || ''} 
              onChange={(e) => setPlaneData({...planeData, title: e.target.value})} 
            />
            <TextField 
              label="Ціна ($) *" 
              type="number" 
              fullWidth 
              value={planeData.price || ''} 
              onChange={(e) => setPlaneData({...planeData, price: e.target.value})} 
            />
            <TextField 
              label="Категорія" 
              fullWidth 
              value={planeData.category || ''} 
              onChange={(e) => setPlaneData({...planeData, category: e.target.value})} 
            />
            <TextField 
              label="Посилання на головне фото (URL)" 
              fullWidth 
              value={planeData.images && planeData.images.length > 0 ? planeData.images[0] : ''} 
              onChange={(e) => {
                const newImages = [...(planeData.images || [])];
                newImages[0] = e.target.value;
                setPlaneData({...planeData, images: newImages});
              }} 
            />
            <TextField 
              label="Опис" 
              multiline 
              rows={4} 
              fullWidth 
              value={planeData.description || ''} 
              onChange={(e) => setPlaneData({...planeData, description: e.target.value})} 
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit" sx={{ fontWeight: 'bold' }}>Скасувати</Button>
          <Button onClick={handleSavePlane} variant="contained" color="success" sx={{ borderRadius: 2 }}>
            Зберегти
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
}