import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/user/userSlice';
import { addToCart } from '../features/order/orderSlice';
import axios from '../utils/api';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Rating,
  Chip,
  TextField,
  Divider,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  LocalShipping,
  ArrowBack,
  Edit,
  Delete
} from '@mui/icons-material';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [favorite, setFavorite] = useState(false);

  // טעינת נתוני המוצר
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/products/${productId}`);
        setProduct(response.data);
      } catch (err) {
        setError('שגיאה בטעינת המוצר');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // טיפול בשינוי כמות
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 999)) {
      setQuantity(value);
    }
  };

  // הוספה לסל
  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ product, quantity }));
      // ניתן להוסיף הודעת הצלחה כאן
    }
  };

  // חזרה לדף הקודם
  const handleGoBack = () => {
    navigate(-1);
  };

  // מחיקת מוצר (עבור מנהל)
  const handleDeleteProduct = async () => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק מוצר זה?')) {
      try {
        await axios.delete(`/products/${productId}`);
        navigate('/admin');
      } catch (err) {
        setError('שגיאה במחיקת המוצר');
        console.error('Error deleting product:', err);
      }
    }
  };

  // עריכת מוצר (עבור מנהל)
  const handleEditProduct = () => {
    navigate(`/admin/edit-product/${productId}`);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          {error || 'המוצר אינו קיים או לא נמצא'}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleGoBack}
          sx={{ mt: 2 }}
        >
          חזרה לרשימת המוצרים
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={handleGoBack}
        sx={{ mb: 2 }}
      >
        חזרה
      </Button>
      
      <Paper elevation={2} sx={{ overflow: 'hidden' }}>
        <Grid container>
          {/* תמונת המוצר */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
                bgcolor: '#f8f8f8'
              }}
            >
              <img
                src={product.imageUrl || 'https://via.placeholder.com/400'}
                alt={product.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '400px',
                  objectFit: 'contain'
                }}
              />
            </Box>
          </Grid>
          
          {/* פרטי המוצר */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h4" component="h1">
                  {product.name}
                </Typography>
                <IconButton
                  onClick={() => setFavorite(!favorite)}
                  color="secondary"
                >
                  {favorite ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
                <Rating value={product.rating || 0} precision={0.5} readOnly />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({product.rating || 0})
                </Typography>
              </Box>
              
              <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
                ₪{product.price?.toFixed(2)}
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 3 }}>
                {product.description}
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Chip 
                  label={product.category.name} 
                  color="primary" 
                  variant="outlined" 
                  size="small" 
                />
                
                {product.stock > 0 ? (
                  <Chip 
                    label={`במלאי: ${product.stock}`} 
                    color="success" 
                    variant="outlined" 
                    size="small" 
                    sx={{ ml: 1 }}
                  />
                ) : (
                  <Chip 
                    label="אזל מהמלאי" 
                    color="error" 
                    variant="outlined" 
                    size="small" 
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              {/* אזור הוספה לסל */}
              {!currentUser?.isAdmin && (
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TextField
                      type="number"
                      label="כמות"
                      value={quantity}
                      onChange={handleQuantityChange}
                      InputProps={{ inputProps: { min: 1, max: product.stock } }}
                      sx={{ width: '100px', mr: 2 }}
                      disabled={!product.active || product.stock <= 0}
                    />
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      onClick={handleAddToCart}
                      disabled={!product.active || product.stock <= 0 || !currentUser}
                      sx={{ flex: 1 }}
                    >
                      הוסף לסל
                    </Button>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <LocalShipping fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      מוצר זה זמין למשלוח תוך 3-5 ימי עסקים
                    </Typography>
                  </Box>
                  
                  {!currentUser && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      יש להתחבר כדי להוסיף מוצרים לסל הקניות
                    </Alert>
                  )}
                </Box>
              )}
              
              {/* כפתורי פעולה למנהל */}
              {currentUser?.isAdmin && (
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={handleEditProduct}
                  >
                    עריכת מוצר
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={handleDeleteProduct}
                  >
                    מחיקת מוצר
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProductDetail;