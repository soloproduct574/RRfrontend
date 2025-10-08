"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginAdmin,
  setTokenFromStorage,
  fetchAdminDashboard,
} from "../../../redux/slice/AdminAuthSlice";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Alert,
  InputAdornment,
  Container,
} from "@mui/material";
import { Email, Lock } from "@mui/icons-material";

export default function AdminLoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const { token, loading, error } = useSelector((state) => state.auth);

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
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
         backgroundImage: "url('/adminbg.jpg')", 
    backgroundSize: "cover", 
    backgroundPosition: "center", 
    backgroundRepeat: "no-repeat",
      }}
    >
      {/* <AdminSidebar/> */}
      <Container maxWidth="sm">
        <Box
          sx={{
            p: 5,
    borderRadius: 3,
    boxShadow: 6,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.3)", 
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            gutterBottom
          >
            Admin Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Username / Email */}
            <TextField
              margin="normal"
              fullWidth
              required
              label="Email or Username"
             
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Password */}
            <TextField
              margin="normal"
              fullWidth
              required
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                fontWeight: "bold",
                textTransform: "none",
                background: "#4f46e5",
                "&:hover": {
                  background: "linear-gradient(45deg, #4338ca, #7e22ce)",
                },
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
