"use client";

import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Divider,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import { removeFromCart } from "@/Redux/Slice/cartSlice";
import Sidebar from "../../components/SidebarCarts/page";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function CartPage() {
  const dispatch = useDispatch();
  const { cartItems = [] } = useSelector((state) => state.cart);

  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc + (item.offer_price ?? item.original_price ?? 0) * item.quantity,
    0
  );

  const tax = subtotal * 0.05;
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + tax + shipping;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "#f5f5f5",
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Sidebar + Content */}
      <Box sx={{ display: "flex", flex: 1 }}>
        <Sidebar />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 4 },
            textAlign: "center",
            pr: { md: "350px" }, // ✅ space for fixed summary card
          }}
        >
          <Typography variant="h4" gutterBottom fontWeight="bold">
            🛒 Your Cart
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {/* Empty Cart */}
          {cartItems.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Image
                src="/emptycart.jpg"
                alt="Empty Cart"
                width={200}
                height={200}
              />
              <Typography variant="h5" fontWeight="bold">
                Your cart is empty 😕
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 400 }}
              >
                Looks like you haven’t added anything to your cart yet. Explore
                our popular products and start shopping!
              </Typography>

              <Button
                variant="contained"
                color="primary"
                href="/products"
                sx={{
                  mt: 2,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontSize: "1rem",
                }}
              >
                Browse Products
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {cartItems.map((item) => {
                const price = item.offer_price ?? item.original_price ?? 0;
                return (
                  <Grid item xs={12} sm={6} md={4} key={item._id}>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        sx={{
                          minWidth: 280,
                          maxWidth: 350,
                          margin: "0 auto",
                          borderRadius: "16px",
                          overflow: "hidden",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          background: "#fff",
                          display: "flex",
                          flexDirection: "column",
                          transition: "box-shadow 0.3s ease",
                          "&:hover": {
                            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                          },
                        }}
                      >
                        {/* Product Image */}
                        <Box
                          sx={{
                            position: "relative",
                            height: 200,
                            overflow: "hidden",
                          }}
                        >
                          <Image
                            src={item.product_images?.[0] || "/placeholder.png"}
                            alt={item.product_name}
                            fill
                            style={{
                              objectFit: "cover",
                              transition: "transform 0.3s ease",
                            }}
                          />
                        </Box>

                        {/* Product Info */}
                        <CardContent sx={{ p: 2 }}>
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            noWrap
                          >
                            {item.product_name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                          >
                            Brand: {item.brands?.[0]?.name || "Unknown"}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                          >
                            Price: ₹{price} × {item.quantity}
                          </Typography>

                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="success.main"
                            sx={{ mt: 1 }}
                          >
                            ₹{price * item.quantity}
                          </Typography>

                          <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            sx={{
                              mt: 2,
                              textTransform: "none",
                              borderRadius: "12px",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                background: "#ffebee",
                                transform: "scale(1.05)",
                              },
                            }}
                            onClick={() => dispatch(removeFromCart(item._id))}
                          >
                            Remove
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>

        {/* FIXED SUMMARY CARD */}
        {cartItems.length > 0 && (
          <Box
            sx={{
              position: "fixed",
              top: 100,
              right: 20,
              width: 300,
              p: 3,
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              borderRadius: "16px",
              background: "#fff",
              zIndex: 1500,
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              🧾 Order Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Typography
              variant="body1"
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <span>Subtotal</span> <strong>₹{subtotal.toFixed(2)}</strong>
            </Typography>
            <Typography
              variant="body1"
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <span>Tax (5%)</span> <strong>₹{tax.toFixed(2)}</strong>
            </Typography>
            <Typography
              variant="body1"
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <span>Shipping</span>{" "}
              <strong>{shipping === 0 ? "Free" : `₹${shipping}`}</strong>
            </Typography>

            <Divider sx={{ my: 2 }} />
            <Typography
              variant="h5"
              fontWeight="bold"
              color="primary"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <span>Total</span> <span>₹{total.toFixed(2)}</span>
            </Typography>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                borderRadius: "14px",
                textTransform: "none",
                fontSize: "1.1rem",
                py: 1.5,
                transition: "transform 0.2s ease, background 0.3s ease",
                "&:hover": {
                  transform: "scale(1.03)",
                  backgroundColor: "#1565c0",
                },
              }}
            >
              🛍 Secure Checkout
            </Button>
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          background: "#fff",
          boxShadow: "0 -2px 6px rgba(0,0,0,0.1)",
          zIndex: 2000,
          position: "relative",
        }}
      >
        <Footer />
      </Box>
    </Box>
  );
}
