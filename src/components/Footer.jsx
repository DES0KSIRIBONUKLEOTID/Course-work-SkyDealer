import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function Footer() {
  return (
    <Box sx={{ bgcolor: '#0b2545', color: 'white', pt: 6, pb: 3, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          
          {/* КОЛОНКА 1: Про компанію */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FlightTakeoffIcon sx={{ color: '#d4af37', fontSize: 32, mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
                SkyDealer
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.8 }}>
              Провідний маркетплейс приватної авіації. Ми допомагаємо знайти ідеальний борт, що відповідає вашим найвищим стандартам комфорту, безпеки та стилю. 
            </Typography>
          </Grid>

          {/* КОЛОНКА 2: Швидкі посилання */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#d4af37' }}>
              Навігація
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/" color="inherit" underline="hover" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Головна сторінка</Link>
              <Link href="/profile" color="inherit" underline="hover" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Особистий кабінет</Link>
              <Link href="/login" color="inherit" underline="hover" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Авторизація</Link>
              <Link href="#" color="inherit" underline="hover" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Умови лізингу</Link>
            </Box>
          </Grid>

          {/* КОЛОНКА 3: Контакти */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#d4af37' }}>
              Контакти
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
              📍 Baranov Danil, Khmelnytskyi, Ukraine
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
              📞 +380 97 111 2233
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
              ✉️ vip@skydealer.com
            </Typography>
            
            {/* Соціальні мережі */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: '#d4af37' } }}>
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: '#d4af37' } }}>
                <InstagramIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: '#d4af37' } }}>
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: '#d4af37' } }}>
                <LinkedInIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

        </Grid>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 3 }} />

        {/* Копірайт */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            &copy; {new Date().getFullYear()} SkyDealer Private Jets. Всі права захищено.
          </Typography>
        </Box>

      </Container>
    </Box>
  );
}