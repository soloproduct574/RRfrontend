"use client";
import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  Chip,
  Grid,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ReactPlayer from "react-player";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

// ✅ Redux imports
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../Redux/Slice/favoritesSlice";
import { addToCart } from "../Redux/Slice/cartSlice";

const ProductModal = ({ open, onClose, product }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  if (!product) return null;

  const {
    _id: id,
    product_name,
    description,
    percentage_discount,
    product_images = [],
    product_videos = [],
    original_price,
    offer_price,
    categories = [],
    brands = [],
  } = product;

  // ✅ Build media array safely
  const mediaItems = [
    ...product_images.map((img) => ({ type: "image", src: img })),
    ...product_videos.map((vid) => ({ type: "video", src: vid })),
  ];

  const [selectedMedia, setSelectedMedia] = useState(mediaItems[0]);

  // ✅ Get favorites from Redux (no localStorage direct calls)
  const favoriteItems = useSelector((state) => state.favorites.favoriteItems);
  const isLiked = favoriteItems.includes(id);

  const handleLike = () => {
    dispatch(toggleFavorite(id)); // ✅ Toggles Redux + persists in localStorage inside slice
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ id, name: product_name, quantity: 1, price: offer_price }));
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ id, name: product_name, quantity: 1, price: offer_price }));
    // ✅ Navigate to checkout page if needed
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box>
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "fixed",
            top: 60,
            right: 300,
            backgroundColor: theme.palette.error.main,
            color: "white",
            borderRadius: "50%",
            width: 45,
            height: 45,
            boxShadow: 3,
            "&:hover": { backgroundColor: theme.palette.error.dark },
            zIndex: 2000,
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Modal Content */}
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 3,
            maxWidth: 900,
            width: "70%",
            mx: "auto",
            my: "5%",
            boxShadow: 24,
            maxHeight: "90vh",
            overflowY: "auto",
            position: "relative",
            p: 2,
          }}
        >
          <Grid container spacing={2}>
            {/* Left Column: Media List */}
            <Grid item xs={12} md={2}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {mediaItems.map((item, i) => (
                  <Box
                    key={i}
                    sx={{
                      border:
                        selectedMedia === item
                          ? `2px solid ${theme.palette.primary.main}`
                          : "1px solid gray",
                      borderRadius: 1,
                      cursor: "pointer",
                      overflow: "hidden",
                      width: "100%",
                      height: 80,
                    }}
                    onClick={() => setSelectedMedia(item)}
                  >
                    {item.type === "image" ? (
                      <img
                        src={item.src}
                        alt={`Media ${i + 1}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => (e.target.src = "/logo.jpg")}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: "black",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                        }}
                      >
                        <PlayCircleOutlineIcon fontSize="large" />
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* Middle Column: Selected Media */}
            <Grid item xs={12} md={5}>
              {selectedMedia && (
                <Box sx={{ width: "100%", height: "100%" }}>
                  {selectedMedia.type === "image" ? (
                    <img
                      src={selectedMedia.src}
                      alt="Selected"
                      style={{
                        width: 400,
                        height: 430,
                        borderRadius: 12,
                        objectFit: "contain",
                      }}
                      onError={(e) => (e.target.src = "/logo.jpg")}
                    />
                  ) : (
                    <ReactPlayer
                      url={selectedMedia.src}
                      controls
                      style={{
                        borderRadius: 12,
                        overflow: "hidden",
                        width: 400,
                        height: 430,
                      }}
                    />
                  )}
                </Box>
              )}
            </Grid>

            {/* Right Column: Product Info */}
            <Grid item xs={12} md={5} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h5" fontWeight={700}>
                  {product_name}
                </Typography>
                <IconButton onClick={handleLike} color="error">
                  {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </Box>

              <Typography variant="body1" color="text.secondary">
                {description}
              </Typography>
              <Divider />

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {categories.map((cat, i) => (
                  <Chip key={i} label={cat.name} color="primary" size="small" />
                ))}
                {brands.map((brand, i) => (
                  <Chip key={i} label={brand.name} color="secondary" size="small" />
                ))}
              </Box>

              {/* Price */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="h6" color="primary" fontWeight={700}>
                  ₹{offer_price}
                </Typography>
                {original_price && (
                  <Typography
                    variant="body2"
                    sx={{ textDecoration: "line-through", color: "gray" }}
                  >
                    ₹{original_price}
                  </Typography>
                )}
                {percentage_discount > 0 && (
                  <Chip
                    label={`Save ${Math.round(percentage_discount)}%`}
                    color="success"
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                )}
              </Box>

              {/* Actions */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ borderRadius: 2, fontWeight: 600 }}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  sx={{ borderRadius: 2, fontWeight: 600 }}
                  onClick={handleBuyNow}
                >
                  Buy Now
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProductModal;
