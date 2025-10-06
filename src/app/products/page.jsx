"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
  Button as MuiButton,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  Drawer,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MenuIcon from "@mui/icons-material/Menu";

import ProductModal from "../../components/ProductModal.jsx";
import { fetchProducts } from "@/Redux/Slice/productSlice";
import { addToCart } from "@/Redux/Slice/cartSlice.jsx";
import { toggleFavorite } from "@/Redux/Slice/favoritesSlice.jsx";
import Navbar from "@/components/navbar.jsx";
import Footer from "@/components/footer";
import SocialShare from "@/components/SocialMedia/SocialShare.jsx";
import CategorySidebar from "@/components/categorySidebar.jsx";

// ---------- Product Card ----------
const ProductCardInner = React.memo(({ product }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });
  const [openModal, setOpenModal] = useState(false);

  const favoriteItems = useSelector((state) => state.favorites.favoriteItems) || [];
  const isFav = favoriteItems.some((p) => p._id === product._id);

  const {
    _id: id,
    product_name: name,
    brands = [],
    categories = [],
    original_price,
    offer_price,
    percentage_discount: discount,
    product_images = [],
  } = product;

  const productImages = useMemo(() => (product_images.length > 0 ? product_images : ["/logo.jpg"]), [product_images]);
  const brandName = brands[0]?.name || brands[0] || "Divine Brand";
  const categoryName = categories[0]?.name || categories[0] || "";
  const displayPrice = offer_price || original_price || 0;
  const discountPercentage = discount || 0;

  const increaseQuantity = useCallback(() => setQuantity((prev) => prev + 1), []);
  const decreaseQuantity = useCallback(() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1)), []);

  const handleToggleFavorite = useCallback(() => {
    dispatch(toggleFavorite(product));
  }, [dispatch, product]);

  const handleAddToCart = useCallback(() => {
    dispatch(addToCart({ _id: id, product_name: name, quantity, offer_price: displayPrice, product_images, brands, categories }));
    setSnackbar({ open: true, message: `${quantity} x ${name} added to cart 🛒`, type: "success" });
  }, [dispatch, id, name, quantity, displayPrice, product_images, brands, categories]);

  const handleBuyNow = useCallback(() => {
    dispatch(addToCart({ _id: id, product_name: name, quantity, offer_price: displayPrice, product_images, brands, categories }));
    setSnackbar({ open: true, message: `Proceeding to buy ${quantity} x ${name} 💳`, type: "info" });
  }, [dispatch, id, name, quantity, displayPrice, product_images, brands, categories]);

  return (
    <>
      <Card
        sx={{
          width: 280,
          borderRadius: 3,
          overflow: "hidden",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255,255,255,0.85)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          position: "relative",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": { transform: "translateY(-5px)", boxShadow: "0 12px 40px rgba(0,0,0,0.25)" },
        }}
      >
        <Chip
          label="Popular"
          color="primary"
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            fontWeight: 600,
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            color: "#000",
            zIndex: 2,
          }}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1, gap: 1, position: "absolute", top: 8, right: 8, zIndex: 3 }}>
          <IconButton onClick={handleToggleFavorite}>{isFav ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}</IconButton>
          <SocialShare productName={name} />
        </Box>

        <Box sx={{ height: 260, overflow: "hidden", position: "relative" }}>
          <img
            src={productImages[currentImageIndex]}
            alt={name}
            onError={(e) => (e.target.src = "/logo.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -50,
              left: 0,
              width: "100%",
              textAlign: "center",
              transition: "bottom 0.3s ease",
              ".MuiCard-root:hover &": { bottom: 16 },
            }}
          >
            <MuiButton
              startIcon={<VisibilityIcon />}
              onClick={() => setOpenModal(true)}
              sx={{
                background: "rgba(255,255,255,0.85)",
                color: "#000",
                "&:hover": { background: "#ff4d4d", color: "#fff" },
                borderRadius: "24px",
                px: 3,
                fontWeight: 600,
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              }}
            >
              View
            </MuiButton>
          </Box>
        </Box>

        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            {brandName}
          </Typography>
          {categoryName && <Typography variant="caption" color="primary" sx={{ display: "block" }}>{categoryName}</Typography>}
          <Typography variant="h6" fontWeight={700} sx={{ minHeight: 48, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
            {name}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 1, mt: 1 }}>
            <Typography variant="h6" color="primary" fontWeight={700}>
              ₹{displayPrice}
            </Typography>
            {offer_price && <Typography variant="body2" sx={{ textDecoration: "line-through", color: "text.disabled" }}>₹{original_price}</Typography>}
            {discountPercentage > 0 && <Chip icon={<LocalOfferIcon />} label={`Save ${Math.round(discountPercentage)}%`} color="success" size="small" sx={{ fontWeight: 600 }} />}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, mt: 1, mb: 1 }}>
            <IconButton size="small" onClick={decreaseQuantity} disabled={quantity <= 1}><RemoveIcon /></IconButton>
            <Typography variant="h6">{quantity}</Typography>
            <IconButton size="small" onClick={increaseQuantity}><AddIcon /></IconButton>
          </Box>

          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <MuiButton variant="contained" onClick={handleAddToCart} fullWidth sx={{ borderRadius: 2, fontSize: 12, background: "linear-gradient(45deg,#ff9800,#f44336)" }}>Add to Cart</MuiButton>
            <MuiButton variant="contained" onClick={handleBuyNow} fullWidth sx={{ borderRadius: 2, fontSize: 12, background: "linear-gradient(45deg,#4caf50,#2e7d32)" }}>Buy Now</MuiButton>
          </Box>
        </CardContent>
      </Card>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.type}>{snackbar.message}</Alert>
      </Snackbar>

      {openModal && <ProductModal open={openModal} onClose={() => setOpenModal(false)} product={product} />}
    </>
  );
});

// ---------- Product List Page ----------
export default function ProductList() {
  const dispatch = useDispatch();
  const { items: products = [], loading, error } = useSelector((state) => state.products);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <Box>
      <Navbar />

      {/* Mobile Categories Button */}
      {isMobile && (
        <Box >
          <MuiButton startIcon={<MenuIcon />} onClick={toggleSidebar} variant="outlined" fullWidth>
            Categories
          </MuiButton>
        </Box>
      )}

      {/* Flex Layout */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, px: { xs: 2, md: 4 }, mt: 2, gap: 3 }}>
        {/* Sidebar Left */}
        {!isMobile ? (
          <Box sx={{ flex: "0 0 280px", position: "sticky", top: 100, height: "calc(100vh - 120px)", borderRadius: 3, overflow: "hidden", backdropFilter: "blur(10px)", backgroundColor: "rgba(255,255,255,0.85)", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", }}>
            <CategorySidebar />
          </Box>
        ) : (
          <Drawer anchor="left" open={sidebarOpen} onClose={toggleSidebar} sx={{ "& .MuiDrawer-paper": { width: 280, p: 2 } }}>
            <CategorySidebar />
          </Drawer>
        )}

        {/* Products Right */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, letterSpacing: 1, color: "#ff3838" }}>
              All Products
            </Typography>
            <Divider sx={{ width: 80, mx: "auto", mt: 1, borderBottomWidth: 2, borderColor: "#ff3838" }} />
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: { xs: "center", md: "flex-start" } }}>
            {loading
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <Card key={idx} sx={{ width: 280, borderRadius: 3, p: 1, backdropFilter: "blur(10px)", backgroundColor: "rgba(245,245,245,0.8)" }}>
                    <Box sx={{ height: 260, borderRadius: 2, backgroundColor: "#e0e0e0" }} />
                    <CardContent>
                      <Box sx={{ height: 20, backgroundColor: "#e0e0e0", mb: 1 }} />
                      <Box sx={{ height: 20, backgroundColor: "#e0e0e0", mb: 1 }} />
                      <Box sx={{ height: 32, backgroundColor: "#e0e0e0", mb: 1 }} />
                    </CardContent>
                  </Card>
                ))
              : error
              ? <Typography color="error">{error}</Typography>
              : products.length === 0
              ? <Typography>No products found.</Typography>
              : products.map((product) => <ProductCardInner key={product._id} product={product} />)}
          </Box>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}
