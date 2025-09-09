"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTokenFromStorage, fetchAdminDashboard } from "../../Redux/Slice/AdminAuthSlice";

import LoginPopup from "../../components/dashboards/adminLoginPopup/loginAdminPopup";
import AdminSidebar from "@/components/dashboards/AdminSideBar";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { admin, token, loading, dashboardMessage } = useSelector((state) => state.auth);

  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    dispatch(setTokenFromStorage());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(fetchAdminDashboard());
      setShowLogin(false);
    } else {
      setShowLogin(true);
    }
  }, [dispatch, token]);

  if (loading && !admin) return <p className="text-center mt-10">⏳ Loading...</p>;

  return (
    <div className="flex h-screen">
      {/* Show Login Popup if no admin */}
      {showLogin && <LoginPopup onSuccess={() => dispatch(fetchAdminDashboard())} />}

      {/* Sidebar */}
      {admin && <AdminSidebar onLogout={() => setShowLogin(true)} />}

    </div>
  );
}
