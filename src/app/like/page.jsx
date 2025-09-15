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
import { addToCart } from "@/Redux/Slice/cartSlice";
import { removeFavorite } from "@/Redux/Slice/favoritesSlice";
import Sidebar from "../../components/SidebarCarts/page";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function LikedProducts() {
  const dispatch = useDispatch();
  const { favoriteItems = [] } = useSelector((state) => state.favorites);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* ✅ Navbar */}
      <Navbar />

      {/* ✅ Content Area */}
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Sidebar />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            background: "#f5f5f5",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" gutterBottom fontWeight="bold" >
            ❤️ Liked Products
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {favoriteItems.length === 0 ? (
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
                src="/nolikes.jpg"
                alt="No Liked Products"
                width={200}
                height={200}
              />

              <Typography variant="h5" fontWeight="bold">
                You haven’t liked any products yet 💔
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 400 }}
              >
                Browse through our catalog and tap the ❤️ icon on products you
                love. They’ll appear here for quick access later!
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
              {favoriteItems.map((product) => {
                const price = product.offer_price ?? product.original_price ?? 0;

                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                    <Card
                      sx={{
                         minWidth: 280,
    maxWidth: 350,
    margin: "0 auto",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        boxShadow: 4,
                        borderRadius: "18px",
                        overflow: "hidden",
                        background: "#fff",
                        cursor: "pointer",
                        transition:
                          "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-8px) scale(1.02)",
                          boxShadow: 10,
                        },
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {/* Product Image */}
                      <Box
                        sx={{
                          position: "relative",
                          height: 220,
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          src={
                            product.product_images?.[0] || "/placeholder.png"
                          }
                          alt={product.product_name}
                          fill
                          style={{
                            objectFit: "cover",
                            transition: "transform 0.4s ease",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.transform = "scale(1.1)")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        />
                      </Box>

                      {/* Product Details */}
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
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            gutterBottom
                            noWrap
                          >
                            {product.product_name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                          >
                            Brand: {product.brands?.[0]?.name || "Unknown"}
                          </Typography>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="primary"
                            sx={{ mt: 1 }}
                          >
                            ₹{price}
                          </Typography>
                        </Box>

                        {/* Action Buttons */}
                        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={() =>
                              dispatch(addToCart({ ...product, quantity: 1 }))
                            }
                            sx={{
                              textTransform: "none",
                              borderRadius: "10px",
                              transition:
                                "transform 0.2s ease, background 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.05)",
                                backgroundColor: "#1565c0",
                              },
                            }}
                          >
                            Add to Cart
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            fullWidth
                            onClick={() =>
                              dispatch(removeFavorite(product._id))
                            }
                            sx={{
                              textTransform: "none",
                              borderRadius: "10px",
                              transition: "transform 0.2s ease",
                              "&:hover": {
                                transform: "scale(1.05)",
                                backgroundColor: "#ffebee",
                              },
                            }}
                          >
                            Unlike
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      </Box>

      {/* ✅ Footer */}
      <Footer />
    </Box>
  );
}