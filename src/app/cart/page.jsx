"use client";
import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";
import { removeFromCart } from "@/Redux/Slice/cartSlice";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";
import Paymentmode from "../paymentmode/page";

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { cartItems = [] } = useSelector((state) => state.cart);

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (acc, item) =>
          acc + (item.offer_price ?? item.original_price ?? 0) * item.quantity,
        0
      ),
    [cartItems]
  );

  const tax = useMemo(() => subtotal * 0.05, [subtotal]);
  const shipping = useMemo(() => (subtotal > 1000 ? 0 : 50), [subtotal]);
  const total = subtotal + tax + shipping;
  const handleBuyNow = () => {
  router.push("/paymentmode");
};

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #f8fafc, #e3f2fd)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      {/* Top Buttons instead of Sidebar */}
      <TopBarButtons />

      {/* Sidebar just below Navbar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          textAlign: "center",
        }}
      >
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
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 400 }}
            >
              Looks like you haven’t added anything yet. Start exploring now!
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
          <>
            <Grid
              container
              spacing={3}
              sx={{
                justifyContent: { xs: "center", sm: "flex-start" },
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              {cartItems.map((item) => {
                const price = item.offer_price ?? item.original_price ?? 0;
                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={item._id}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        sx={{
                          minWidth: 250,
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
                          <Typography variant="subtitle1" fontWeight="bold" noWrap>
                            {item.product_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
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

            {/* Responsive Summary Card */}
            <Box
              sx={{
                mt: { xs: 4, md: 0 },
                position: { xs: "relative", md: "fixed" },
                top: { md: 100 },
                right: { md: 20 },
                width: { xs: "100%", sm: "90%", md: 300 },
                mx: { xs: "auto", md: 0 },
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
              onClick={handleBuyNow}
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  borderRadius: "14px",
                  textTransform: "none",
                  fontSize: "1.1rem",
                  py: 1.5,
                  "&:hover": {
                    transform: "scale(1.03)",
                    backgroundColor: "#1565c0",
                  },
                }}
              >
                Buy Now
              </Button>
            </Box>
          </>
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

      <Footer />
    </Box>
  );
}

/* ---------------- Helper Summary Row Component ---------------- */
function SummaryRow({ label, value, fontSize = "1rem", color, fontWeight }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant="body1" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize,
          fontWeight: fontWeight || 500,
          color: color || "text.primary",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}