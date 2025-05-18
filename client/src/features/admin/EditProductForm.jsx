import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../category/categorySlice';
import axios from '../../utils/api';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  Switch,
  FormControlLabel,
  InputAdornment,
  CircularProgress,
  Alert
} from '@mui/material';

// סכמת ולידציה עבור טופס עדכון מוצר
const productSchema = yup.object({
  name: yup.string()
    .required('שם המוצר הוא שדה חובה')
    .min(2, 'שם המוצר חייב להכיל לפחות 2 תווים'),
  price: yup.number()
    .required('מחיר הוא שדה חובה')
    .positive('המחיר חייב להיות חיובי')
    .typeError('המחיר חייב להיות מספר'),
  description: yup.string()
    .required('תיאור הוא שדה חובה')
    .min(10, 'התיאור חייב להכיל לפחות 10 תווים'),
  stock: yup.number()
    .required('כמות במלאי היא שדה חובה')
    .integer('הכמות חייבת להיות מספר שלם')
    .min(0, 'הכמות לא יכולה להיות שלילית')
    .typeError('הכמות חייבת להיות מספר'),
  categoryId: yup.number()
    .required('קטגוריה היא שדה חובה')
    .typeError('יש לבחור קטגוריה'),
  imageUrl: yup.string()
    .url('נא להזין כתובת URL תקינה')
}).required();

const EditProductForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { productId } = useParams();
  const { categories } = useSelector((state) => state.category);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: '',
      price: '',
      description: '',
      stock: '',
      categoryId: '',
      imageUrl: '',
      active: true
    }
  });

  // טעינת נתוני המוצר והקטגוריות בעת טעינת הדף
  useEffect(() => {
    const loadProductData = async () => {
      setIsLoading(true);
      try {
        const [productResponse, categoriesResponse] = await Promise.all([
          axios.get(`/products/${productId}`),
          dispatch(fetchCategories()).unwrap()
        ]);
        
        // אתחול טופס העריכה עם נתוני המוצר שנטענו
        reset({
          ...productResponse.data,
          categoryId: productResponse.data.category.id
        });
      } catch (error) {
        setError('שגיאה בטעינת המוצר');
        console.error('Error loading product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProductData();
  }, [productId, dispatch, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      // שליחת נתוני העדכון לשרת
      await axios.put(`/products/${productId}`, data);
      setSuccess(true);
      
      // ניווט חזרה לדף המוצרים אחרי העדכון
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'אירעה שגיאה בעדכון המוצר. נסה שנית.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // הצגת סמן טעינה בזמן טעינת נתוני המוצר
  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          עריכת מוצר
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>המוצר עודכן בהצלחה!</Alert>}
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="שם המוצר"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="מחיר"
                    fullWidth
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₪</InputAdornment>,
                    }}
                    error={!!errors.price}
                    helperText={errors.price?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="תיאור המוצר"
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="stock"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="כמות במלאי"
                    fullWidth
                    type="number"
                    error={!!errors.stock}
                    helperText={errors.stock?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.categoryId}>
                    <InputLabel>קטגוריה</InputLabel>
                    <Select
                      {...field}
                      label="קטגוריה"
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors.categoryId?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="imageUrl"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="קישור לתמונה"
                    fullWidth
                    error={!!errors.imageUrl}
                    helperText={errors.imageUrl?.message || 'הזן כתובת URL לתמונת המוצר'}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="active"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={value}
                        onChange={e => onChange(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="מוצר פעיל במערכת"
                  />
                )}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/admin')}
            >
              ביטול
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'עדכון מוצר'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditProductForm;