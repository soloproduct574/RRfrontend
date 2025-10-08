"use client";
import React, { useState, useCallback, useMemo } from "react";
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
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SocialShare from "./SocialMedia/SocialShare.jsx";
import ProductModal from "./ProductModal.jsx";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slice/cartSlice.jsx";
import { toggleFavorite } from "../redux/slice/favoritesSlice.jsx";

// ✅ Inner card component for a single product
const ProductCardInner = React.memo(({ product }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const [openModal, setOpenModal] = useState(false);
 const theme = useTheme();
  const favoriteItems =
    useSelector((state) => state.favorites.favoriteItems) || [];
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

  const increaseQuantity = useCallback(
    () => setQuantity((prev) => prev + 1),
    []
  );
  const decreaseQuantity = useCallback(
    () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1)),
    []
  );

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
  }, [
    dispatch,
    id,
    name,
    quantity,
    displayPrice,
    product_images,
    brands,
    categories,
  ]);

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
      message: `Proceeding to buy ${quantity} x ${name} 💳 check out your cart`,
      type: "info",
    });
  }, [
    dispatch,
    id,
    name,
    quantity,
    displayPrice,
    product_images,
    brands,
    categories,
  ]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setSnackbar({
        open: true,
        message: "Product link copied to clipboard 📋",
        type: "info",
      });
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
            backgroundColor: "rgba(255, 160, 27, 0.74)",
            color: "black",
            zIndex: 2,
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            p: 1,
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 3,
            gap: 1,
          }}
        >
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
            "& img": {
              width: "100%",
              height: "100%",
              objectFit: "contain",
              transition: "transform 0.5s ease",
              transform: "scale(1)",
            },
            "&:hover img": { transform: "scale(1.1)" },
          }}
        >
          <img
            src={productImages[currentImageIndex]}
            alt={name}
            onError={(e) => (e.target.src = "/logo.jpg")}
          />
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
                "&:hover": {
                  background: "rgba(247, 5, 5, 0.99)",
                  color: "white",
                },
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
  
          {categoryName && (
            <Typography
              variant="body"
              fontWeight={500}
              color="black"
              sx={{ display: "block" }}
            >
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
              WebkitBoxOrient: "vertical",
            }}
          >
            {name}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "left",
              alignItems: "baseline",
              gap: 2,
            }}
          >
            {offer_price && (
              <Typography
                variant="body2"
                sx={{ textDecoration: "line-through", color: "text.disabled" }}
              >
                ₹{original_price}
              </Typography>
            )}
            <Typography variant="h6" color="black" fontWeight={700}>
              ₹{displayPrice}
            </Typography>
            
            {discountPercentage > 0 && (
              <Chip
                icon={<LocalOfferIcon sx={{ fontSize: 16 }} />}
                label={`Save ${Math.round(discountPercentage)}%`}
                color="warning"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>

           <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        mb: 1,
        userSelect: "none",
      }}
    >
      {/* Decrease Button */}
      <IconButton
        onClick={decreaseQuantity}
        disabled={quantity <= 1}
        sx={{
          border: "1px solid",
          borderColor: quantity <= 1 ? "grey.300" : theme.palette.primary.main,
          color: quantity <= 1 ? "grey.400" : theme.palette.primary.main,
          backgroundColor: quantity <= 1 ? "grey.100" : "transparent",
          width: 36,
          height: 36,
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: quantity <= 1 ? "grey.100" : theme.palette.primary.light,
            color: "#fff",
          },
        }}
        size="small"
      >
        <Remove />
      </IconButton>

      {/* Quantity Display */}
      <Typography
        variant="h6"
        sx={{
          px: 2,
          py: 0.5,
          minWidth: 48,
          textAlign: "center",
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "rgba(0,0,0,0.05)",
          fontWeight: 600,
          fontSize: { xs: "1.1rem", sm: "1.25rem" },
        }}
      >
        {quantity}
      </Typography>

      {/* Increase Button */}
      <IconButton
        onClick={increaseQuantity}
        sx={{
          border: "1px solid",
          borderColor: theme.palette.primary.main,
          color: theme.palette.primary.main,
          width: 36,
          height: 36,
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: theme.palette.primary.light,
            color: "#fff",
          },
        }}
        size="small"
      >
        <Add />
      </IconButton>
    </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <MuiButton
              variant="contained"
              onClick={handleAddToCart}
              fullWidth
              sx={{
                borderRadius: "10px",
                fontWeight: 100,
                fontSize: "12px",
                background: "linear-gradient(45deg,#ff9800,#f44336)",
              }}
            >
              Add to Cart
            </MuiButton>
            <MuiButton
              variant="contained"
              onClick={handleBuyNow}
              fullWidth
              sx={{
                borderRadius: "10px",
                fontWeight: 100,
                fontSize: "12px",
                background: "linear-gradient(45deg,#4caf50,#2e7d32)",
              }}
            >
              Buy Now
            </MuiButton>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.type}>{snackbar.message}</Alert>
      </Snackbar>

      {openModal && (
        <ProductModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          product={product}
        />
      )}
    </>
  );
});

// ✅ Skeleton loader
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

// ✅ Main wrapper: fetch products from Redux
const ProductCard = () => {
  const products = useSelector((state) => state.products.items) || [];
  const isLoading = useSelector((state) => state.products.loading);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box>
      <Box sx={{ textAlign: "center", mb: 3, mt: 5 }}>
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
    fontSize: {
      xs: "1.4rem", // 📱 Mobile
      sm: "1.5rem", // 📲 Small tablets
      md: "2rem",   // 💻 Desktop
      lg: "2.5rem", // 🖥️ Large screens
    },
  }}
>
  <img src="/texticon.png" alt="icon" style={{ width: 40, height: 40 }} />
  Top Trending Products
  <img src="/texticon.png" alt="icon" style={{ width: 40, height: 40 }} />
</Typography>

      </Box>

      {isMobile ? (
        // 👉 Mobile view: horizontal scroll
        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 2,
            px: 2,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <Box key={idx} sx={{ flex: "0 0 auto", width: 280 }}>
                  <ProductCardSkeleton />
                </Box>
              ))
            : products.map((product) => (
                <Box key={product._id} sx={{ flex: "0 0 auto", width: 280 }}>
                  <ProductCardInner product={product} />
                </Box>
              ))}
        </Box>
      ) : (
        // 👉 Desktop & tablet: grid
        <Grid container spacing={4} justifyContent="center" mb={2}>
          {isLoading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                  <ProductCardSkeleton />
                </Grid>
              ))
            : products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <ProductCardInner product={product} />
                </Grid>
              ))}
        </Grid>
      )}

      <Box sx={{ display: "flex", justifyContent: "center" }} mt={3}>
  <MuiButton
    variant="contained"
    onClick={() => (window.location.href = "/products")}
    sx={{
      borderRadius: "40px",
      fontWeight: 700,
      fontSize: "16px",
      textTransform: "uppercase",
      letterSpacing: "1px",
      background: "linear-gradient(135deg, #ff416c, #ff4b2b)", // Pink → Red
      color: "white",
      px: 4,
      py: 1.2,
      boxShadow: "0 6px 15px rgba(255, 65, 108, 0.4)",
      transition: "all 0.35s ease",
      "&:hover": {
        background: "linear-gradient(135deg, #ff4b2b, #ff416c)",
        transform: "translateY(-3px) scale(1.05)",
        boxShadow: "0 10px 25px rgba(255, 65, 108, 0.55)",
      },
      "&:active": {
        transform: "scale(0.96)",
      },
    }}
  >
    View More
  </MuiButton>
</Box>

    </Box>
  );
};

export default ProductCard;
