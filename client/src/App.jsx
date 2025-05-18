import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OrderSummary from './features/order/OrderSummary';
import ProductList from './features/product/ProductList';
import FinishOrderForm from './features/order/FinishOrderForm';
import CartSummary from './features/order/CartSummary';
import CategoryList from './features/category/CategoryList';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path="/cart-Summary" element={<CartSummary />} />
      <Route path="/finish-order" element={<FinishOrderForm />} />
      <Route path="/categories" element={<CategoryList />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/order-summary" element={<OrderSummary />} />

    </Routes>
  );
}

export default App;
