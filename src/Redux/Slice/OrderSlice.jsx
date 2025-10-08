import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API Base URL
const API_BASE_URL = 'https://rrbackend-49lt.onrender.com/api/payment';

// Async thunks for API calls
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await axios.get(`${API_BASE_URL}/?${queryParams}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch orders'
      );
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${orderId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch order details'
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, orderStatus, paymentStatus, orderNotes }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${orderId}/status`, {
        orderStatus,
        paymentStatus,
        orderNotes,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update order status'
      );
    }
  }
);

export const fetchOrderStats = createAsyncThunk(
  'orders/fetchOrderStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stats`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch order statistics'
      );
    }
  }
);

export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${orderId}`);
      return { orderId, data: response.data.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to cancel order'
      );
    }
  }
);

// Initial state
const initialState = {
  orders: [],
  currentOrder: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
    limit: 10,
  },
  summary: {
    totalOrders: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
    totalItems: 0,
  },
  stats: {
    orderStatusStats: [],
    paymentModeStats: [],
    monthlyRevenue: [],
  },
  filters: {},
  loading: false,
  error: null,
  updateLoading: false,
};

// Order slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    resetOrders: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
        state.summary = action.payload.summary;
        state.filters = action.payload.filter;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updatedOrder = action.payload;
        
        // Update in orders array
        const index = state.orders.findIndex(order => order._id === updatedOrder._id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
        
        // Update current order if it's the same
        if (state.currentOrder && state.currentOrder._id === updatedOrder._id) {
          state.currentOrder = updatedOrder;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Order Stats
      .addCase(fetchOrderStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchOrderStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Order
      .addCase(deleteOrder.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.updateLoading = false;
        const { orderId } = action.payload;
        state.orders = state.orders.filter(order => order._id !== orderId);
        
        // Update summary counts
        if (state.summary.totalOrders > 0) {
          state.summary.totalOrders -= 1;
        }
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setFilters, clearCurrentOrder, resetOrders } = orderSlice.actions;

// Selectors
export const selectOrders = (state) => state.orders.orders;
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;
export const selectOrdersPagination = (state) => state.orders.pagination;
export const selectOrdersSummary = (state) => state.orders.summary;
export const selectOrdersStats = (state) => state.orders.stats;
export const selectOrdersFilters = (state) => state.orders.filters;
export const selectUpdateLoading = (state) => state.orders.updateLoading;

// Computed selectors
export const selectNewOrders = (state) => 
  state.orders.orders.filter(order => 
    order.orderStatus === 'Pending' && 
    new Date(order.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  );

export const selectPendingOrdersCount = (state) =>
  state.orders.orders.filter(order => order.orderStatus === 'Pending').length;

export const selectTodayOrders = (state) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return state.orders.orders.filter(order => 
    new Date(order.createdAt) >= today
  );
};

export default orderSlice.reducer;
