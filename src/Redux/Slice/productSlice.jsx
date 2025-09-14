import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching products from API...');
      const response = await fetch('http://localhost:5000/api/products');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Products fetched successfully:', data);
      
      if (data.success && data.data) {
        return data.data; // If API returns { success: true, data: [...] }
      } else if (Array.isArray(data)) {
        return data; // If API returns array directly
      } else if (data.products) {
        return data.products; // If API returns { products: [...] }
      } else {
        return data; // Return as is
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // ✅ Add action to clear products
    clearProducts: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        console.log('⏳ Products loading...');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        console.log('✅ Products loaded:', action.payload);
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        console.error('❌ Products loading failed:', action.payload);
        state.loading = false;
        state.error = action.payload;
        state.items = [];
      });
  },
});

export const { clearError, clearProducts } = productSlice.actions;
export default productSlice.reducer;
