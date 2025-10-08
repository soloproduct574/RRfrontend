"use client";
import React, { useMemo } from "react";
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
import { removeFromCart } from "../../redux/slice/cartSlice";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";
import TopBarButtons from "@/components/SidebarCarts/page";

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { cartItems = [] } = useSelector((state) => state.cart);

  // ✅ Pricing logic
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

  const handleBuyNow = () => router.push("/paymentmode");

  return (
    <>
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #f8fafc, #e3f2fd)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      <TopBarButtons />

      {/* ⭐ Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          textAlign: "center",
          pb: { xs: 10, md: 4 }, // extra space for bottom bar on mobile
        }}
      >
        {/* 🛒 Empty Cart */}
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
              color="warning"
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
            {/* 🧾 Cart Items Grid */}
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
                    sx={{ display: "flex", justifyContent: "center" }}
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
                          borderRadius: "16px",
                          overflow: "hidden",
                          boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                          background: "#fff",
                          transition: "box-shadow 0.3s ease",
                          "&:hover": {
                            boxShadow: "0 8px 25px rgba(0,0,0,0.18)",
                          },
                        }}
                      >
                        {/* Image */}
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

                        {/* Info */}
                        <CardContent sx={{ p: 2 }}>
                          <Typography variant="subtitle1" fontWeight={700} noWrap>
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
                            ₹{(price * item.quantity).toFixed(2)}
                          </Typography>

                          <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            onClick={() => dispatch(removeFromCart(item._id))}
                            sx={{
                              mt: 2,
                              textTransform: "none",
                              borderRadius: "12px",
                              "&:hover": {
                                background: "#ffebee",
                                transform: "scale(1.05)",
                              },
                            }}
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

            {/* 🧾 Order Summary (Desktop View) */}
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                position: "absolute",
                top: 100,
                right: 20,
                width: 320,
                p: 3,
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(240,244,255,0.95))",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                borderRadius: "16px",
                backdropFilter: "blur(8px)",
              }}
            >
              <Typography
                variant="h5"
                fontWeight="700"
                sx={{
                  mb: 1,
                  color: "primary.main",
                  textAlign: "center",
                  letterSpacing: "0.8px",
                }}
              >
                🧾 Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Stack spacing={1.4} sx={{ mb: 2 }}>
                <SummaryRow label="Subtotal" value={`₹${subtotal.toFixed(2)}`} />
                <SummaryRow label="Tax (5%)" value={`₹${tax.toFixed(2)}`} />
                <SummaryRow
                  label="Shipping"
                  value={shipping === 0 ? "Free" : `₹${shipping}`}
                />
              </Stack>

              <Divider sx={{ my: 1.5 }} />

              <Typography
                variant="h5"
                fontWeight="700"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#2441e7",
                  mb: 3,
                }}
              >
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </Typography>

              {/* Buy Now Button */}
              <Button
                onClick={handleBuyNow}
                fullWidth
                sx={{
                  borderRadius: "50px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  py: 1.4,
                  color: "#fff",
                  background: "linear-gradient(90deg, #7b4397, #dc2430)",
                  boxShadow: "0 6px 20px rgba(220,36,48,0.35)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "linear-gradient(90deg, #dc2430, #7b4397)",
                    transform: "translateY(-3px) scale(1.03)",
                    boxShadow: "0 8px 28px rgba(123,67,151,0.4)",
                  },
                }}
              >
                Buy Now
              </Button>

              <Typography
                variant="caption"
                sx={{
                  mt: 1.5,
                  color: "text.secondary",
                  textAlign: "center",
                  display: "block",
                }}
              >
                Secure payment • 100% Safe Checkout 🔒
              </Typography>
            </Box>

            {/* 🛍 Mobile Floating Checkout Bar */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                justifyContent: "space-between",
                alignItems: "center",
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                px: 3,
                py: 2,
                background: "#fff",
                boxShadow: "0 -4px 15px rgba(0,0,0,0.1)",
                zIndex: 1200,
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  ₹{total.toFixed(2)}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: "0.85rem" }}
                >
                  Incl. taxes & shipping
                </Typography>
              </Box>

              <Button
                onClick={handleBuyNow}
                variant="contained"
                sx={{
                  borderRadius: "50px",
                  background: "linear-gradient(90deg,#ff8a00,#e52e71)",
                  px: 4,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  "&:hover": {
                    background: "linear-gradient(90deg,#e52e71,#ff8a00)",
                    transform: "scale(1.05)",
                  },
                }}
              >
                Buy Now
              </Button>
            </Box>
          </>
        )}
      </Box>

    </Box>
          <Footer />
          </>

  );
}

/* ✅ Helper Sub-Component */
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
