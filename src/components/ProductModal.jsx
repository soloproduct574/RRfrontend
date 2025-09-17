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

  const mediaItems = [
    ...product_images.map((img) => ({ type: "image", src: img })),
    ...product_videos.map((vid) => ({ type: "video", src: vid })),
  ];

  const [selectedMedia, setSelectedMedia] = useState(mediaItems[0]);

  const favoriteItems = useSelector((state) => state.favorites.favoriteItems);
  const isLiked = favoriteItems.some((p) => p._id === id);

  const handleLike = () => {
    dispatch(toggleFavorite(product)); // ✅ pass full product
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity: 1 })); // ✅ pass full product
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ ...product, quantity: 1 })); // ✅ pass full product
    // Navigate to checkout page if needed
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
               <Typography
  variant="h5"
  fontWeight={700}
  sx={{
    background: "linear-gradient(90deg, #ff6f61, #e91e63)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0px 1px 2px rgba(0,0,0,0.15)",
    letterSpacing: "0.5px",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
      textShadow: "0px 2px 6px rgba(0,0,0,0.25)",
    },
  }}
>
  {product_name}
</Typography>

               <IconButton
  onClick={handleLike}
  sx={{
    background: isLiked
      ? "linear-gradient(135deg, #ff4b2b, #ff416c)"
      : "linear-gradient(135deg, #e0e0e0, #bdbdbd)",
    color: "#fff",
    borderRadius: "50%",
    width: 48,
    height: 48,
    boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.2)",
      boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
    },
    "&:active": {
      transform: "scale(0.9)", // bounce effect on click
    },
  }}
>
  {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
</IconButton>

              </Box>

             <Typography
  variant="body1"
  sx={{
    color: "text.secondary",
    lineHeight: 1.7,
    letterSpacing: "0.3px",
    fontSize: "1rem",
    px: 1,
    // borderLeft: "4px solid #ff6f61",
    // pl: 2,
      // transition: "all 0.3s ease",
    "&:hover": {
      color: "#333",
    //   textShadow: "0px 1px 4px rgba(0,0,0,0.2)",
    //   transform: "translateX(4px)",
    },
  }}
>
  {description}
</Typography>

              <Divider />

              <Box
  sx={{
    display: "flex",
    flexWrap: "wrap",
    gap: 1.2,
    p: 2,
    borderRadius: 3,
    // background: "linear-gradient(135deg, #fafafa, #f5f5f5)",
      // boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease",
    "&:hover": {
      // background: "linear-gradient(135deg, #ffffff, #f9f9f9)",
      // boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
    },
  }}
>
  {categories.map((cat, i) => (
    <Chip
      key={i}
      label={cat.name}
      size="small"
      sx={{
        fontWeight: 600,
        background: "linear-gradient(135deg, #2196f3, #21cbf3)",
        color: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "scale(1.08)",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        },
      }}
    />
  ))}

  {brands.map((brand, i) => (
    <Chip
      key={i}
      label={brand.name}
      size="small"
      sx={{
        fontWeight: 600,
        background: "linear-gradient(135deg, #9c27b0, #e040fb)",
        color: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "scale(1.08)",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        },
      }}
    />
  ))}
</Box>


              {/* Price */}
             <Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 2,
    p: 1.5,
    borderRadius: 3,
    background: "linear-gradient(135deg, #fafafa, #fdfdfd)",
    boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
    },
  }}
>
  {/* Offer Price */}
  <Typography
    variant="h6"
    sx={{
      fontWeight: 800,
      fontSize: "1.4rem",
      color: "#e53935", // red tone for urgency
      textShadow: "0px 1px 3px rgba(229,57,53,0.3)",
    }}
  >
    ₹{offer_price}
  </Typography>

  {/* Original Price */}
  {original_price && (
    <Typography
      variant="body2"
      sx={{
        textDecoration: "line-through",
        color: "gray",
        fontSize: "0.9rem",
      }}
    >
      ₹{original_price}
    </Typography>
  )}

  {/* Discount Chip */}
  {percentage_discount > 0 && (
    <Chip
      label={`Save ${Math.round(percentage_discount)}%`}
      size="small"
      sx={{
        fontWeight: 700,
        background: "linear-gradient(135deg, #43a047, #66bb6a)",
        color: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        "&:hover": {
          transform: "scale(1.08)",
          boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
        },
      }}
    />
  )}
</Box>


              {/* Actions */}
              <Box sx={{ display: "flex", gap: 2 }}>
         <Button
  onClick={handleAddToCart}
  sx={{
    borderRadius: 2,
    fontWeight: 600,
    py: 0.8,
    px: 2,
    fontSize: "0.9rem",
    minWidth: 120,
    background: "linear-gradient(135deg, #e91e63, #ff5722)",
    color: "#fff",
    boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #ff5722, #e91e63)",
      transform: "scale(1.05)",
      boxShadow: "0 5px 14px rgba(0,0,0,0.25)",
    },
  }}
>
  Add to Cart
</Button>

<Button
  onClick={handleBuyNow}
  sx={{
    borderRadius: 2,
    fontWeight: 600,
    py: 0.8,
    px: 2,
    fontSize: "0.9rem",
    minWidth: 120,
    background: "linear-gradient(135deg, #2196f3, #673ab7)",
    color: "#fff",
    boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #673ab7, #2196f3)",
      transform: "scale(1.05)",
      boxShadow: "0 5px 14px rgba(0,0,0,0.25)",
    },
  }}
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