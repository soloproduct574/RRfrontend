import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "./Slice/AdminAuthSlice.jsx";
import cartReduces from './Slice/cartSlice.jsx'
import productReducer from './Slice/productSlice.jsx'
import favoritesReducer from "./Slice/favoritesSlice.jsx";
const store = configureStore({
  reducer: {
    auth: adminAuthReducer,
    cart:cartReduces,
    products: productReducer,
    favorites: favoritesReducer,
  },
});

// ✅ Make sure we export default store
export default store;
