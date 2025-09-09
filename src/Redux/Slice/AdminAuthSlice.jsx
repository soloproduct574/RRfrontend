import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth/admin";

// 1️⃣ LOGIN ADMIN
export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async ({ login, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/login`, { login, password });

      // ✅ Save token to localStorage
      localStorage.setItem("adminToken", res.data.token);

      return res.data; // contains { admin, token }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// 2️⃣ FETCH ADMIN DASHBOARD (Protected Route)
export const fetchAdminDashboard = createAsyncThunk(
  "auth/fetchAdminDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No token found");

      const res = await axios.get(`${API_URL}/protect/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Admin dashboard response:", res.data);
      return res.data; // { success, message, admin }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Unauthorized");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    admin: null,
    token: null,
    loading: false,
    error: null,
    dashboardMessage: null,
  },
  reducers: {
    logout: (state) => {
      state.admin = null;
      state.token = null;
      state.dashboardMessage = null;
      state.error = null;
      localStorage.removeItem("adminToken");
    },
    setTokenFromStorage: (state) => {
      const token = localStorage.getItem("adminToken");
      if (token) state.token = token;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DASHBOARD FETCH
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
        state.dashboardMessage = action.payload.message;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.token = null;
        state.dashboardMessage = null;
        state.error = action.payload;
        localStorage.removeItem("adminToken");
      });
  },
});

export const { logout, setTokenFromStorage } = authSlice.actions;
export default authSlice.reducer;
