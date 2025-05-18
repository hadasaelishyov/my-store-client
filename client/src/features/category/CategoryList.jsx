// src/features/category/CategoryList.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "./categorySlice";
import { useNavigate } from "react-router-dom";
import {
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

const CategoryList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, loading, error } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleClick = (id) => {
    navigate(`/products?category=${id}`);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        קטגוריות
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">שגיאה: {error}</Typography>
      ) : (
        <Grid container spacing={2}>
          {categories.map((cat) => (
            <Grid item xs={12} sm={6} md={4} key={cat.id}>
              <Paper
                elevation={3}
                style={{ padding: 16, cursor: "pointer" }}
                onClick={() => handleClick(cat.id)}
              >
                <Typography variant="h6">{cat.name}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default CategoryList;
