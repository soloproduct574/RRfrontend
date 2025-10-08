"use client";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
  Divider,
  Chip,
  Paper,
  Avatar,
  Stack,
  Container,
} from "@mui/material";
import {
  ShoppingCart,
  Payment,
  LocalShipping,
  Security,
  CheckCircle,
  Upload,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Image from "next/image";
import axios from "axios";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { clearCart } from "../../redux/slice/cartSlice.jsx";
import UpiPaymentSection from "./UpiPaymentsec";

const Paymentprocess = () => {
  const dispatch = useDispatch();
  const { cartItems = [] } = useSelector((state) => state.cart);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc + (item.offer_price ?? item.original_price ?? 0) * item.quantity,
    0
  );
  const tax = subtotal * 0.05;
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + tax + shipping;

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
    if (!formData.mobileNumber.trim())
      newErrors.mobileNumber = "Mobile Number is required";
    else if (!/^\d{10}$/.test(formData.mobileNumber))
      newErrors.mobileNumber = "Enter a valid 10-digit mobile number";

    if (
      formData.alternateMobileNumber &&
      !/^\d{10}$/.test(formData.alternateMobileNumber)
    )
      newErrors.alternateMobileNumber = "Enter a valid 10-digit mobile number";

    if (!formData.shippingAddress.trim())
      newErrors.shippingAddress = "Shipping Address is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(formData.pincode))
      newErrors.pincode = "Enter a valid 6-digit pincode";

    if (!formData.paymentMode)
      newErrors.paymentMode = "Payment Mode is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleChange = (e) => {
  const { name, value, files } = e.target;
  if (errors[name]) setErrors({ ...errors, [name]: "" });
  
  if (name === "photo") {
    setFormData({ ...formData, photo: files[0] });
  } else {
    // Ensure paymentMode is always a string, not an array
    let finalValue = value;
    if (name === "paymentMode" && Array.isArray(value)) {
      finalValue = value[0];
    }
    
    setFormData({ ...formData, [name]: finalValue });
    console.log(`Form field updated - ${name}:`, finalValue);
  }
};


const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  
  if (cartItems.length === 0) {
    setSnackbar({
      open: true,
      message: "Your cart is empty. Please add items before placing an order.",
      severity: "error",
    });
    return;
  }

  setLoading(true);

  try {
    // Create FormData
    const submitFormData = new FormData(); // Renamed to avoid conflict
    
    // Add basic fields
    submitFormData.append('name', formData.name);
    submitFormData.append('mobileNumber', formData.mobileNumber);
    submitFormData.append('alternateMobileNumber', formData.alternateMobileNumber || '');
    submitFormData.append('shippingAddress', formData.shippingAddress);
    submitFormData.append('pincode', formData.pincode);
    submitFormData.append('paymentMode', formData.paymentMode);

    // Add photo if exists
    if (formData.photo && formData.photo instanceof File) {
      submitFormData.append('photo', formData.photo);
    }

    // Prepare cart items
    const cartItemsData = cartItems.map(item => ({
      _id: item._id || item.id,
      product_name: item.product_name || item.name,
      product_images: item.product_images || [item.image || ""],
      brands: item.brands || [{ name: item.brand || "Unknown" }],
      original_price: item.original_price || 0,
      offer_price: item.offer_price || null,
      quantity: item.quantity || 1,
    }));

    // Add cart items as JSON
    submitFormData.append('cartItems', JSON.stringify(cartItemsData));
    
    // Prepare order summary
    const orderSummaryData = {
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      itemCount: cartItems.length,
      currency: "INR",
    };

    // Add order summary as JSON
    submitFormData.append('orderSummary', JSON.stringify(orderSummaryData));

    console.log("Submitting order...");

    // Make API request
    const response = await axios.post(
      "https://rrbackend-49lt.onrender.com/api/payment/create",
      submitFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      }
    );

    console.log("Success response:", response.data);

    // Show success message
    const orderData = response.data.data;
    setSnackbar({
      open: true,
      message: `🎉 Order placed successfully!\nOrder Number: ${orderData.orderNumber}`,
      severity: "success",
    });

    // Clear form and cart
    setFormData({
      name: "",
      mobileNumber: "",
      alternateMobileNumber: "",
      shippingAddress: "",
      pincode: "",
      paymentMode: "",
      photo: null,
    });
    
    dispatch(clearCart());

  } catch (error) {
    console.error("Order submission error:", error);
    
    let errorMessage = "Failed to place order. Please try again.";
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    setSnackbar({
      open: true,
      message: errorMessage,
      severity: "error",
    });
  } finally {
    setLoading(false);
  }
};



  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 4,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <ShoppingCart sx={{ fontSize: 80, mb: 2, opacity: 0.8 }} />
            <Typography variant="h4" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
              Add some products to your cart before proceeding to checkout
            </Typography>
            <Button
              variant="contained"
              href="/products"
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                textDecoration: "none",
              }}
            >
              Continue Shopping
            </Button>
          </Paper>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h3"
              sx={{
                textAlign: "center",
                color: "white",
                fontWeight: "bold",
                mb: 1,
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              Complete Your Order
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                color: "rgba(255,255,255,0.8)",
                mb: 4,
              }}
            >
              Review your {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} and provide delivery details
            </Typography>

            <Grid   spacing={4}>
              {/* Left Column - Order Summary */}
              <Grid item xs={12} lg={5} >
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Card
                    sx={{
                      borderRadius: 4,
                      overflow: "hidden",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                      background: "rgba(255,255,255,0.95)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Box
                      sx={{
                        background:
                          "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                        p: 3,
                        color: "white",
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <ShoppingCart sx={{ fontSize: 32 }} />
                        <Box>
                          <Typography variant="h5" fontWeight="bold">
                            Order Summary
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} • ₹{total.toFixed(2)} total
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    <CardContent sx={{ p: 0, maxHeight: 400, overflowY: "auto" }}>
                      {cartItems.map((item, index) => (
                        <motion.div
                          key={item._id || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              p: 3,
                              borderBottom:
                                index !== cartItems.length - 1
                                  ? "1px solid #f0f0f0"
                                  : "none",
                              "&:hover": { bgcolor: "#f8f9ff" },
                              transition: "all 0.2s ease",
                            }}
                          >
                            <Box
                              sx={{
                                position: "relative",
                                width: 80,
                                height: 80,
                                borderRadius: 2,
                                overflow: "hidden",
                                mr: 2,
                                flexShrink: 0,
                              }}
                            >
                              <Image
                                src={
                                  item.product_images?.[0] || "/placeholder.png"
                                }
                                alt={item.product_name}
                                fill
                                style={{ objectFit: "cover" }}
                              />
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography
                                variant="subtitle1"
                                fontWeight="600"
                                sx={{ mb: 0.5 }}
                              >
                                {item.product_name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 1 }}
                              >
                                {item.brands?.[0]?.name || "Unknown Brand"}
                              </Typography>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                <Chip
                                  label={`Qty: ${item.quantity}`}
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                />
                                <Typography
                                  variant="h6"
                                  fontWeight="bold"
                                  color="primary"
                                >
                                  ₹
                                  {(
                                    (item.offer_price ?? item.original_price ?? 0) *
                                    item.quantity
                                  ).toFixed(2)}
                                </Typography>
                              </Stack>
                            </Box>
                          </Box>
                        </motion.div>
                      ))}
                    </CardContent>

                    <Box
                      sx={{
                        p: 3,
                        borderTop: "2px solid #f0f0f0",
                        background:
                          "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
                      }}
                    >
                      <Stack spacing={2}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="body1">Subtotal</Typography>
                          <Typography fontWeight="600">
                            ₹{subtotal.toFixed(2)}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="body1">Tax (5%)</Typography>
                          <Typography fontWeight="600">
                            ₹{tax.toFixed(2)}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="body1">Shipping</Typography>
                          <Typography fontWeight="600">
                            {shipping === 0 ? "FREE" : `₹${shipping}`}
                          </Typography>
                        </Stack>
                        {shipping === 0 && (
                          <Typography variant="caption" color="success.main">
                            🎉 Free shipping on orders above ₹1000
                          </Typography>
                        )}
                        <Divider />
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="h6" fontWeight="bold">
                            Total Amount
                          </Typography>
                          <Typography
                            variant="h5"
                            fontWeight="bold"
                            color="primary"
                          >
                            ₹{total.toFixed(2)}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  </Card>
                  </motion.div>

                  {/* UPI Payment Section
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <Card
                      sx={{
                        mt: 3,
                        borderRadius: 4,
                        overflow: "hidden",
                        boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
                        background: "rgba(255,255,255,0.95)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <Box
                        sx={{
                          background:
                            "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                          p: 3,
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        <Payment sx={{ fontSize: 32, mb: 1 }} />
                        <Typography variant="h6" fontWeight="bold">
                          Quick UPI Payment
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Scan & pay ₹{total.toFixed(2)} instantly
                        </Typography>
                      </Box>
                      <Box sx={{ p: 3, textAlign: "center" ,display:"flex",flexDirection:"column",alignItems:"center"}}>
                        <Box
                          component="img"
                          src="/upiscanner.jpg"
                          alt="UPI Scanner"
                          sx={{
                            width: 250, 
                            height: 250,
                            borderRadius: 3,
                            mb: 2,
                            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                            objectFit: "cover",
                          }}
                        />
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          8098264616@ptyes
                        </Typography>
                        <Chip
                          label="8098264616"
                          color="primary"
                          variant="outlined"
                          sx={{ fontWeight: "bold" }}
                        />
                        <Typography variant="caption" display="block" sx={{ mt: 1, color: "text.secondary" }}>
                          After payment, upload screenshot below
                        </Typography>
                      </Box>
                    </Card>
                  </motion.div> */}
                
                <UpiPaymentSection total={total} />
              </Grid>

              {/* Right Column - Payment Form */}
              <Grid item xs={12} lg={7} mt={{ xs: 4, lg: 5 }}>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Card
                    sx={{
                      borderRadius: 4,
                      overflow: "hidden",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                      background: "rgba(255,255,255,0.95)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Box
                      sx={{
                        background:
                          "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                        p: 4,
                        color: "white",
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <LocalShipping sx={{ fontSize: 32 }} />
                        <Box>
                          <Typography variant="h5" fontWeight="bold">
                            Delivery & Payment Details
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Complete your order for ₹{total.toFixed(2)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    <CardContent sx={{ p: 4 }}>
                      <form onSubmit={handleSubmit}>
                        <Grid  container display={"grid"} spacing={3}>
                          <Grid item xs={12}>
                            <Typography
                              variant="h6"
                              sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
                            >
                              <Avatar sx={{ bgcolor: "primary.main", width: 24, height: 24 }}>
                                1
                              </Avatar>
                              Personal Information
                            </Typography>
                          </Grid>
<Grid container spacing={2} mb={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              label="Full Name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              error={!!errors.name}
                              helperText={errors.name}
                              // fullWidth
                              required
                              variant="outlined"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                },
                              }}
                            />
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <TextField
                              label="Mobile Number"
                              name="mobileNumber"
                              value={formData.mobileNumber}
                              onChange={handleChange}
                              error={!!errors.mobileNumber}
                              helperText={errors.mobileNumber}
                              // fullWidth
                              required
                              inputProps={{ maxLength: 10 }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                },
                              }}
                            />
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <TextField
                              label="Alternate Mobile Number"
                              name="alternateMobileNumber"
                              value={formData.alternateMobileNumber}
                              onChange={handleChange}
                              error={!!errors.alternateMobileNumber}
                              helperText={errors.alternateMobileNumber}
                              // fullWidth
                              inputProps={{ maxLength: 10 }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                },
                              }}
                            />
                          </Grid>
</Grid>
                          

                          <Grid item xs={12}>
                            <TextField
                              label="Complete Shipping Address"
                              name="shippingAddress"
                              value={formData.shippingAddress}
                              onChange={handleChange}
                              error={!!errors.shippingAddress}
                              helperText={errors.shippingAddress}
                              fullWidth
                              multiline
                              rows={3}
                              required
                              placeholder="Enter your complete address with house number, street, area, city, state..."
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              label="Pincode"
                              name="pincode"
                              value={formData.pincode}
                              onChange={handleChange}
                              error={!!errors.pincode}
                              helperText={errors.pincode}
                              // fullWidth
                              required
                              inputProps={{ maxLength: 6 }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                },
                              }}
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <Divider sx={{ my: 2 }} />
                            <Typography
                              variant="h6"
                              sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
                            >
                              <Avatar sx={{ bgcolor: "secondary.main", width: 24, height: 24 }}>
                                2
                              </Avatar>
                              Payment Details
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth required error={!!errors.paymentMode}>
                              <InputLabel>Payment Mode</InputLabel>
                              <Select
                                name="paymentMode"
                                value={formData.paymentMode}
                                onChange={handleChange}
                                label="Payment Mode"
                                sx={{ borderRadius: 2 }}
                              >
                                {/* <MenuItem value="Cash on Delivery">
                                
                                </MenuItem> */}
                                <MenuItem value="UPI">📱 UPI (Recommended)</MenuItem>
                                {/* <MenuItem value="Credit Card">💳</MenuItem>
                                <MenuItem value="Debit Card">💳</MenuItem>
                                <MenuItem value="Net Banking">🏦</MenuItem> */}
                              </Select>
                              {errors.paymentMode && (
                                <Typography variant="caption" color="error">
                                  {errors.paymentMode}
                                </Typography>
                              )}
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Button
                              variant="outlined"
                              component="label"
                              fullWidth
                              startIcon={<Upload />}
                              sx={{
                                height: 56,
                                borderRadius: 2,
                                borderStyle: "dashed",
                                "&:hover": {
                                  borderStyle: "solid",
                                  bgcolor: "rgba(25, 118, 210, 0.04)",
                                },
                              }}
                            >
                              {formData.photo
                                ? "Change Screenshot"
                                : "Upload Payment Screenshot"}
                              <input
                                type="file"
                                name="photo"
                                hidden
                                accept="image/*,.pdf,.doc,.docx"
                                onChange={handleChange}
                              />
                            </Button>
                            {formData.photo && (
                              <Typography
                                variant="body2"
                                sx={{
                                  mt: 1,
                                  color: "success.main",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <CheckCircle fontSize="small" />
                                {formData.photo.name}
                              </Typography>
                            )}
                          </Grid>

                          <Grid item xs={12}>
                            <motion.div
                              whileHover={{ scale: loading ? 1 : 1.02 }}
                              whileTap={{ scale: loading ? 1 : 0.98 }}
                            >
                              <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                startIcon={
                                  loading ? (
                                    <CircularProgress size={20} color="inherit" />
                                  ) : (
                                    <Security />
                                  )
                                }
                                sx={{
                                  py: 1.5,
                                  fontSize: "1.1rem",
                                  borderRadius: 3,
                                  background:
                                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                  boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
                                  "&:hover": {
                                    background:
                                      "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                                    transform: loading ? "none" : "translateY(-2px)",
                                    boxShadow: loading ? "0 8px 25px rgba(102, 126, 234, 0.4)" : "0 12px 35px rgba(102, 126, 234, 0.5)",
                                  },
                                  "&:disabled": {
                                    background: "#cccccc",
                                    color: "#666666",
                                  },
                                  width: "100%",
                                  textTransform: "none",
                                  fontWeight: "bold",
                                }}
                              >
                                {loading
                                  ? "Processing Order..."
                                  : `Place Order • ₹${total.toFixed(2)}`}
                              </Button>
                            </motion.div>

                            <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent="center"
                              spacing={2}
                              sx={{ mt: 2 }}
                            >
                              <Security fontSize="small" color="success" />
                              <Typography variant="body2" color="text.secondary">
                                100% Secure & Encrypted Payment • SSL Protected
                              </Typography>
                            </Stack>
                          </Grid>
                        </Grid>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ 
            width: "100%", 
            borderRadius: 2,
            whiteSpace: "pre-line" // This allows line breaks in the message
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Footer />
    </>
  );
};

export default Paymentprocess;
