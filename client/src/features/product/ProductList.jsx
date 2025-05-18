// src/features/product/ProductList.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "./productSlice";
import ProductCard from "./ProductCard";
import { useLocation } from "react-router-dom";
import {
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";

const ProductList = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("category");

  const { products, loading, error } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProducts(categoryId)); // נשלח את מזהה הקטגוריה אם קיים
  }, [dispatch, categoryId]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        רשימת מוצרים
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">שגיאה: {error}</Typography>
      ) : (
        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ProductList;
