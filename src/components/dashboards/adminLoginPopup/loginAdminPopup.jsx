"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin, setTokenFromStorage, fetchAdminDashboard } from "../../../Redux/Slice/AdminAuthSlice";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const { token, admin, loading, error } = useSelector((state) => state.auth);

  // ✅ If already logged in, redirect to dashboard
  useEffect(() => {
    dispatch(setTokenFromStorage());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(fetchAdminDashboard()).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          router.push("/dashboard");
        }
      });
    }
  }, [token, dispatch, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginAdmin({ login, password }));
    if (result.meta.requestStatus === "fulfilled") {
      router.push("/dashboard");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        {error && <p className="text-red-600 mb-3">{error}</p>}
        <input
          type="text"
          placeholder="Email or Username"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
