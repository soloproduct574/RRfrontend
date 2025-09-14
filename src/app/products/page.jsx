"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Typography,
  Alert,
  Box,
  CircularProgress,
  IconButton,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ProductCard from "../../components/productCard";
import { fetchProducts } from "../../Redux/Slice/productSlice";

const ProductList = () => {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector(
    (state) => state.products
  );

  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 4; // show 4 at a time

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handlers for navigation
  const handleNext = () => {
    if (startIndex < (products?.length || 0) - visibleCount) {
      setStartIndex(startIndex + visibleCount);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - visibleCount);
    }
  };

  const visibleProducts = products?.slice(startIndex, startIndex + visibleCount);

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load products: {error}
        </Alert>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Make sure your backend server is running on http://localhost:5000
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, position: "relative" }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Arial, sans-serif",
            color: "#ff3838ff",
            fontWeight: 600,
            letterSpacing: "1px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <img src="/texticon.png" alt="icon" style={{ width: 50, height: 50 }} />
          Top Trending Products
          <img src="/texticon.png" alt="icon" style={{ width: 50, height: 50 }} />
        </Typography>
      </Box>

      {/* Loading */}
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            mb: 4,
          }}
        >
          <CircularProgress size={40} />
          <Typography sx={{ mt: 2, color: "text.secondary" }}>
            Loading products...
          </Typography>
        </Box>
      )}

      {/* Product Grid with Arrows */}
      {!loading && products?.length > 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            position: "relative",
          }}
        >
          {/* Prev Button */}
          <IconButton
            onClick={handlePrev}
            disabled={startIndex === 0}
            sx={{
              backgroundColor: "white",
              boxShadow: 2,
              "&:hover": { backgroundColor: "primary.main", color: "white" },
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>

          {/* Products */}
          <Grid
            container
            spacing={3}
            justifyContent="center"
            sx={{ flex: 1 }}
          >
            {visibleProducts.map((product, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={product._id || product.id || index}
              >
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>

          {/* Next Button */}
          <IconButton
            onClick={handleNext}
            disabled={startIndex >= products.length - visibleCount}
            sx={{
              backgroundColor: "white",
              boxShadow: 2,
              "&:hover": { backgroundColor: "primary.main", color: "white" },
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      )}

      {/* No products */}
      {!loading && products?.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No products found
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Check if your API server is running or try refreshing the page
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProductList;