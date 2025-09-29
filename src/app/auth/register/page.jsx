"use client";

import React, { useState } from "react";
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
  Link,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RegisterModal({ open, onClose, onSwitchToLogin }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState(null);

  // ✅ Toggle states for eye icons
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordValue = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    setServerMsg(null);

    try {
      await axios.post("https://rrbackend-49lt.onrender.com/api/auth/register", data);
      setServerMsg({ type: "success", text: "🎉 Registered successfully!" });

      // Auto-close after success
      setTimeout(() => {
        onClose?.();
        router.push("/auth/login");
      }, 1500);
    } catch (err) {
      setServerMsg({
        type: "error",
        text: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "rgba(255, 255, 255, 0.1)",
        //   backdropFilter: "blur(1px)",
        //    WebkitBackdropFilter: "blur(1px)",
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
            elevation={8}
            sx={{
              width: { xs: "90%", sm: 400 },
              p: 4,
              borderRadius: 3,
              position: "relative",
              backgroundColor: "#fff",
              boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.2)",
            }}
          >
            {/* Close Button */}
            <motion.div
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.9, rotate: -90 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{ position: "absolute", top: 8, right: 8 }}
            >
              <IconButton
                onClick={() => {
                  onClose?.();
                  router.push("/");
                }}
                sx={{
                  color: "error.main",
                  bgcolor: "rgba(255,0,0,0.08)",
                  "&:hover": { bgcolor: "rgba(255,0,0,0.15)" },
                  borderRadius: "50%",
                  boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
                }}
              >
                <CloseIcon />
              </IconButton>
            </motion.div>

            {/* Title */}
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              textAlign="center"
              sx={{ mb: 3 }}
            >
              Connect To Us
            </Typography>

            {/* Alerts */}
            {serverMsg && (
              <Alert severity={serverMsg.type} sx={{ mb: 2, borderRadius: 2 }}>
                {serverMsg.text}
              </Alert>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <TextField
                label="Full Name"
                fullWidth
                margin="normal"
                {...register("fullName", { required: "Full Name is required" })}
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
              />

              <TextField
                label="Mobile Number"
                fullWidth
                margin="normal"
                {...register("mobileNumber", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter a valid 10-digit number",
                  },
                })}
                error={!!errors.mobileNumber}
                helperText={errors.mobileNumber?.message}
              />

              <TextField
                label="Email"
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
                sx={{
                  mt: 3,
                  background: "#ff6600",
                  fontWeight: 600,
                  borderRadius: 2,
                  height: 45,
                  fontSize: "1rem",
                  "&:hover": { background: "#e65c00" },
                }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={22} sx={{ color: "#fff" }} />
                ) : (
                  "Register"
                )}
              </Button>
            </Box>

            {/* Already have an account? */}
            <Typography
              variant="body2"
              textAlign="center"
              sx={{ mt: 3, color: "text.secondary" }}
            >
              Already have an account?{" "}
              <Link
                component="button"
                underline="hover"
                sx={{
                  color: "#ff6600",
                  fontWeight: 600,
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={()=> router.push('/dashboard')}
              >
                RR _Login
              </Link>
            </Typography>
          </Paper>
        </motion.div>
      </Box>
    </Modal>
  );
}
