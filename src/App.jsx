import React from 'react';
import { Routes, Route, BrowserRouter, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import { AnimatePresence, motion } from 'framer-motion'; 

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';


import Home from './pages/Home';
import PlaneDetails from './pages/PlaneDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import Footer from './components/Footer'; 
import ProtectedRoute from './components/ProtectedRoute'; 

import { AuthProvider, useAuth } from './context/AuthContext';
import { PlaneProvider } from './context/PlaneContext';
import { OrderProvider } from './context/OrderContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0b2545', 
      dark: '#081c36',
    },
    secondary: {
      main: '#d4af37', 
    },
    background: {
      default: '#f8f9fa', 
    }
  },
  typography: {
    fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 700, letterSpacing: '-0.5px' },
    h4: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 }, 
  },
  shape: {
    borderRadius: 12, 
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { boxShadow: 'none', '&:hover': { boxShadow: '0px 4px 10px rgba(0,0,0,0.15)' } }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: { background: 'rgba(11, 37, 69, 0.95)', backdropFilter: 'blur(10px)' } 
      }
    }
  }
});

function Header() {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <FlightTakeoffIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}>
          SkyDealer
        </Typography>

        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user.role === 'ADMIN' && (
              <Button color="inherit" component={Link} to="/admin" sx={{ border: '1px solid white' }}>
                Адмін-панель
              </Button>
            )}
            
            <Avatar src={user.avatar} alt={user.name} sx={{ width: 32, height: 32 }} />
            <Typography 
              variant="subtitle1" 
              component={Link} 
              to="/profile" 
              sx={{ textDecoration: 'none', color: 'white', '&:hover': { color: '#d4af37' } }}
            >
                {user.name} ({user.role === 'ADMIN' ? 'Admin' : 'User'})
            </Typography>
            <Button color="inherit" onClick={logout}>Вийти</Button>
          </Box>
        ) : (
          <Button color="inherit" component={Link} to="/login">Вхід</Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

// --- КОМПОНЕНТ ДЛЯ АНІМАЦІЇ КОЖНОЇ СТОРІНКИ ---
const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }}  
      exit={{ opacity: 0, y: -15 }}   
      transition={{ duration: 0.4, ease: "easeOut" }} 
    >
      {children}
    </motion.div>
  );
};

// --- ОКРЕМИЙ БЛОК ДЛЯ РОУТІВ З АНІМАЦІЄЮ ---
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/plane/:id" element={<PageWrapper><PlaneDetails /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
        
        {/* ЗАХИЩЕНИЙ МАРШРУТ (ТІЛЬКИ АДМІН) */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <PageWrapper><AdminPanel /></PageWrapper>
          </ProtectedRoute>
        } />
        
        {/* ЗАХИЩЕНИЙ МАРШРУТ */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <PageWrapper><Profile /></PageWrapper>
          </ProtectedRoute>
        } />
        
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <AuthProvider>
        <PlaneProvider> 
          <OrderProvider>
            <BrowserRouter>
              <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Header />
                <Box sx={{ flex: 1, overflowX: 'hidden' }}> {/* overflowX прибирає можливі горизонтальні скроли під час анімації */}
                  <AnimatedRoutes />
                </Box>
                <Footer />
              </Box>
            </BrowserRouter>
          </OrderProvider>
        </PlaneProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;