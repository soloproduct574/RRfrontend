"use client";

import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "./slice/AdminAuthSlice.jsx";
import cartReduces from './slice/cartSlice.jsx'
import productReducer from './slice/productSlice.jsx'
import favoritesReducer from "./Slice/favoritesSlice.jsx";
import bannerReducer from "./Slice/Slicebanner.jsx";
import dashboardProduct from './slice/DashboardProductHandle.jsx'
import categoryReducer from "./Slice/FileCategoryMakeSlice.jsx";
import orderReducer  from './slice/OrderSlice.jsx'
import { use } from "react";

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
