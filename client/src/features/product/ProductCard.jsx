// ProductCard.jsx
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../features/user/userSlice';
import { addToCart } from '../../features/order/orderSlice';
import { 
  Card, 
  CardActions, 
  CardContent, 
  CardMedia, 
  Button, 
  Typography, 
  Box,
  Rating
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);

  const handleAddToCart = () => {
    // Add product to cart with quantity of 1
    dispatch(addToCart({ product, quantity: 1 }));
  };

  const handleViewDetails = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: 3
        }
      }}
    >
      <CardMedia
        component="img"
        sx={{
          height: 200,
          objectFit: 'contain',
          padding: 2,
          backgroundColor: '#f5f5f5'
        }}
        image={product.imageUrl || 'https://via.placeholder.com/200'}
        alt={product.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {product.name}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
          <Rating value={product.rating || 0} precision={0.5} readOnly size="small" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({product.rating || 0})
          </Typography>
        </Box>
        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
          ${product.price?.toFixed(2)}
        </Typography>
        {product.stock <= 0 && (
          <Typography variant="body2" color="error">
            Out of stock
          </Typography>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <Typography variant="body2" color="warning.main">
            Only {product.stock} left
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button 
          size="small" 
          color="primary"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
        <Button 
          size="small" 
          color="primary" 
          onClick={handleAddToCart}
          disabled={!product.active || product.stock <= 0 || !currentUser}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;