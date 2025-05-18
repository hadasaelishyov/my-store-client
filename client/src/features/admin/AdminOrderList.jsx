import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders, selectUserOrders } from '../../features/order/orderSlice';
import { selectCurrentUser } from '../../features/user/userSlice';
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  CircularProgress,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  DialogActions
} from '@mui/material';
import { format } from 'date-fns';
import axios from '../../utils/api';

const AdminOrdersList = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const userOrders = useSelector(selectUserOrders);
  
  const [loading, setLoading] = useState(true);
  const [allOrders, setAllOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      
      try {
        // אם מדובר במנהל, נביא את כל ההזמנות מהשרת
        if (currentUser?.isAdmin) {
          const response = await axios.get('/orders');
          setAllOrders(response.data);
        } else {
          // אם מדובר במשתמש רגיל, נביא רק את ההזמנות שלו
          await dispatch(fetchUserOrders(currentUser.email));
        }
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      loadOrders();
    }
  }, [dispatch, currentUser]);

  // מטפל בשינוי עמוד בטבלה
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // מטפל בשינוי מספר השורות בעמוד
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // פתיחת דיאלוג לצפייה בפרטי הזמנה
  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  // סגירת דיאלוג פרטי הזמנה
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // הצג את ההזמנות המתאימות בהתאם לסוג המשתמש
  const displayOrders = currentUser?.isAdmin ? allOrders : userOrders;
  
  // חישוב סטטוס הזמנה בהתאם לתאריכים
  const getOrderStatus = (order) => {
    const today = new Date();
    const deliveryDate = new Date(order.deliveryDate);
    
    if (today > deliveryDate) {
      return { label: 'הושלמה', color: 'success' };
    } else if (today >= new Date(order.orderDate)) {
      return { label: 'בביצוע', color: 'warning' };
    } else {
      return { label: 'חדשה', color: 'info' };
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {currentUser?.isAdmin ? 'ניהול הזמנות' : 'ההזמנות שלי'}
        </Typography>
        
        {displayOrders.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
            לא נמצאו הזמנות
          </Typography>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>מס' הזמנה</TableCell>
                    <TableCell>תאריך הזמנה</TableCell>
                    <TableCell>תאריך אספקה</TableCell>
                    <TableCell>סכום</TableCell>
                    <TableCell>סטטוס</TableCell>
                    <TableCell>פעולות</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayOrders
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((order) => {
                      const status = getOrderStatus(order);
                      return (
                        <TableRow key={order.id}>
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{format(new Date(order.orderDate), 'd/M/yyyy')}</TableCell>
                          <TableCell>{format(new Date(order.deliveryDate), 'd/M/yyyy')}</TableCell>
                          <TableCell>₪{order.totalAmount?.toFixed(2)}</TableCell>
                          <TableCell>
                            <Chip 
                              label={status.label} 
                              color={status.color} 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleViewOrderDetails(order)}
                            >
                              פרטים
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={displayOrders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="שורות בעמוד:"
            />
          </>
        )}
      </Paper>
      
      {/* דיאלוג פרטי הזמנה */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedOrder && (
          <>
            <DialogTitle>
              פרטי הזמנה #{selectedOrder.id}
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>פרטי לקוח</Typography>
                <Typography>
                  {selectedOrder.firstName} {selectedOrder.lastName}
                </Typography>
                <Typography>
                  {selectedOrder.email}
                </Typography>
                <Typography>
                  {selectedOrder.phone}
                </Typography>
                <Typography variant="subtitle2" sx={{ mt: 1 }}>
                  כתובת למשלוח:
                </Typography>
                <Typography>
                  {selectedOrder.address}, {selectedOrder.city} {selectedOrder.zipCode}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>פריטים</Typography>
              <List>
                {selectedOrder.orderItems?.map((item, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={item.productName}
                      secondary={`${item.quantity} x ₪${item.unitPrice?.toFixed(2)}`}
                    />
                    <Typography variant="body1">
                      ₪{(item.quantity * item.unitPrice).toFixed(2)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1">סה"כ:</Typography>
                <Typography variant="subtitle1">₪{selectedOrder.totalAmount?.toFixed(2)}</Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>פרטי משלוח</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>תאריך הזמנה:</Typography>
                <Typography>{format(new Date(selectedOrder.orderDate), 'd/M/yyyy')}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>תאריך אספקה:</Typography>
                <Typography>{format(new Date(selectedOrder.deliveryDate), 'd/M/yyyy')}</Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>סגור</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default AdminOrdersList;