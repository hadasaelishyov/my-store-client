// ProductList.jsx
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { 
  fetchProducts, 
  selectAllProducts, 
  selectProductStatus, 
  selectProductError 
} from '../../features/product/productSlice';
import ProductCard from './ProductCard';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { Grid, Container, Typography } from '@mui/material';

const ProductList = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectAllProducts);
  const status = useAppSelector(selectProductStatus);
  const error = useAppSelector(selectProductError);

  useEffect(() => {
    // Only fetch products if not already loaded
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  if (status === 'loading') {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (status === 'failed') {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Error loading products: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Our Products
      </Typography>
      
      {products.length === 0 ? (
        <Typography variant="body1">No products available.</Typography>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ProductList;