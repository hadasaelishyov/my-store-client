// Redux store configuration
import { configureStore } from '@reduxjs/toolkit'
import productReducer from '../features/product/productSlice'
import userReducer from '../features/user/userSlice'
import orderReducer from '../features/order/orderSlice'
import categoryReducer from '../features/category/categorySlice';

export const store = configureStore({
  reducer: {
    product: productReducer,
    user: userReducer,
    order: orderReducer,
    category: categoryReducer,
  },
})