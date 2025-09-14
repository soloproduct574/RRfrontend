import { createSlice } from "@reduxjs/toolkit";

// ✅ Load from localStorage if available
const savedCart = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("cartItems") || "[]") : [];

const initialState = {
  cartItems: savedCart,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const price = item.offer_price ?? item.original_price ?? 0;
      const cartItem = { ...item, price };

      const existingItem = state.cartItems.find((i) => i._id === cartItem._id);
      if (existingItem) {
        existingItem.quantity += cartItem.quantity;
      } else {
        state.cartItems.push(cartItem);
      }

      // ✅ Save updated cart to localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((i) => i._id !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    decreaseQuantity: (state, action) => {
      const item = state.cartItems.find((p) => p._id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.cartItems = state.cartItems.filter((p) => p._id !== action.payload);
        }
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    },
  },
});

export const { addToCart, removeFromCart, decreaseQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;