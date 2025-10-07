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
import TopBarButtons from "@/components/SidebarCarts/page"; // <-- Use top row buttons

export default function CartPage() {
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

      <Box >
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          color="primary.main"
          mb={2}
        >
          🛒 Your Cart
        </Typography>

        <Divider sx={{ mb: 4 }} />

        {cartItems.length === 0 ? (
          <Stack
            spacing={2}
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            sx={{ py: 8 }}
          >
            <Image
              src="/emptycart.jpg"
              alt="Empty Cart"
              width={220}
              height={220}
              style={{ borderRadius: "12px" }}
            />
            <Typography variant="h5" fontWeight="bold">
              Your Cart Is Empty 😕
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 420 }}>
              Looks like you haven’t added anything yet.
              Start exploring now!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              href="/products"
              sx={{
                borderRadius: "12px",
                px: 4,
                py: 1.3,
                fontSize: "1rem",
                textTransform: "none",
              }}
            >
              Browse Products
            </Button>
          </Stack>
        ) : (
          <Grid
            container
            spacing={3}
            sx={{ justifyContent: "center", alignItems: "stretch", pb: 6 }}
          >
            {/* Products Section */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                {cartItems.map((item) => {
                  const price = item.offer_price ?? item.original_price ?? 0;
                  const totalForItem = price * item.quantity;

                  return (
                    <Grid item xs={12} sm={6} md={4} key={item._id}>
                      <motion.div
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.25 }}
                      >
                        <Card
                          sx={{
                            height: "100%",
                            borderRadius: "16px",
                            background: "#ffffffcc",
                            backdropFilter: "blur(8px)",
                            boxShadow:
                              "0 4px 15px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.1)",
                            overflow: "hidden",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            "&:hover": {
                              boxShadow:
                                "0 8px 25px rgba(0,0,0,0.12), 0 2px 5px rgba(0,0,0,0.1)",
                              transform: "translateY(-3px)",
                            },
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          {/* Product Image */}
                          <Box sx={{ position: "relative", height: 210 }}>
                            <Image
                              src={
                                item.product_images?.[0] || "/placeholder.png"
                              }
                              alt={item.product_name}
                              fill
                              style={{
                                objectFit: "cover",
                              }}
                            />
                          </Box>

                          {/* Product Info */}
                          <CardContent sx={{ px: 2, py: 1.5, flexGrow: 1 }}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              noWrap
                              gutterBottom
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
                              {`₹${price} × ${item.quantity}`}
                            </Typography>
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              color="primary.main"
                              sx={{ mt: 1 }}
                            >
                              ₹{totalForItem.toFixed(2)}
                            </Typography>
                          </CardContent>

                          <Box sx={{ p: 2, pt: 0 }}>
                            <Button
                              onClick={() => dispatch(removeFromCart(item._id))}
                              variant="outlined"
                              color="error"
                              fullWidth
                              sx={{
                                borderRadius: "10px",
                                textTransform: "none",
                                fontWeight: 500,
                                "&:hover": {
                                  backgroundColor: "#ffebee",
                                  borderColor: "#ef9a9a",
                                },
                              }}
                            >
                              Remove
                            </Button>
                          </Box>
                        </Card>
                      </motion.div>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>

            {/* Order Summary Section */}
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Box
                  sx={{
                    p: 3,
                    borderRadius: "18px",
                    background:
                      "linear-gradient(145deg, #f9fdff 0%, #e0f7fa 100%)",
                    boxShadow:
                      "0 6px 22px rgba(0,0,0,0.08), inset 0 0 12px rgba(255,255,255,0.25)",
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight="600"
                    gutterBottom
                    textAlign="center"
                    color="primary.main"
                  >
                    🧾 Order Summary
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Stack spacing={1.2}>
                    <SummaryRow label="Subtotal" value={`₹${subtotal.toFixed(2)}`} />
                    <SummaryRow label="Tax (5%)" value={`₹${tax.toFixed(2)}`} />
                    <SummaryRow
                      label="Shipping"
                      value={shipping === 0 ? "Free" : `₹${shipping}`}
                    />
                  </Stack>

                  <Divider sx={{ my: 2 }} />
                  <SummaryRow
                    label="Total"
                    value={`₹${total.toFixed(2)}`}
                    fontSize="1.25rem"
                    color="primary.main"
                    fontWeight="bold"
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                      mt: 3,
                      borderRadius: "12px",
                      py: 1.4,
                      fontSize: "1rem",
                      textTransform: "none",
                      fontWeight: 600,
                      background: "linear-gradient(135deg, #2196f3, #21cbf3)",
                      boxShadow:
                        "0 4px 14px rgba(33,203,243,0.4), inset 0 1px 0 rgba(255,255,255,0.25)",
                      "&:hover": {
                        transform: "scale(1.03)",
                        boxShadow: "0 6px 20px rgba(33,203,243,0.45)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    🛍 Secure Checkout
                  </Button>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        )}
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
