"use client";

import React, { useState } from "react";
import {
  Modal,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
  Alert,
  IconButton,
  Link,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginModal({ open, onClose, onSwitchToRegister }) {
  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [forgotSnackbarOpen, setForgotSnackbarOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      setSnackbarOpen(true);
      setTimeout(() => {
        onClose();
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ Snackbar for Login Success */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Successfully logged in!
        </Alert>
      </Snackbar>

      {/* ✅ Snackbar for Forgot Password */}
      <Snackbar
        open={forgotSnackbarOpen}
        autoHideDuration={2000}
        onClose={() => setForgotSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setForgotSnackbarOpen(false)}
          severity="info"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Please contact the site owner to reset your password.
        </Alert>
      </Snackbar>

      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            bgcolor: "rgba(255, 255, 255, 0.1)",
            // backdropFilter: "blur(4px)",
            p: 2,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Paper
              elevation={8}
              sx={{
                width: { xs: "85%", sm: 380 },
                minHeight: 360,
                p: 4,
                borderRadius: 3,
                position: "relative",
                backgroundColor: "#fff",
                boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.2)",
              }}
            >
              {/* Close Button */}
              <motion.div
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9, rotate: -90 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                }}
              >
                <IconButton
                  onClick={onClose}
                  sx={{
                    color: "error.main",
                    bgcolor: "rgba(255,0,0,0.08)",
                    "&:hover": {
                      bgcolor: "rgba(255,0,0,0.15)",
                    },
                    borderRadius: "50%",
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </motion.div>

              {/* Title */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  textAlign: "center",
                  mb: 3,
                  color: "#2e2e2e",
                }}
              >
                Welcome Back!!!
              </Typography>

              {/* Error Alert */}
              {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              {/* Login Form */}
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  variant="outlined"
                  value={formData.email}
                  onChange={handleChange}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Password Field with Eye Icon */}
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  value={formData.password}
                  onChange={handleChange}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Login Button */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    mt: 3,
                    background: "#ff6600",
                    height: 40,
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: "none",
                    "&:hover": {
                      background: "#ff6600",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={22} sx={{ color: "#fff" }} />
                  ) : (
                    "Login"
                  )}
                </Button>

                {/* Forgot Password */}
                <Link
                  href="#"
                  underline="none"
                  onClick={(e) => {
                    e.preventDefault();
                    setForgotSnackbarOpen(true);
                  }}
                  sx={{
                    display: "block",
                    textAlign: "center",
                    mt: 2,
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    color: "#ff6600",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Forgot your password?
                </Link>

                {/* New User Section */}
                <Typography
                  variant="body2"
                  sx={{
                    mt: 3,
                    textAlign: "center",
                    color: "#555",
                  }}
                >
                  New here?{" "}
                  <Link
                    component="button"
                    underline="hover"
                    sx={{
                      fontWeight: 600,
                      color: "#ff6600",
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                    onClick={onSwitchToRegister}
                  >
                    Create an account
                  </Link>
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        </Box>
      </Modal>
    </>
  );
}
