"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button as MuiButton,
  Box,
  IconButton,
  Chip,
  Skeleton,
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
import ProductModal from "./ProductModal";

const ProductCard = React.memo(({ 
  product,
  isLoading = false,
  onAddToCart,
  onBuyNow,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });
  const [openModal, setOpenModal] = useState(false);

  if (isLoading) return <ProductCardSkeleton />;
  if (!product) return null;

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

  const productImages = useMemo(() => product_images.length > 0 ? product_images : ["/logo.jpg"], [product_images]);
  const brandName = brands[0]?.name || brands[0] || "Divine Brand";
  const categoryName = categories[0]?.name || categories[0] || "";
  const displayPrice = offer_price || original_price || 0;
  const discountPercentage = discount || 0;

  // ---------- Quantity Handlers ----------
  const increaseQuantity = useCallback(() => setQuantity(prev => prev + 1), []);
  const decreaseQuantity = useCallback(() => setQuantity(prev => prev > 1 ? prev - 1 : 1), []);

  // ---------- Persistent Favorite using localStorage ----------
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favProducts") || "{}");
    setIsFav(favs[id] || false);
  }, [id]);

  const toggleFavorite = () => {
    setIsFav(prev => {
      const newFav = !prev;
      const favs = JSON.parse(localStorage.getItem("favProducts") || "{}");
      favs[id] = newFav;
      localStorage.setItem("favProducts", JSON.stringify(favs));
      return newFav;
    });
  };

  // ---------- Cart & Buy Handlers ----------
  const handleAddToCart = useCallback(() => {
    const cartData = { id, name, quantity, price: displayPrice };
    if (onAddToCart) onAddToCart(cartData);
    setSnackbar({ open: true, message: `${quantity} x ${name} added to cart 🛒`, type: "success" });
  }, [id, name, quantity, displayPrice, onAddToCart]);

  const handleBuyNow = useCallback(() => {
    const purchaseData = { id, name, quantity, price: displayPrice };
    if (onBuyNow) onBuyNow(purchaseData);
    setSnackbar({ open: true, message: `Proceeding to buy ${quantity} x ${name} 💳`, type: "info" });
  }, [id, name, quantity, displayPrice, onBuyNow]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setSnackbar({ open: true, message: "Product link copied to clipboard 📋", type: "info" });
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
        {true && (
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
        )}

        {/* Like & Share Icons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            p: 1,
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 3,
          }}
        >
          <IconButton
            onClick={toggleFavorite}
            sx={{ "&:hover": { background: "rgba(255,255,255,1)" } }}
          >
            {isFav ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
          </IconButton>

          <IconButton
            onClick={handleShare}
            sx={{ "&:hover": { background: "rgba(255,255,255,1)" } }}
          >
            <ShareIcon color="grey" />
          </IconButton>
        </Box>

        {/* Product Image */}
        <Box
          sx={{
            height: 260,
            position: "relative",
            overflow: "hidden",
            "& img": { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease", transform: "scale(1)" },
            "&:hover img": { transform: "scale(1.1)" },
          }}
        >
          <img
            src={productImages[currentImageIndex]}
            alt={name}
            onError={(e) => (e.target.src = "/logo.jpg")}
          />

          {/* View Product Button */}
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

        {/* Card Content */}
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
            sx={{
              minHeight: "48px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical"
            }}
          >
            {name}
          </Typography>

          {/* Price */}
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 1 }}>
            <Typography variant="h6" color="primary" fontWeight={700}>
              ₹{displayPrice}
            </Typography>
            {offer_price && (
              <Typography variant="body2" sx={{ textDecoration: "line-through", color: "text.disabled" }}>
                ₹{original_price}
              </Typography>
            )}
            {discountPercentage > 0 && (
              <Chip icon={<LocalOfferIcon sx={{ fontSize: 16 }} />} label={`Save ${Math.round(discountPercentage)}%`} color="success" size="small" sx={{ fontWeight: 600 }} />
            )}
          </Box>

          {/* Quantity */}
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, mb: 1 }}>
            <IconButton size="small" onClick={decreaseQuantity} disabled={quantity <= 1}><RemoveIcon /></IconButton>
            <Typography variant="h6">{quantity}</Typography>
            <IconButton size="small" onClick={increaseQuantity}><AddIcon /></IconButton>
          </Box>

          {/* Actions */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <MuiButton variant="contained" onClick={handleAddToCart} fullWidth sx={{ borderRadius: "10px", fontWeight: 100, fontSize:"12px", background: "linear-gradient(45deg,#ff9800,#f44336)" }}>
              Add to Cart
            </MuiButton>
            <MuiButton variant="contained" onClick={handleBuyNow} fullWidth sx={{ borderRadius: "10px", fontWeight: 100,fontSize:"12px", background: "linear-gradient(45deg,#4caf50,#2e7d32)" }}>
              Buy Now
            </MuiButton>
          </Box>
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.type}>{snackbar.message}</Alert>
      </Snackbar>

      {/* Product Modal */}
      {openModal && <ProductModal open={openModal} onClose={() => setOpenModal(false)} product={product} />}
    </>
  );
});

const ProductCardSkeleton = React.memo(() => (
  <Card sx={{ width: 280, borderRadius: "24px", p: 1 }}>
    <Skeleton variant="rectangular" height={260} sx={{ borderRadius: "16px" }} />
    <CardContent>
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="rectangular" height={32} sx={{ my: 1 }} />
      <Skeleton variant="rectangular" height={40} />
    </CardContent>
  </Card>
));

export default ProductCard;
