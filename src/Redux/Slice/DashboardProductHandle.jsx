import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'https://rrbackend-49lt.onrender.com/api/products';

// Fetch all products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// In your DashboardProductHandle.js file:

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData, isFormData = false }, { rejectWithValue }) => {
    try {
      let response;
      
      if (isFormData) {
        // For FormData with files
        response = await axios.put(`${BASE_URL}/${id}`, productData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // For regular JSON data
        response = await axios.put(`${BASE_URL}/${id}`, productData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      
      return response.data;
    } catch (error) {
      console.error("Update error in Redux:", error);
      
      return rejectWithValue(
        error.response?.data || { message: error.message || 'Unknown error' }
      );
    }
  }
);




// Delete a product
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/${id}`);
      return { id, data: response.data }; // Return both ID and response data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const initialState = {
  products: [],
  loading: false,
  error: null,
  success: false,
  updateStatus: 'idle', // New field to track update status
};

const productSlice = createSlice({
  name: 'dashboardProduct', // Make sure this matches what you use in useSelector
  initialState,
  reducers: {
    clearProductState: (state) => {
      state.error = null;
      state.success = false;
      state.updateStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products cases
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch products';
      })
      
      // Update product cases
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateStatus = 'pending';
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.updateStatus = 'succeeded';
        
        // Handle the updated product, ensuring we have the proper data format
        if (action.payload && action.payload.product) {
          const updatedProduct = action.payload.product;
          const index = state.products.findIndex(p => p._id === updatedProduct._id);
          
          if (index !== -1) {
            state.products[index] = updatedProduct;
          }
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.updateStatus = 'failed';
        state.error = action.payload?.message || 'Failed to update product';
      })
      
      // Delete product cases
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        
        // Get the ID from the payload to filter products
        const deletedId = action.payload.id;
        state.products = state.products.filter(product => product._id !== deletedId);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete product';
      });
  },
});

export const { clearProductState } = productSlice.actions;
export default productSlice.reducer;
