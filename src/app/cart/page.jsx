"use client";

import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Box,
  Divider,
} from "@mui/material";
import { removeFromCart } from "@/Redux/Slice/cartSlice";
import { addToCart } from "@/Redux/Slice/cartSlice";

export default function CartPage() {
  const dispatch = useDispatch();
  const { cartItems = [] } = useSelector((state) => state.cart);
  const { favoriteItems = [] } = useSelector((state) => state.favorites);

  // ✅ Calculate total
  const total = cartItems.reduce(
    (acc, item) => acc + (item.offer_price ?? item.original_price ?? 0) * item.quantity,
    0
  );

  return (
    <Box sx={{ p: 4, background: "#f9f9f9", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        🛒 Your Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Typography variant="h6" color="text.secondary">
          Your cart is empty 😕
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            {cartItems.map((item) => {
              const price = item.offer_price ?? item.original_price ?? 0;
              return (
                <Card
                  key={item._id}
                  sx={{ display: "flex", mb: 2, boxShadow: 2, borderRadius: "12px" }}
                >
                  <CardMedia
                    component="img"
                    sx={{ width: 140, objectFit: "cover" }}
                    image={item.product_images?.[0] || "/placeholder.png"}
                    alt={item.product_name}
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {item.product_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Brand: {item.brands?.[0]?.name || "Unknown"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                      Price: ₹{price} × {item.quantity}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" color="success.main">
                      ₹{price * item.quantity}
                    </Typography>
                  </CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => dispatch(removeFromCart(item._id))}
                    >
                      Remove
                    </Button>
                  </Box>
                </Card>
              );
            })}
          </Grid>

          {/* Liked / Favorite Products */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 3,
                boxShadow: 3,
                borderRadius: "12px",
                background: "#fff",
                position: { md: "sticky" },
                top: { md: 20 },
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight="bold">
                ❤️ Liked Products
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {favoriteItems.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  You haven’t liked any products yet.
                </Typography>
              ) : (
                favoriteItems.map((product) => {
                  const price = product.offer_price ?? product.original_price ?? 0;
                  return (
                    <Box
                      key={product._id}
                      sx={{ display: "flex", mb: 2, alignItems: "center" }}
                    >
                      <img
                        src={product.product_images?.[0] || "/placeholder.png"}
                        alt={product.product_name}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: "8px",
                          objectFit: "cover",
                          marginRight: 12,
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={600}>
                          {product.product_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ₹{price}
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          dispatch(addToCart({ ...product, quantity: 1 }))
                        }
                      >
                        Add to Cart
                      </Button>
                    </Box>
                  );
                })
              )}
            </Box>
          </Grid>
        </Grid>
      )}

      {/* Cart Summary */}
      {cartItems.length > 0 && (
        <Box
          sx={{
            mt: 4,
            p: 3,
            boxShadow: 3,
            borderRadius: "12px",
            background: "#fff",
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Cart Summary
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1">Total Items: {cartItems.length}</Typography>
          <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
            Total: ₹{total}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout
          </Button>
        </Box>
      )}
    </Box>
  );
}