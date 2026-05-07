import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, TextField, InputAdornment, Paper, 
  MenuItem, Select, FormControl, InputLabel, Slider, Button, Pagination,
  Checkbox, ListItemText, OutlinedInput, Grid 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import PlaneCard from '../components/PlaneCard';
import { usePlanes } from '../context/PlaneContext';

export default function Home() {
  const { planes } = usePlanes();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("Всі");
  const [sortOrder, setSortOrder] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 500000000]);
  
  // Стан для фільтру виробників
  const [selectedManufacturers, setSelectedManufacturers] = useState([]);
  
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    setPage(1);
  }, [searchTerm, category, priceRange, sortOrder, selectedManufacturers]);

  // Фільтрація
  let filteredPlanes = planes.filter(plane => {
    const matchSearch = plane.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = category === "Всі" || plane.category === category;
    const matchPrice = plane.price >= priceRange[0] && plane.price <= priceRange[1];
    const matchManufacturer = selectedManufacturers.length === 0 || selectedManufacturers.includes(plane.manufacturer);
    return matchSearch && matchCategory && matchPrice && matchManufacturer;
  });

  // Сортування
  if (sortOrder === "price_asc") {
    filteredPlanes.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "price_desc") {
    filteredPlanes.sort((a, b) => b.price - a.price);
  } else if (sortOrder === "newest") {
    filteredPlanes.sort((a, b) => (b.year || 0) - (a.year || 0));
  }

  const totalPages = Math.ceil(filteredPlanes.length / ITEMS_PER_PAGE);
  const currentPlanes = filteredPlanes.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const categories = ["Всі", ...new Set(planes.map(p => p.category).filter(Boolean))];
  const manufacturersList = [...new Set(planes.map(p => p.manufacturer).filter(Boolean))].sort();

  const handleReset = () => {
    setCategory("Всі");
    setPriceRange([0, 500000000]);
    setSearchTerm("");
    setSelectedManufacturers([]);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <Box>
      {/* HERO SECTION */}
      <Box sx={{
        position: 'relative', height: { xs: '40vh', md: '50vh' }, display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundImage: 'url("https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover', backgroundPosition: 'center',
        '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(11, 37, 69, 0.65)', zIndex: 1 }
      }}>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'white' }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
            Ваш Особистий Небосхил
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Знайдіть ідеальний борт серед найкращих пропозицій світу
          </Typography>
        </Container>
      </Box>

      {/* ОСНОВНИЙ КОНТЕНТ */}
      <Container maxWidth="xl" sx={{ mt: -5, position: 'relative', zIndex: 3, mb: 8 }}>
        
        {/* ПАНЕЛЬ ФІЛЬТРІВ */}
        <Paper elevation={6} sx={{ p: 2, mb: 6, borderRadius: '50px', bgcolor: 'white', width: '100%' }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 2, 
            alignItems: 'center',
            width: '100%'
          }}>
            
            {/* 1. Пошук */}
            <Box sx={{ flex: 3, width: '100%' }}>
              <TextField
                fullWidth placeholder="Пошук моделі..." variant="outlined" size="small"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{ 
                  startAdornment: <InputAdornment position="start"><SearchIcon color="primary" /></InputAdornment>,
                  sx: { borderRadius: '30px', bgcolor: '#f8f9fa' } 
                }}
              />
            </Box>

            {/* 2. Клас */}
            <Box sx={{ flex: 2, width: '100%' }}>
              <FormControl fullWidth size="small">
                <InputLabel>Клас</InputLabel>
                <Select 
                  value={category} label="Клас" onChange={(e) => setCategory(e.target.value)}
                  sx={{ borderRadius: '30px', bgcolor: '#f8f9fa' }}
                >
                  {categories.map((cat, index) => (
                    <MenuItem key={index} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* 3. Виробник */}
            <Box sx={{ flex: 2, width: '100%' }}>
              <FormControl fullWidth size="small">
                <InputLabel>Виробник</InputLabel>
                <Select
                  multiple
                  value={selectedManufacturers}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedManufacturers(typeof value === 'string' ? value.split(',') : value);
                  }}
                  input={<OutlinedInput label="Виробник" sx={{ borderRadius: '30px', bgcolor: '#f8f9fa' }} />}
                  renderValue={(selected) => selected.length > 0 ? selected.join(', ') : 'Всі'}
                >
                  {manufacturersList.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={selectedManufacturers.indexOf(name) > -1} color="primary" size="small" />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* 4. Ціна */}
            <Box sx={{ flex: 2.5, width: '100%', px: { xs: 2, md: 3 } }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', justifyContent: 'space-between', mb: -1.5, fontSize: '0.7rem' }}>
                <span>${(priceRange[0] / 1000000).toFixed(0)}M</span>
                <span>${(priceRange[1] / 1000000).toFixed(0)}M</span>
              </Typography>
              <Slider
                value={priceRange} onChange={(e, newValue) => setPriceRange(newValue)}
                valueLabelDisplay="off" min={0} max={500000000} step={5000000} color="secondary"
                size="small"
              />
            </Box>

            {/* 5. Кнопка */}
            <Box sx={{ flex: 1.5, width: '100%' }}>
              <Button 
                variant="outlined" fullWidth onClick={handleReset} startIcon={<TuneIcon />} 
                sx={{ borderRadius: '30px', height: '40px' }}
              >
                Скинути
              </Button>
            </Box>

          </Box>
        </Paper>

        {/* СОРТУВАННЯ ТА КІЛЬКІСТЬ */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#0b2545' }}>
            Знайдено: <span style={{ color: '#d4af37' }}>{filteredPlanes.length}</span>
          </Typography>

          <FormControl sx={{ minWidth: 220 }}>
            <Select size="small" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} sx={{ bgcolor: 'white', borderRadius: 2 }}>
              <MenuItem value="newest">Спочатку нові (за роком)</MenuItem>
              <MenuItem value="price_asc">Від дешевих до дорогих</MenuItem>
              <MenuItem value="price_desc">Від дорогих до дешевих</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* СІТКА ЛІТАКІВ */}
        {currentPlanes.length > 0 ? (
          <>
            <Grid container spacing={4} justifyContent="center">
              {currentPlanes.map((plane) => (
                <Grid item key={plane.id} xs={12} sm={6} md={4} lg={3}>
                  <PlaneCard plane={plane} />
                </Grid>
              ))}
            </Grid>

            {/* ПАГІНАЦІЯ */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" size="large" sx={{ '& .MuiPaginationItem-root': { fontWeight: 'bold' } }} />
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#f8f9fa', borderRadius: 4 }}>
            <Typography variant="h5" color="text.secondary">На жаль, за вашими критеріями нічого не знайдено.</Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={handleReset}>Показати всі літаки</Button>
          </Box>
        )}
        
      </Container>
    </Box>
  );
}