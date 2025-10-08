import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "./slice/adminAuthSlice.jsx";
import cartReduces from './slice/cartSlice.jsx'
import productReducer from './slice/productSlice.jsx'
import favoritesReducer from "./slice/favoritesSlice.jsx";
import bannerReducer from "./slice/bannerSlice.jsx";
import dashboardProduct from './slice/dashboardProductHandle.jsx'
import categoryReducer from "./slice/categoryFileMakeSlice.jsx";
import orderReducer  from './slice/orderSlice.jsx'

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
