"use client";
import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ✅ API call: matches backend route
const registerUser = (formData) =>
  axios.post("http://localhost:5000/api/auth/register", formData, {
    headers: { "Content-Type": "application/json" },
  });

export default function RegisterModal({ open, onClose }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState(null);

  // ✅ Submit function (only sending fullName, mobileNumber, email)
  const onSubmit = async (data) => {
    setLoading(true);
    setServerMsg(null);

    const formData = {
      fullName: data.fullName?.trim() || "",
      mobileNumber: data.mobileNumber?.trim() || "",
      email: data.email?.trim().toLowerCase() || "",
    };
console.log(formData);
    // Basic frontend required validation
    if (!formData.fullName || !formData.mobileNumber || !formData.email) {
      setServerMsg({ type: "error", text: "All fields are required" });
      setLoading(false);
      return;
    }
    

    try {
      const response = await registerUser(formData);

      if (response.data.success) {
        // ✅ Save tokens and user object in localStorage
        localStorage.setItem("accessToken", response.data.tokens.access);
        localStorage.setItem("refreshToken", response.data.tokens.refresh);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setServerMsg({
          type: "success",
          text: "🎉 Our Team Will Contact You Soon!",
        });

        setTimeout(() => {
          reset();
          onClose?.();
          // router.push("/dashboard"); // Optional redirect
        }, 2000);
      }
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);

      let message =
        err.response?.data?.message ||
        "⚠️ Unable to register right now. Please try again later.";

      // Handle duplicate errors from backend
      if (err.response?.status === 400) {
        const msg = err.response?.data?.message;
        if (msg?.includes("email")) message = "📧 Email already exists!";
        if (msg?.includes("mobileNumber"))
          message = "📱 Mobile number already exists!";
      }

      setServerMsg({ type: "error", text: message });
    } finally {
      setLoading(false);
    }
  };

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      reset();
      setServerMsg(null);
    }
  }, [open, reset]);

  const handleClose = () => {
    reset();
    setServerMsg(null);
    onClose?.();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="register-modal-title"
      aria-describedby="register-modal-description"
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
          p: 2,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -30 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <Paper
            elevation={24}
            sx={{
              width: { xs: "90%", sm: 420 },
              p: 4,
              borderRadius: 3,
              position: "relative",
              backgroundColor: "#fff",
              boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.3)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            {/* Close Button */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{ position: "absolute", top: 12, right: 12 }}
            >
              <IconButton
                onClick={handleClose}
                sx={{
                  color: "#666",
                  bgcolor: "rgba(0,0,0,0.05)",
                  "&:hover": {
                    bgcolor: "rgba(0,0,0,0.1)",
                    color: "#000",
                  },
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                }}
              >
                <CloseIcon />
              </IconButton>
            </motion.div>

            {/* Title */}
            <Typography
              id="register-modal-title"
              variant="h4"
              fontWeight="bold"
              gutterBottom
              textAlign="center"
              sx={{
                mb: 3,
                background: "linear-gradient(45deg, #ff6600, #ff8c00)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Connect To Us
            </Typography>

            {/* Alerts */}
            {serverMsg && (
              <Alert
                severity={serverMsg.type}
                sx={{ mb: 3, borderRadius: 2, alignItems: "center" }}
              >
                {serverMsg.text}
              </Alert>
            )}

            {/* Form */}
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              aria-describedby="register-modal-description"
            >
              {/* Full Name */}
              <TextField
                label="Full Name"
                fullWidth
                margin="normal"
                variant="outlined"
                {...register("fullName", {
                  required: "Full Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Name can only contain letters and spaces",
                  },
                })}
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
                sx={{ mb: 2 }}
              />

              {/* Mobile Number */}
              <TextField
                label="Mobile Number"
                fullWidth
                margin="normal"
                variant="outlined"
                {...register("mobileNumber", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter a valid 10-digit number",
                  },
                })}
                error={!!errors.mobileNumber}
                helperText={errors.mobileNumber?.message}
                sx={{ mb: 2 }}
              />

              {/* Email */}
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                margin="normal"
                {...register("email", { required: "Email is required" })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              {/* Password Field with Eye Icon */}
              {/* <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters required",
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
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
              /> */}

              {/* Confirm Password Field with Eye Icon */}
              {/* <TextField
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === passwordValue || "Passwords do not match",
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword((prev) => !prev)
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              /> */}

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 2,
                  background: "linear-gradient(45deg, #ff6600, #ff8c00)",
                  fontWeight: 700,
                  borderRadius: 2,
                  height: 50,
                  fontSize: "1.1rem",
                  textTransform: "none",
                  boxShadow: "0px 4px 15px rgba(255, 102, 0, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #e65c00, #e67e00)",
                    boxShadow: "0px 6px 20px rgba(255, 102, 0, 0.4)",
                    transform: "translateY(-1px)",
                  },
                  "&:disabled": { background: "#ccc", boxShadow: "none" },
                  transition: "all 0.3s ease",
                }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : (
                  "CONTACT US"
                )}
              </Button>
            </Box>

   <Typography
  variant="body2"
  textAlign="center"
  sx={{ mt: 3, color: "text.secondary" }}
>
  Already have an account?{" "}
  <Button
    onClick={() => router.push("/dashboard")}
    sx={{
      color: "#ff6600",
      fontWeight: 600,
      textTransform: "none",
      p: 0,
      minWidth: "auto",
      "&:hover": {
        textDecoration: "underline",
        background: "transparent",
      },
    }}
  >
    RR _Login
  </Button>
</Typography>
          </Paper>
        </motion.div>
      </Box>
    </Modal>
  );
}
