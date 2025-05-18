import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/user/userSlice';
import UserNavBar from '../../components/navigation/UserNavBar';
import ManagerNavBar from '../../components/navigation/ManagerNavBar';

// רכיב שבוחר את ה-NavBar המתאים בהתאם לסוג המשתמש
const NavBar = () => {
  const currentUser = useSelector(selectCurrentUser);
  
  // אם המשתמש מנהל, הצג את ה-NavBar של מנהל, אחרת הצג את ה-NavBar של משתמש רגיל
  return currentUser?.isAdmin ? <ManagerNavBar /> : <UserNavBar />;
};

export default NavBar;