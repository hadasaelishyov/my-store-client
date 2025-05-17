import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './features/user/LoginForm';
import RegisterForm from './features/user/RegisterForm';
import ProductList from './features/products/ProductList';
import FinishOrderForm from './features/orders/FinishOrderForm';
import Navbar from './components/Navbar/Navbar';
import CategoryList from './features/categories/CategoryList';
import OrderSummary from './features/orders/CartSummary';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/summary" element={<OrderSummary />} />
        <Route path="/finish-order" element={<FinishOrderForm />} />
        {/* הוסף עוד מסכים בהמשך */}
      </Routes>
    </Router>
  );
}

export default App;
