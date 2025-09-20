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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShareIcon from "@mui/icons-material/Share";

import ProductModal from "../../components/ProductModal.jsx";
import { fetchProducts } from "@/Redux/Slice/productSlice";
import { addToCart } from "@/Redux/Slice/cartSlice.jsx";
import { toggleFavorite } from "@/Redux/Slice/favoritesSlice.jsx";
import Navbar from "@/components/navbar.jsx";
import Footer from "@/components/footer";
import SocialShare from "@/components/SocialMedia/SocialShare.jsx";
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

  const productImages = useMemo(
    () => (product_images.length > 0 ? product_images : ["/logo.jpg"]),
    [product_images]
  );
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
    dispatch(
      addToCart({
        _id: id,
        product_name: name,
        quantity,
        offer_price: displayPrice,
        product_images,
        brands,
        categories,
      })
    );
    setSnackbar({
      open: true,
      message: `${quantity} x ${name} added to cart 🛒`,
      type: "success",
    });
  }, [dispatch, id, name, quantity, displayPrice, product_images, brands, categories]);

  const handleBuyNow = useCallback(() => {
    dispatch(
      addToCart({
        _id: id,
        product_name: name,
        quantity,
        offer_price: displayPrice,
        product_images,
        brands,
        categories,
      })
    );
    setSnackbar({
      open: true,
      message: `Proceeding to buy ${quantity} x ${name} 💳`,
      type: "info",
    });
  }, [dispatch, id, name, quantity, displayPrice, product_images, brands, categories]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setSnackbar({ open: true, message: "Product link copied to clipboard 📋", type: "info" });
    }
  };

  return (
    <>
      <Card
        sx={{
          width: 280,
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          position: "relative",
          transition: "box-shadow 0.3s ease",
          "&:hover": { boxShadow: "0 12px 40px rgba(0,0,0,0.25)" },
        }}
      >
        <Chip
          label="Popular Product"
          color="primary"
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            fontWeight: "bold",
            backgroundColor: "rgba(255, 255, 255, 0.74)",
            color: "black",
            zIndex: 2,
          }}
        />

      <Box sx={{ display: "flex", flexDirection: "column", p: 1, position: "absolute", top: 8, right: 8, zIndex: 3, gap: 1 }}>
  <IconButton onClick={handleToggleFavorite}>
    {isFav ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
  </IconButton>

  <SocialShare productName={name} />
</Box>

        <Box
          sx={{
            height: 260,
            position: "relative",
            overflow: "hidden",
            "& img": { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease", transform: "scale(1)" },
            "&:hover img": { transform: "scale(1.1)" },
          }}
        >
          <img src={productImages[currentImageIndex]} alt={name} onError={(e) => (e.target.src = "/logo.jpg")} />
          <Box
            sx={{
              position: "absolute",
              bottom: -60,
              left: 0,
              width: "100%",
              textAlign: "center",
              transition: "bottom 0.4s ease",
              ".MuiCard-root:hover &": { bottom: 16 },
            }}
          >
            <MuiButton
              startIcon={<VisibilityIcon />}
              onClick={() => setOpenModal(true)}
              sx={{
                background: "rgba(255, 255, 255, 0.74)",
                color: "black",
                "&:hover": { background: "rgba(247, 5, 5, 0.99)", color: "white" },
                borderRadius: "24px",
                px: 3,
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
            >
              View Product
            </MuiButton>
          </Box>
        </Box>

        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            {brandName}
          </Typography>
          {categoryName && (
            <Typography variant="caption" color="primary" sx={{ display: "block" }}>
              {categoryName}
            </Typography>
          )}
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ minHeight: "48px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
          >
            {name}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 1 }}>
            <Typography variant="h6" color="primary" fontWeight={700}>
              ₹{displayPrice}
            </Typography>
            {offer_price && (
              <Typography variant="body2" sx={{ textDecoration: "line-through", color: "text.disabled" }}>
                ₹{original_price}
              </Typography>
            )}
            {discountPercentage > 0 && <Chip icon={<LocalOfferIcon sx={{ fontSize: 16 }} />} label={`Save ${Math.round(discountPercentage)}%`} color="success" size="small" sx={{ fontWeight: 600 }} />}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, mb: 1 }}>
            <IconButton size="small" onClick={decreaseQuantity} disabled={quantity <= 1}>
              <RemoveIcon />
            </IconButton>
            <Typography variant="h6">{quantity}</Typography>
            <IconButton size="small" onClick={increaseQuantity}>
              <AddIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <MuiButton
              variant="contained"
              onClick={handleAddToCart}
              fullWidth
              sx={{ borderRadius: "10px", fontWeight: 100, fontSize: "12px", background: "linear-gradient(45deg,#ff9800,#f44336)" }}
            >
              Add to Cart
            </MuiButton>
            <MuiButton
              variant="contained"
              onClick={handleBuyNow}
              fullWidth
              sx={{ borderRadius: "10px", fontWeight: 100, fontSize: "12px", background: "linear-gradient(45deg,#4caf50,#2e7d32)" }}
            >
              Buy Now
            </MuiButton>
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

export default function ProductList() {
  const dispatch = useDispatch();
  const { items: products = [], loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <Box>
      <Box><Navbar /></Box>
      <Box sx={{ textAlign: "center", mb: 4 ,mt:3}}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Arial, sans-serif",
            color: "#ff3838ff",
            fontWeight: 600,
            letterSpacing: "1px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <img src="/texticon.png" alt="icon" style={{ width: 50, height: 50 }} />
          All Products
          <img src="/texticon.png" alt="icon" style={{ width: 50, height: 50 }} />
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center", mb: 2 }}>
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} sx={{ width: 280, borderRadius: "24px", p: 1 }}>
              <Box sx={{ height: 260, backgroundColor: "#f0f0f0", borderRadius: "16px" }} />
              <CardContent>
                <Box sx={{ height: 20, backgroundColor: "#e0e0e0", mb: 1 }} />
                <Box sx={{ height: 20, backgroundColor: "#e0e0e0", mb: 1 }} />
                <Box sx={{ height: 32, backgroundColor: "#e0e0e0", mb: 1 }} />
              </CardContent>
            </Card>
          ))
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : products.length === 0 ? (
          <Typography>No products found.</Typography>
        ) : (
          products.map((product) => <ProductCardInner key={product._id} product={product} />)
        )}
      </Box>
      <Box><Footer /></Box>
    </Box>
  );
}