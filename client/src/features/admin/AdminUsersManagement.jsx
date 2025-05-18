import React, { useState, useEffect } from 'react';
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
  DialogActions,
  TextField,
  FormControlLabel,
  Switch
} from '@mui/material';
import axios from '../../utils/api';

const AdminUsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editedUserData, setEditedUserData] = useState(null);

  // טעינת נתוני המשתמשים מהשרת
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // מטפל בשינוי עמוד בטבלה
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // מטפל בשינוי מספר השורות בעמוד
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // פתיחת דיאלוג עריכת משתמש
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditedUserData({ ...user });
    setOpenDialog(true);
  };

  // סגירת דיאלוג עריכת משתמש
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setEditedUserData(null);
  };

  // עדכון נתוני משתמש בדיאלוג העריכה
  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // טיפול בשינוי מצב האדמין
  const handleAdminStatusChange = (e) => {
    setEditedUserData(prev => ({
      ...prev,
      isAdmin: e.target.checked
    }));
  };

  // שמירת השינויים
  const handleSaveChanges = async () => {
    try {
      await axios.put(`/users/${selectedUser.id}`, editedUserData);
      
      // עדכון רשימת המשתמשים
      setUsers(prev => 
        prev.map(user => 
          user.id === selectedUser.id ? editedUserData : user
        )
      );
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating user:', error);
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
          ניהול משתמשים
        </Typography>
        
        {users.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
            לא נמצאו משתמשים
          </Typography>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>שם</TableCell>
                    <TableCell>אימייל</TableCell>
                    <TableCell>טלפון</TableCell>
                    <TableCell>סוג</TableCell>
                    <TableCell>סטטוס</TableCell>
                    <TableCell>תאריך הצטרפות</TableCell>
                    <TableCell>פעולות</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          <Chip 
                            label={user.isAdmin ? 'מנהל' : 'לקוח'} 
                            color={user.isAdmin ? 'secondary' : 'primary'} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={user.active ? 'פעיל' : 'לא פעיל'} 
                            color={user.active ? 'success' : 'error'} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString('he-IL')}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleEditUser(user)}
                          >
                            עריכה
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={users.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="שורות בעמוד:"
            />
          </>
        )}
      </Paper>
      
      {/* דיאלוג עריכת משתמש */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        {selectedUser && editedUserData && (
          <>
            <DialogTitle>
              עריכת משתמש: {selectedUser.firstName} {selectedUser.lastName}
            </DialogTitle>
            <DialogContent dividers>
              <Box component="form" sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  fullWidth
                  label="שם פרטי"
                  name="firstName"
                  value={editedUserData.firstName}
                  onChange={handleUserDataChange}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="שם משפחה"
                  name="lastName"
                  value={editedUserData.lastName}
                  onChange={handleUserDataChange}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="אימייל"
                  name="email"
                  value={editedUserData.email}
                  onChange={handleUserDataChange}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="טלפון"
                  name="phone"
                  value={editedUserData.phone}
                  onChange={handleUserDataChange}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={editedUserData.isAdmin}
                      onChange={handleAdminStatusChange}
                      name="isAdmin"
                      color="secondary"
                    />
                  }
                  label="הרשאת מנהל"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={editedUserData.active}
                      onChange={(e) => setEditedUserData(prev => ({ ...prev, active: e.target.checked }))}
                      name="active"
                      color="primary"
                    />
                  }
                  label="משתמש פעיל"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>ביטול</Button>
              <Button 
                onClick={handleSaveChanges} 
                variant="contained" 
                color="primary"
              >
                שמור שינויים
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default AdminUsersManagement;