"use client";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Typography, Alert, Box, CircularProgress } from '@mui/material';
import ProductCard from '../../components/productCard';
import { fetchProducts } from "../../Redux/Slice/productSlice";

const ProductList = () => {
  const dispatch = useDispatch();
  // ✅ Fixed: Access 'items' instead of 'products'
  const { items: products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    console.log('🚀 ProductList mounted, fetching products...');
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    console.log('📊 Products state updated:', { 
      productsCount: products?.length || 0, 
      loading, 
      error,
      products: products
    });
  }, [products, loading, error]);

  if (error) {
    console.error('💥 Error in ProductList:', error);
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
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h4"
          sx={{
            fontFamily: "Arial, sans-serif",
            color: '#ff3838ff',
            fontWeight: 600,
            letterSpacing: "1px",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}
        >
          <img
            src="/texticon.png"
            alt="icon"
            style={{ width: 50, height: 50 }}
            onError={(e) => {
              console.warn('🖼️ Header icon failed to load');
              e.target.style.display = 'none';
            }}
          />
          Shop By Product Categories
          <img
            src="/texticon.png"
            alt="icon"
            style={{ width: 50, height: 50 }}
            onError={(e) => {
              console.warn('🖼️ Header icon failed to load');
              e.target.style.display = 'none';
            }}
          />
        </Typography>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          flexDirection: 'column',
          mb: 4 
        }}>
          <CircularProgress size={40} />
          <Typography sx={{ mt: 2, color: 'text.secondary' }}>
            Loading products...
          </Typography>
        </Box>
      )}

      {/* Products Grid */}
      <Grid container spacing={3}justifyContent="center" >
        {loading ? (
          // Show loading skeletons
          Array.from({ length: 8 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={`skeleton-${index}`}>
              <ProductCard isLoading={true} />
            </Grid>
          ))
        ) : products && products.length > 0 ? (
          // Show actual products
          products.map((product, index) => {
            console.log(`🎴 Rendering product ${index + 1}:`, product);
            return (
              <Grid item xs={12} sm={6} md={3} lg={3} key={product._id || product.id || index}>
                <ProductCard product={product} />
              </Grid>
            );
          })
        ) : !loading ? (
          // No products found (only show when not loading)
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Check if your API server is running or try refreshing the page
              </Typography>
            </Box>
          </Grid>
        ) : null}
      </Grid>

      {/* Debug Info (Remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="caption" display="block">
            Debug Info: Loading: {loading.toString()}, 
            Products Count: {products?.length || 0}, 
            Error: {error || 'None'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProductList;
