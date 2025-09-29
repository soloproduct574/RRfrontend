import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "./Slice/AdminAuthSlice.jsx";
import cartReduces from './Slice/cartSlice.jsx'
import productReducer from './Slice/productSlice.jsx'
import favoritesReducer from "./Slice/favoritesSlice.jsx";
import bannerReducer from "./Slice/BannerSlice.jsx";
import dashboardProduct from './Slice/DashboardProductHandle.jsx'

const store = configureStore({
  reducer: {
    auth: adminAuthReducer,
    cart:cartReduces,
    products: productReducer,
    favorites: favoritesReducer,
    banners: bannerReducer,
    dashboardProduct:dashboardProduct

  },
});

export default store;
