import { createSlice } from "@reduxjs/toolkit";

// ✅ Load from localStorage at app start
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
    toggleFavorite: (state, action) => {
      const productId = action.payload;
      const index = state.favoriteItems.indexOf(productId);

      if (index > -1) {
        state.favoriteItems.splice(index, 1);
      } else {
        state.favoriteItems.push(productId);
      }

      // ✅ Write back to localStorage after every toggle
      try {
        localStorage.setItem("favoriteItems", JSON.stringify(state.favoriteItems));
      } catch (e) {
        console.error("Failed to save favorites to localStorage", e);
      }
    },
    clearFavorites: (state) => {
      state.favoriteItems = [];
      localStorage.removeItem("favoriteItems");
    },
  },
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
