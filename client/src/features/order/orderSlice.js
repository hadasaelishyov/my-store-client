// orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../utils/api';

// Async thunk for creating an order from cart
export const createOrderFromCart = createAsyncThunk(
  'order/createFromCart',
  async (shippingDetails, { getState, rejectWithValue }) => {
    try {
      const { order } = getState();
      
      // Make sure we have items in the cart
      if (!order.cart || order.cart.length === 0) {
        return rejectWithValue('Cart is empty');
      }

      // In a real application, you would create a cart on the server first
      // and then convert it to an order
      // This is just an example approach that would need to be adapted
      // based on your actual backend API
      
      // Let's assume we need to create a cart first
      const cartResponse = await apiService.cart.getOrCreateCart(shippingDetails.email);
      const cartId = cartResponse.data.id;
      
      // Add all items to cart
      for (const item of order.cart) {
        await apiService.cart.addProduct(cartId, item.product.id, item.quantity);
      }
      
      // Create order from cart
      const response = await apiService.order.createFromCart(
        cartId,
        shippingDetails
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Process payment for an order
export const processPayment = createAsyncThunk(
  'order/processPayment',
  async ({ orderId, paymentMethod, transactionId }, { rejectWithValue }) => {
    try {
      const response = await apiService.order.processPayment(
        orderId,
        paymentMethod,
        transactionId
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get user orders
export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async (email, { rejectWithValue }) => {
    try {
      const response = await apiService.order.getByUser(email);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get order by ID
export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiService.order.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  cart: [],
  orderDate: null,
  deliveryDate: null,
  shippingAddress: '',
  shippingCity: '',
  shippingZipCode: '',
  shippingCountry: '',
  total: 0,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  currentOrder: null,
  userOrders: [],
  paymentStatus: 'idle',
  paymentError: null
};

// Helper function to recalculate total
const calculateTotal = (cart) => {
  return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // Add to cart
    addToCart: (state, action) => {
      const { product, quantity } = action.payload;
      
      // Check if product is already in cart
      const existingItem = state.cart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Update quantity
        existingItem.quantity += quantity;
      } else {
        // Add new item
        state.cart.push({
          product: { ...product },
          quantity
        });
      }
      
      // Update total
      state.total = calculateTotal(state.cart);
    },
    
    // Remove from cart
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cart = state.cart.filter(item => item.product.id !== productId);
      
      // Update total
      state.total = calculateTotal(state.cart);
    },
    
    // Update item quantity
    updateCartItemQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      
      const existingItem = state.cart.find(item => item.product.id === productId);
      
      if (existingItem) {
        existingItem.quantity = quantity;
      }
      
      // Update total
      state.total = calculateTotal(state.cart);
    },
    
    // Clear cart
    clearCart: (state) => {
      state.cart = [];
      state.total = 0;
    },
    
    // Update order details
    updateOrderDetails: (state, action) => {
      const { 
        orderDate, 
        deliveryDate, 
        shippingAddress,
        shippingCity,
        shippingZipCode,
        shippingCountry 
      } = action.payload;
      
      if (orderDate) state.orderDate = orderDate;
      if (deliveryDate) state.deliveryDate = deliveryDate;
      if (shippingAddress) state.shippingAddress = shippingAddress;
      if (shippingCity) state.shippingCity = shippingCity;
      if (shippingZipCode) state.shippingZipCode = shippingZipCode;
      if (shippingCountry) state.shippingCountry = shippingCountry;
    },
    
    // Reset order state
    resetOrderState: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create order from cart
      .addCase(createOrderFromCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createOrderFromCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload;
        state.cart = []; // Clear cart after successful order
        state.total = 0;
      })
      .addCase(createOrderFromCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to create order';
      })
      
      // Process payment
      .addCase(processPayment.pending, (state) => {
        state.paymentStatus = 'loading';
        state.paymentError = null;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.paymentStatus = 'succeeded';
        state.currentOrder = {
          ...state.currentOrder,
          paymentDetails: action.payload
        };
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.paymentStatus = 'failed';
        state.paymentError = action.payload || 'Payment processing failed';
      })
      
      // Fetch user orders
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
      })
      
      // Fetch order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch order';
      });
  }
});

// Export actions
export const { 
  addToCart, 
  removeFromCart, 
  updateCartItemQuantity, 
  clearCart, 
  updateOrderDetails,
  resetOrderState
} = orderSlice.actions;

// Export reducer
export default orderSlice.reducer;

// Selectors
export const selectCart = (state) => state.order.cart;
export const selectCartItemCount = (state) => state.order.cart.reduce((count, item) => count + item.quantity, 0);
export const selectCartTotal = (state) => state.order.total;
export const selectOrderDetails = (state) => ({
  orderDate: state.order.orderDate,
  deliveryDate: state.order.deliveryDate,
  shippingAddress: state.order.shippingAddress,
  shippingCity: state.order.shippingCity,
  shippingZipCode: state.order.shippingZipCode,
  shippingCountry: state.order.shippingCountry
});
export const selectCurrentOrder = (state) => state.order.currentOrder;
export const selectUserOrders = (state) => state.order.userOrders;
export const selectOrderStatus = (state) => state.order.status;
export const selectOrderError = (state) => state.order.error;
export const selectPaymentStatus = (state) => state.order.paymentStatus;