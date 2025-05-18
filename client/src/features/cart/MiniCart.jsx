import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCart, selectCartTotal } from '../../features/order/orderSlice';
import {
  Box,
  Badge,
  IconButton,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Popover,
  Divider
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// רכיב סל קניות מוקטן שמציג את הפריטים בסל ללא פרטים נוספים
const MiniCart = () => {
  const navigate = useNavigate();
  const cartItems = useSelector(selectCart);
  const cartTotal = useSelector(selectCartTotal);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewCart = () => {
    navigate('/summary');
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  // חישוב מספר הפריטים הכולל בסל
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <Box>
      <IconButton 
        color="inherit" 
        aria-describedby={id} 
        onClick={handleClick}
      >
        <Badge badgeContent={itemCount} color="error">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
      
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper sx={{ width: 300, maxHeight: 400, overflow: 'auto' }}>
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="subtitle1">סל הקניות שלי</Typography>
          </Box>
          
          {cartItems.length === 0 ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                הסל שלך ריק
              </Typography>
            </Box>
          ) : (
            <>
              <List sx={{ py: 0 }}>
                {cartItems.slice(0, 3).map((item) => (
                  <ListItem key={item.product.id} sx={{ borderBottom: '1px solid #f0f0f0' }}>
                    <Box sx={{ width: 40, height: 40, mr: 2, bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="body2">{item.quantity}x</Typography>
                    </Box>
                    <ListItemText 
                      primary={item.product.name}
                      secondary={`₪${item.product.price?.toFixed(2)}`}
                      primaryTypographyProps={{ noWrap: true, fontSize: '0.875rem' }}
                    />
                  </ListItem>
                ))}
                
                {cartItems.length > 3 && (
                  <ListItem sx={{ justifyContent: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      ...ועוד {cartItems.length - 3} פריטים
                    </Typography>
                  </ListItem>
                )}
              </List>
              
              <Divider />
              
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2">סה"כ:</Typography>
                  <Typography variant="subtitle2">₪{cartTotal.toFixed(2)}</Typography>
                </Box>
                
                <Button 
                  variant="contained" 
                  fullWidth 
                  onClick={handleViewCart}
                  size="small"
                >
                  צפייה בסל
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Popover>
    </Box>
  );
};

export default MiniCart;