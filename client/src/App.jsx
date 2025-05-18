import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/user/userSlice';

// דפים ורכיבים
import LoginForm from '../features/user/LoginForm';
import RegisterForm from '../features/user/RegisterForm';
import ProductList from '../features/product/ProductList';
import ProductDetail from './ProductDetail'; // תיקון נתיב
import CategoryList from '../features/category/CategoryList';
import OrderSummary from '../features/order/OrderSummary';
import CartSummary from '../features/order/CartSummary';
import FinishOrderForm from '../features/order/FinishOrderForm';
import AdminAddProductForm from './AdminAddProductForm'; // תיקון נתיב
import AdminEditProductForm from './AdminEditProductForm'; // תיקון נתיב
import AdminOrdersList from './AdminOrdersList'; // תיקון נתיב
import AdminUsersManagement from './AdminUsersManagement'; // תיקון נתיב
import NavBar from '../components/layout/NavBar';
import ProtectedRoute from '../components/ProtectedRoute';

function App() {
  const currentUser = useSelector(selectCurrentUser);

  // כאשר המשתמש כבר מחובר, הדף הראשי שיוצג יהיה שונה בהתאם לסוג המשתמש
  const getHomePage = () => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    
    return currentUser.isAdmin 
      ? <Navigate to="/admin" /> 
      : <Navigate to="/products" />;
  };

  return (
    <>
      <NavBar />
      <Routes>
        {/* נתיב ראשי - מפנה בהתאם לסוג המשתמש */}
        <Route path="/" element={<ProductList />} />
        
        {/* נתיבי אימות */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        
        {/* נתיבי לקוח */}
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/summary" element={
          <ProtectedRoute>
            <CartSummary />
          </ProtectedRoute>
        } />
        <Route path="/finish-order" element={
          <ProtectedRoute>
            <FinishOrderForm />
          </ProtectedRoute>
        } />
        <Route path="/order-history" element={
          <ProtectedRoute>
            <AdminOrdersList /> {/* שימוש בגרסת המנהל גם למשתמש רגיל, ניתן להתאים אם יש צורך */}
          </ProtectedRoute>
        } />
        
        {/* נתיבי מנהל */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <ProductList />
          </ProtectedRoute>
        } />
        <Route path="/admin/add-product" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminAddProductForm />
          </ProtectedRoute>
        } />
        <Route path="/admin/edit-product/:productId" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminEditProductForm />
          </ProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminOrdersList />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminUsersManagement />
          </ProtectedRoute>
        } />
        
        {/* נתיב ברירת מחדל - לא נמצא */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;