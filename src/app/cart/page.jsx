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

export default function CartPage() {
  const dispatch = useDispatch();

  // ✅ fallback to avoid runtime crash
  const { cartItems = [] } = useSelector((state) => state.cart);

  // ✅ safe reduce
  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

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
          <Grid item xs={12} md={8}>
            {cartItems.map((item) => (
              <Card key={item.id} sx={{ display: "flex", mb: 2, boxShadow: 2, borderRadius: "12px" }}>
                <CardMedia
                  component="img"
                  sx={{ width: 140, objectFit: "cover" }}
                  image={item.image}
                  alt={item.name}
                />
                <CardContent sx={{ flex: "1" }}>
                  <Typography variant="h6" fontWeight="bold">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Brand: {item.brand}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                    Price: ₹{item.price} × {item.qty}
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" color="success.main">
                    ₹{item.price * item.qty}
                  </Typography>
                </CardContent>
                <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    Remove
                  </Button>
                </Box>
              </Card>
            ))}
          </Grid>

          {/* Summary */}
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, boxShadow: 3, borderRadius: "12px", background: "#fff", position: "sticky", top: 20 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">Cart Summary</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1">Total Items: {cartItems.length}</Typography>
              <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                Total: ₹{total}
              </Typography>
              <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={cartItems.length === 0}>
                Proceed to Checkout
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
    