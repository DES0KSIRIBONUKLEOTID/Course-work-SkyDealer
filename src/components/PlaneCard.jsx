import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useAuth } from '../context/AuthContext';

export default function PlaneCard({ plane }) {
  const { favorites, toggleFavorite } = useAuth();
  
  const isFavorite = favorites.includes(plane._id);

  return (
   <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      borderRadius: 4, 
      transition: 'all 0.3s ease',
      maxWidth: 420,  
      width: '100%',  
      mx: 'auto',     
      '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 24px rgba(0,0,0,0.1)' } 
    }}>
      <CardMedia
        component="img"
        height="220"
        image={plane.images?.[0] || "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=400&q=80"}
        alt={plane.title}
      />
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
          {plane.category || "Авіація"} • {plane.year || "N/A"}
        </Typography>
        
        <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 700, mt: 0.5 }}>
          {plane.title}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3, 
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {plane.description}
        </Typography>

        <Typography variant="h6" color="secondary" sx={{ fontWeight: 'bold', mt: 'auto' }}>
          ${plane.price ? plane.price.toLocaleString() : "0"}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 3, pb: 3, pt: 0 }}>
        <Button 
          size="small" 
          variant="contained" 
          component={Link} 
         
          to={`/plane/${plane._id}`}
          sx={{ borderRadius: 2, px: 3 }}
        >
          Детальніше
        </Button>
        
        <Button 
          size="small" 
          color={isFavorite ? "error" : "primary"}
          startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          
          onClick={() => toggleFavorite(plane._id)}
          sx={{ borderRadius: 2 }}
        >
          {isFavorite ? "В обраному" : "В обране"}
        </Button>
      </CardActions>
    </Card>
  );
}