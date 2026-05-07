import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Avatar, IconButton, Paper, Rating } from '@mui/material'; // <--- ДОДАЛИ Rating сюди
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { useAuth } from '../context/AuthContext';

export default function CommentsSection({ planeId }) {
  const { user } = useAuth();
  
  const [allComments, setAllComments] = useState(() => {
    const saved = localStorage.getItem('skydealer_comments');
    return saved ? JSON.parse(saved) : [];
  });

  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);

  useEffect(() => {
    localStorage.setItem('skydealer_comments', JSON.stringify(allComments));
  }, [allComments]);

  const planeComments = allComments.filter(c => c.planeId === planeId);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    if (!user) return alert("Будь ласка, увійдіть в систему, щоб залишити коментар!");

    // --- АНТИ-СПАМ: Обмеження 1 коментар на 60 секунд ---
    const lastCommentTime = localStorage.getItem('last_comment_time');
    const now = Date.now();
    if (lastCommentTime && now - parseInt(lastCommentTime) < 60000) { 
      const timeLeft = Math.ceil((60000 - (now - parseInt(lastCommentTime))) / 1000);
      return alert(`🛑 Анти-спам: Зачекайте ще ${timeLeft} секунд перед тим, як залишити наступний відгук!`);
    }
    // ----------------------------------------------------

    const commentObj = {
      id: Date.now(),
      planeId: planeId,
      userEmail: user.email,
      userName: user.name,
      userAvatar: user.avatar,
      text: newComment,
      rating: newRating,
      date: new Date().toLocaleString('uk-UA', { 
        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
      })
    };

    setAllComments([...allComments, commentObj]);
    setNewComment("");
    setNewRating(5); 
    
    // Запам'ятовує час останнього коментаря
    localStorage.setItem('last_comment_time', now.toString()); 
  };

  const handleDelete = (idToDelete) => {
    if (window.confirm("Ви дійсно хочете видалити цей коментар?")) {
      setAllComments(allComments.filter(c => c.id !== idToDelete));
    }
  };

  return (
    <Box sx={{ mt: 6, p: { xs: 2, md: 4 }, bgcolor: '#f8f9fa', borderRadius: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4, color: '#0b2545' }}>
        Відгуки ({planeComments.length})
      </Typography>

      {/* --- ФОРМА ДОДАВАННЯ КОМЕНТАРЯ --- */}
      <Box sx={{ display: 'flex', gap: 2, mb: 5, alignItems: 'flex-start' }}>
        <Avatar src={user ? user.avatar : ""} sx={{ width: 48, height: 48, border: '2px solid #fff', boxShadow: 1 }} />
        <Box sx={{ flexGrow: 1 }}>
          
          {/* Блок із зірочками */}
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, ml: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1.5, fontWeight: 'bold' }}>
                Ваша оцінка борту:
              </Typography>
              <Rating 
                value={newRating} 
                onChange={(event, newValue) => {
                  setNewRating(newValue); 
                }} 
              />
            </Box>
          )}

          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder={user ? "Що ви думаєте про цей борт?" : "Увійдіть, щоб залишити відгук..."}
            variant="outlined"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!user}
            sx={{ bgcolor: 'white', borderRadius: 1 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Button 
              variant="contained" 
              endIcon={<SendIcon />} 
              onClick={handleAddComment}
              disabled={!user || !newComment.trim() || !newRating} // Не даємо відправити без оцінки
              sx={{ borderRadius: 2 }}
            >
              Надіслати
            </Button>
          </Box>
        </Box>
      </Box>

      {/* --- СПИСОК КОМЕНТАРІВ --- */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {planeComments.length > 0 ? (
          planeComments.map((comment) => {
            const canDelete = user && (user.role === 'ADMIN' || user.email === comment.userEmail);

            return (
              <Paper key={comment.id} elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e0e0e0', bgcolor: 'white' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Avatar src={comment.userAvatar} sx={{ width: 40, height: 40 }} />
                  
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      
                      {/* Ім'я + Зірочки */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                          {comment.userName}
                          {comment.userName === 'admin' && (
                             <Typography component="span" sx={{ bgcolor: '#d4af37', color: 'white', px: 1, py: 0.2, borderRadius: 1, fontSize: '0.7rem', ml: 1 }}>ADMIN</Typography>
                          )}
                        </Typography>
                        
                        {/* Виводимо зірочки */}
                        {comment.rating && (
                          <Rating value={comment.rating} readOnly size="small" />
                        )}
                      </Box>
                      
                      {canDelete && (
                        <IconButton size="small" color="error" onClick={() => handleDelete(comment.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                    
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      {comment.date}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                      {comment.text}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            );
          })
        ) : (
          <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 3 }}>
            Поки що немає відгуків. Станьте першим!
          </Typography>
        )}
      </Box>
    </Box>
  );
}