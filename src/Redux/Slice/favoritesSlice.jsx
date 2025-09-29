import { createSlice } from "@reduxjs/toolkit";

// ✅ Load full favorite products from localStorage
const loadFavorites = () => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("favoriteItems");
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Failed to load favorites from localStorage", e);
    return [];
  }
};

const initialState = {
  favoriteItems: loadFavorites(),
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      const product = action.payload;
      const exists = state.favoriteItems.find((p) => p._id === product._id);
      if (!exists) {
        state.favoriteItems.push(product);
      }
      localStorage.setItem("favoriteItems", JSON.stringify(state.favoriteItems));
    },
    removeFavorite: (state, action) => {
      state.favoriteItems = state.favoriteItems.filter((p) => p._id !== action.payload);
      localStorage.setItem("favoriteItems", JSON.stringify(state.favoriteItems));
    },
    toggleFavorite: (state, action) => {
      const product = action.payload; 
      const index = state.favoriteItems.findIndex((p) => p._id === product._id);
      if (index > -1) {
        state.favoriteItems.splice(index, 1);
      } else {
        state.favoriteItems.push(product);
      }
      localStorage.setItem("favoriteItems", JSON.stringify(state.favoriteItems));
    },
    clearFavorites: (state) => {
      state.favoriteItems = [];
      localStorage.removeItem("favoriteItems");
    },
  },
});

export const { addFavorite, removeFavorite, toggleFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
