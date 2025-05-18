import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/user/userSlice';

// רכיב עוטף לנתיבים מוגנים שדורשים התחברות או הרשאות מנהל
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const currentUser = useSelector(selectCurrentUser);
  const location = useLocation();

  // אם המשתמש לא מחובר, הפנייה לדף התחברות
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  // אם נדרשות הרשאות מנהל והמשתמש אינו מנהל, הפנייה לדף הבית
  if (requireAdmin && !currentUser.isAdmin) {
    return <Navigate to="/" />;
  }

  // אם המשתמש מחובר ובעל הרשאות מתאימות, הצג את התוכן
  return children;
};

export default ProtectedRoute;