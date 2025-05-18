import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "./orderSlice";
import {
  Button,
  Container,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const OrderSummary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.order.cart);

  const handleQuantityChange = (productId, quantity) => {
    const qty = parseInt(quantity);
    if (qty >= 1) {
      dispatch(updateCartItemQuantity({ productId, quantity: qty }));
    }
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        סיכום הזמנה
      </Typography>
      {cart.length === 0 ? (
        <Typography>העגלה שלך ריקה</Typography>
      ) : (
        <>
          {cart.map((item) => (
            <Grid container spacing={2} key={item.id} alignItems="center">
              <Grid item xs={4}>
                <Typography>{item.name}</Typography>
              </Grid>
              <Grid item xs={2}>
                <TextField
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.id, e.target.value)
                  }
                  inputProps={{ min: 1 }}
                  size="small"
                />
              </Grid>
              <Grid item xs={2}>
                <Typography>{item.price} ₪</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography>{item.price * item.quantity} ₪</Typography>
              </Grid>
              <Grid item xs={2}>
                <IconButton onClick={() => handleRemove(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Typography variant="h6" align="right" sx={{ mt: 2 }}>
            סכום כולל: {total} ₪
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/finish-order")}
            sx={{ mt: 2 }}
          >
            מעבר להזמנה
          </Button>
        </>
      )}
    </Container>
  );
};

export default OrderSummary;
