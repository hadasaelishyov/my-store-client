// CartSummary.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { 
  selectCart, 
  selectCartTotal, 
  updateCartItemQuantity, 
  removeFromCart 
} from '../order/orderSlice';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  IconButton, 
  Divider,
  Paper,
  TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const CartSummary = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCart);
  const cartTotal = useAppSelector(selectCartTotal);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) newQuantity = 1;
    dispatch(updateCartItemQuantity({ productId, quantity: newQuantity }));
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleCheckout = () => {
    navigate('/finish-order');
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <ShoppingCartIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Looks like you haven't added any items to your cart yet.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleContinueShopping}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Shopping Cart
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 2 }}>
            {cartItems.map((item) => (
              <Card key={item.product.id} sx={{ display: 'flex', mb: 2, p: 2 }}>
                <CardMedia
                  component="img"
                  sx={{ width: 100, height: 100, objectFit: 'contain' }}
                  image={item.product.imageUrl || 'https://via.placeholder.com/100'}
                  alt={item.product.name}
                />
                <CardContent sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography component="div" variant="h6">
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      ${item.product.price?.toFixed(2)} each
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <TextField
                        size="small"
                        variant="outlined"
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.product.id, parseInt(e.target.value) || 1)}
                        inputProps={{ min: 1, style: { textAlign: 'center', width: '40px' } }}
                        sx={{ mx: 1 }}
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle1" sx={{ mr: 2 }}>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </Typography>
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => handleRemoveItem(item.product.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">
                Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)}):
              </Typography>
              <Typography variant="body1">
                ${cartTotal.toFixed(2)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">
                Shipping:
              </Typography>
              <Typography variant="body1">
                TBD
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">
                Total:
              </Typography>
              <Typography variant="h6">
                ${cartTotal.toFixed(2)}
              </Typography>
            </Box>
            
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              size="large"
              onClick={handleCheckout}
              sx={{ mb: 2 }}
            >
              Proceed to Checkout
            </Button>
            
            <Button 
              variant="outlined" 
              fullWidth
              onClick={handleContinueShopping}
            >
              Continue Shopping
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartSummary;