import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "./slice/AdminAuthSlice.jsx";
import cartReduces from './slice/cartSlice.jsx'
import productReducer from './slice/productSlice.jsx'
import favoritesReducer from "./slice/favoritesSlice.jsx";
import bannerReducer from "./slice/BannerSlice.jsx";
import dashboardProduct from './slice/DashboardProductHandle.jsx'
import categoryReducer from "./slice/CategoryFileMakeSlice.jsx";
import orderReducer  from './slice/OrderSlice.jsx'

const store = configureStore({
  reducer: {
    auth: adminAuthReducer,
    cart:cartReduces,
    products: productReducer,
    favorites: favoritesReducer,
    banners: bannerReducer,
    dashboardProduct:dashboardProduct,
    categoryReducer:categoryReducer,
    orders:orderReducer 

  },
});

export default store;
