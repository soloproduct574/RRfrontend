"use client";
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import axios from "axios";

const Paymentprocess = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    alternateMobileNumber: "",
    shippingAddress: "",
    pincode: "",
    paymentMode: "",
    photo: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = "Mobile Number is required";
    else if (!/^\d{10}$/.test(formData.mobileNumber)) newErrors.mobileNumber = "Enter a valid 10-digit mobile number";

    if (formData.alternateMobileNumber && !/^\d{10}$/.test(formData.alternateMobileNumber))
      newErrors.alternateMobileNumber = "Enter a valid 10-digit mobile number";

    if (!formData.shippingAddress.trim()) newErrors.shippingAddress = "Shipping Address is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Enter a valid 6-digit pincode";

    if (!formData.paymentMode) newErrors.paymentMode = "Payment Mode is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    if (name === "photo") setFormData({ ...formData, photo: files[0] });
    else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const data = new FormData();
      for (let key in formData) if (formData[key] !== null && formData[key] !== "") data.append(key, formData[key]);

      const res = await axios.post("http://localhost:5000/api/payment/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 10000,
      });

      setSnackbar({ open: true, message: "Payment details saved successfully!", severity: "success" });

      setFormData({
        name: "",
        mobileNumber: "",
        alternateMobileNumber: "",
        shippingAddress: "",
        pincode: "",
        paymentMode: "",
        photo: null,
      });

      console.log(res.data);
    } catch (err) {
      console.error("Submission error:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to save payment details. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: 'url("/payment.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden", // Prevent page scroll
        p: { xs: 1, md: 2 },
      }}
    >
      <Card
        sx={{
          width: { xs: "95%", md: "80%" },
          maxWidth: 1000,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          borderRadius: 4,
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          overflow: "hidden",
          backgroundColor: "rgba(255,255,255,0.95)",
        }}
      >
        {/* LEFT SIDE */}
        <Box
          sx={{
            flex: 1,
            background: "linear-gradient(135deg, #5E35B1, #4527A0)",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 3, md: 4 },
            textAlign: "center",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
            Scan to Pay via UPI
          </Typography>
          <Box
            component="img"
            src="/upiscanner.jpg"
            alt="UPI Scanner"
            sx={{
              width: 250,
              height: 250,
              borderRadius: 3,
              mb: 3,
              boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
              backgroundColor: "#fff",
              p: 1,
              objectFit: "cover",
            }}
          />
          <Typography>UPI ID: 8098264616@ptyes</Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
            8098264616
          </Typography>
        </Box>

        {/* RIGHT SIDE - FORM */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.98)",
            p: { xs: 2, md: 4 },
            overflowY: "auto", // allows internal scroll if content is long
          }}
        >
          <CardContent
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: "100%",
              maxWidth: 450,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#512da8", textAlign: "center", mb: 1 }}>
              Payment Form
            </Typography>

            <TextField label="Full Name" name="name" value={formData.name} onChange={handleChange} error={!!errors.name} helperText={errors.name} fullWidth required />
            <TextField label="Mobile Number" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} error={!!errors.mobileNumber} helperText={errors.mobileNumber} fullWidth required inputProps={{ maxLength: 10 }} />
            <TextField label="Alternate Mobile Number" name="alternateMobileNumber" value={formData.alternateMobileNumber} onChange={handleChange} error={!!errors.alternateMobileNumber} helperText={errors.alternateMobileNumber} fullWidth inputProps={{ maxLength: 10 }} />
            <TextField label="Shipping Address" name="shippingAddress" value={formData.shippingAddress} onChange={handleChange} error={!!errors.shippingAddress} helperText={errors.shippingAddress} fullWidth multiline rows={2} required />
            <TextField label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} error={!!errors.pincode} helperText={errors.pincode} fullWidth required inputProps={{ maxLength: 6 }} />

            <FormControl fullWidth required error={!!errors.paymentMode}>
              <InputLabel>Payment Mode</InputLabel>
              <Select name="paymentMode" value={formData.paymentMode} onChange={handleChange} label="Payment Mode">
                <MenuItem value="Cash on Delivery">Cash on Delivery</MenuItem>
                <MenuItem value="Credit Card">Credit Card</MenuItem>
                <MenuItem value="Debit Card">Debit Card</MenuItem>
                <MenuItem value="UPI">UPI</MenuItem>
                <MenuItem value="Net Banking">Net Banking</MenuItem>
              </Select>
              {errors.paymentMode && <Typography variant="caption" color="error">{errors.paymentMode}</Typography>}
            </FormControl>

            <Button variant="outlined" component="label" sx={{ borderColor: "#673ab7", color: "#673ab7", "&:hover": { borderColor: "#512da8", backgroundColor: "rgba(103,58,183,0.04)" }, textTransform: "none", fontSize: "0.95rem", py: 1.2 }}>
              {formData.photo ? "Change Payment Proof" : "Upload Payment Proof"}
              <input type="file" name="photo" hidden accept="image/*,.pdf,.doc,.docx" onChange={handleChange} />
            </Button>
            {formData.photo && <Typography variant="body2" sx={{ color: "#2e7d32", fontStyle: "italic", display: "flex", alignItems: "center", gap: 1 }}>✓ {formData.photo.name}</Typography>}

            <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ py: 1.4, fontSize: "1rem", borderRadius: 2, mt: 1, textTransform: "none", backgroundColor: "#512da8", "&:hover": { backgroundColor: "#3d1e94" }, "&:disabled": { backgroundColor: "#cccccc", color: "#666666" } }}>
              {loading ? <CircularProgress size={24} /> : "Submit Payment"}
            </Button>
          </CardContent>
        </Box>
      </Card>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Paymentprocess;
