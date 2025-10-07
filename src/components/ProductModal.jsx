"use client";
import React, { useState, useEffect, useRef } from "react";
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
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import Hls from "hls.js";

// Redux imports
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../Redux/Slice/favoritesSlice";
import { addToCart } from "../Redux/Slice/cartSlice";

// -------------------------
// ✅ VideoPlayer Component
// -------------------------
const VideoPlayer = ({ url }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !url) return;

    let hls;

    // destroy any previous instance
    if (video.hlsInstance) {
      video.hlsInstance.destroy();
      video.hlsInstance = null;
    }

    // detect HLS stream more safely
    const isHls = url.includes(".m3u8");

    if (isHls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hls.loadSource(url);
      hls.attachMedia(video);
      video.hlsInstance = hls;

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.warn("HLS.js error:", data.type, data.details);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari native support
      video.src = url;
    } else {
      // fallback for MP4
      video.src = url;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [url]);

  return (
    <video
      ref={videoRef}
      controls
      playsInline
      autoPlay
      poster="/logo.jpg"
      crossOrigin="anonymous"
      style={{
        width: "100%",
        maxHeight: 420,
        backgroundColor: "black",
        borderRadius: "12px",
      }}
    />
  );
};

// -------------------------
// ✅ ProductModal Component
// -------------------------
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

  const handleLike = () => dispatch(toggleFavorite(product));
  const handleAddToCart = () => dispatch(addToCart({ ...product, quantity: 1 }));
  const handleBuyNow = () => dispatch(addToCart({ ...product, quantity: 1 }));

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          borderRadius: 3,
          width: { xs: "90%", sm: "85%", md: "75%", lg: "60%" },
          maxHeight: "90vh",
          overflowY: "auto",
          p: { xs: 2, sm: 3 },
          boxShadow: 24,
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            backgroundColor: theme.palette.error.main,
            color: "white",
            "&:hover": { backgroundColor: theme.palette.error.dark },
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Left column (Media Selection) */}
          <Grid item xs={12} md={2}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row", md: "column" },
                gap: 1,
                overflowX: { xs: "auto", md: "visible" },
              }}
            >
              {mediaItems.map((item, i) => (
                <Box
                  key={i}
                  onClick={() => setSelectedMedia(item)}
                  sx={{
                    border:
                      selectedMedia === item
                        ? `2px solid ${theme.palette.primary.main}`
                        : "1px solid gray",
                    borderRadius: 1,
                    cursor: "pointer",
                    overflow: "hidden",
                    width: { xs: 80, md: "100%" },
                    height: 80,
                    flex: "0 0 auto",
                  }}
                >
                  {item.type === "image" ? (
                    <img
                      src={item.src}
                      alt={`Media ${i + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
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
                      <PlayCircleOutlineIcon />
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Middle column (Selected Media) */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              {selectedMedia?.type === "image" ? (
                <img
                  src={selectedMedia.src}
                  alt="Selected"
                  style={{
                    width: "100%",
                    maxHeight: 420,
                    objectFit: "contain",
                    borderRadius: 12,
                  }}
                  onError={(e) => (e.target.src = "/logo.jpg")}
                />
              ) : (
                <VideoPlayer url={selectedMedia.src} />
              )}
            </Box>
          </Grid>

          {/* Right column (Details) */}
          <Grid item xs={12} md={5}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Product Name + Like */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    letterSpacing: "0.5px",
                    textTransform: "capitalize",
                    lineHeight: 1.2,
                    fontSize: { xs: "1.2rem", md: "1.4rem" },
                  }}
                >
                  {product_name}
                </Typography>
{categories.map((cat, i) => (
                  <Chip
                    key={i}
                    label={cat.name}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      background: "linear-gradient(135deg, #2196f3, #21cbf3)",
                      color: "#fff",
                    }}
                  />
                ))}
                <IconButton
                  onClick={handleLike}
                  sx={{
                    background: isLiked
                      ? "linear-gradient(135deg, #ff4b2b, #ff416c)"
                      : "linear-gradient(135deg, #e0e0e0, #bdbdbd)",
                    color: "#fff",
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    "&:hover": { transform: "scale(1.1)" },
                  }}
                >
                  {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </Box>

            
              {/* Price Section */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  backgroundColor: "#fafafa",
                  p: 1.5,
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <Typography variant={{ xs: "caption", md: "h5" }} fontWeight={{ xs: 600, md: 700 }} color="error">
                 PRICE : ₹ {offer_price}
                </Typography>
                {original_price && (
                  <Typography
                    variant="body2"
                    sx={{
                      textDecoration: "line-through",
                      color: "gray",
                    }}
                  >
                   PRICE : ₹ {original_price}
                  </Typography>
                )}
                {percentage_discount > 0 && (
                  <Chip
                    label={`Save ${Math.round(percentage_discount)}%`}
                    size="small"
                    sx={{
                      background: "linear-gradient(135deg, #43a047, #66bb6a)",
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  />
                )}
              </Box>

              {/* Description */}
              <Box
                sx={{
                  maxHeight: 120,
                  overflowY: "auto",
                  pr: 1,
                  "&::-webkit-scrollbar": { width: "6px" },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#ccc",
                    borderRadius: "4px",
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.6 }}
                >
                  {description}
                </Typography>
              </Box>

              <Divider />

              {/* Actions */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Button
                  onClick={handleAddToCart}
                  fullWidth
                  sx={{
                    background: "linear-gradient(135deg, #e9911eff, #ffbd22ff)",
                    color: "white",
                    fontWeight: 600,
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #ff5722, #e91e63)",
                    },
                  }}
                >
                  Add to Cart
                </Button>

                <Button
                  onClick={handleBuyNow}
                  fullWidth
                  sx={{
                    background: "linear-gradient(135deg, #43bd24ff, #70e642ff)",
                    color: "white",
                    fontWeight: 600,
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #673ab7, #2196f3)",
                    },
                  }}
                >
                  Buy Now
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default ProductModal;
