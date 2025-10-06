// Redux/Slice/CategoryFileMakeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// --- API Base ---
const API_URL = "http://localhost:5000/api/category/categories";

// --- Async Thunks ---
export const fetchCategories = createAsyncThunk("categories/fetch", async () => {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }
  const data = await res.json();
  return data.categories || [];
});

export const createCategory = createAsyncThunk("categories/create", async (categoryData) => {
  const res = await fetch(API_URL, {
    method: "POST",
    body: categoryData,
  });
  if (!res.ok) {
    throw new Error('Failed to create category');
  }
  const data = await res.json();
  return data.category;
});

export const updateCategory = createAsyncThunk("categories/update", async ({ id, formData }) => {
  const res = await fetch(`${API_URL}/${id}`, { // Fixed: Added missing slash
    method: "PUT",
    body: formData,
  });
  if (!res.ok) {
    throw new Error('Failed to update category');
  }
  const data = await res.json();
  return data.category;
});

export const deleteCategory = createAsyncThunk("categories/delete", async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" }); // Fixed: Added missing slash
  if (!res.ok) {
    throw new Error('Failed to delete category');
  }
  return id;
});

// --- Slice ---
const categorySlice = createSlice({
  name: "categories",
  initialState: { 
    items: [], 
    status: "idle", 
    error: null 
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => { 
        state.status = "loading"; 
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded"; 
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => { 
        state.status = "failed"; 
        state.error = action.error.message; 
      })
      
      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createCategory.fulfilled, (state, action) => { 
        state.status = "succeeded";
        state.items.unshift(action.payload);
        state.error = null;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      
      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.map((cat) => 
          cat._id === action.payload._id ? action.payload : cat
        );
        state.error = null;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      
      // Delete Category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((cat) => cat._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { clearError } = categorySlice.actions;
export default categorySlice.reducer;
