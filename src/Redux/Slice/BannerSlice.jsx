// store/bannerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch banners from backend API
export const fetchBannersMedia = createAsyncThunk("banners/fetch", async () => {
  const res = await fetch("http://localhost:5000/api/media/banners"); // your API route
  const data = await res.json();
  return data.banners || [];
});

const bannerSlice = createSlice({
  name: "banners",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBannersMedia.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBannersMedia.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchBannersMedia.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default bannerSlice.reducer;
