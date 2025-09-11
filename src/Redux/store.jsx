import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "./Slice/AdminAuthSlice.jsx";
import cartReduces from './Slice/cartSlice.jsx'
const store = configureStore({
  reducer: {
    auth: adminAuthReducer,
    cart:cartReduces,
  },
});

// ✅ Make sure we export default store
export default store;
