"use client";

import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  Divider,
} from "@mui/material";
import { removeFromCart, addToCart } from "@/Redux/Slice/cartSlice";
import { removeFavorite } from "../../Redux/Slice/favoritesSlice"; 

export default function CartPage() {
  const dispatch = useDispatch();
  const { cartItems = [] } = useSelector((state) => state.cart);
  const { favoriteItems = [] } = useSelector((state) => state.favorites);

  // Calculate total
  const total = cartItems.reduce(
    (acc, item) =>
      acc + (item.offer_price ?? item.original_price ?? 0) * item.quantity,
    0
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, background: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        🛒 Your Cart
      </Typography>

      <Grid container spacing={3}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          {cartItems.length === 0 ? (
            <Typography variant="h6" color="text.secondary">
              Your cart is empty 😕
            </Typography>
          ) : (
            cartItems.map((item) => {
              const price = item.offer_price ?? item.original_price ?? 0;
              return (
                <Card
                  key={item._id}
                  sx={{
                    display: "flex",
                    mb: 2,
                    boxShadow: 3,
                    borderRadius: "12px",
                    overflow: "hidden",
                    background: "#fff",
                  }}
                >
                  <Box sx={{ width: 140, height: 140, position: "relative" }}>
                    <Image
                      src={item.product_images?.[0] || "/placeholder.png"}
                      alt={item.product_name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </Box>
                  <CardContent
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      p: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {item.product_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
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
                      >
                        ₹{price * item.quantity}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ mt: 1, alignSelf: "flex-start" }}
                      onClick={() => dispatch(removeFromCart(item._id))}
                    >
                      Remove
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          )}
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
                  <Card
                    key={product._id}
                    sx={{
                      display: "flex",
                      mb: 2,
                      boxShadow: 3,
                      borderRadius: "12px",
                      overflow: "hidden",
                      background: "#f9f9f9",
                    }}
                  >
                    <Box sx={{ width: 100, height: 100, position: "relative" }}>
                      <Image
                        src={product.product_images?.[0] || "/placeholder.png"}
                        alt={product.product_name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </Box>
                    <CardContent
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        p: 1.5,
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {product.product_name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          Brand: {product.brands?.[0]?.name || "Unknown"}
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="primary.main"
                        >
                          ₹{price}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
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
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() =>
                            dispatch(removeFavorite(product._id))
                          }
                        >
                          Unlike
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </Box>
        </Grid>
      </Grid>

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
          <Typography variant="body1">
            Total Items: {cartItems.length}
          </Typography>
          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
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