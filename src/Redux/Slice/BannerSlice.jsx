// store/bannerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch banners from backend API
export const fetchBannersMedia = createAsyncThunk("banners/fetch", async () => {
  const res = await fetch("http://localhost:5000/api/media/banners");
  const data = await res.json();

  if (data.success && data.banners) {
    // Ensure each banner always has at least banner_images array,
    // if empty fall back to advertise_images
    return data.banners.map((banner) => ({
      ...banner,
      all_images: banner.banner_images?.length
        ? banner.banner_images
        : banner.advertise_images || [],
    }));
  }

  return [];
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
