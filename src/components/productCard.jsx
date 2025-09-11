"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

const ProductCard = ({ 
  images = ["/logo.jpg", "/logo2.jpg", "/logo3.jpg"], 
  name = "Divine Pooja Item", 
  brand = "Divine Brand", 
  price = 300, 
  discount = 20,
  offerPercentage = 0,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const discountedPrice = discount
    ? (price - (price * discount) / 100).toFixed(2)
    : price;

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Change image on hover navigation across 3 sections
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    if (images.length > 1) {
      if (x < width / 3) setCurrentImageIndex(0);
      else if (x < (2 * width) / 3) setCurrentImageIndex(1 % images.length);
      else setCurrentImageIndex(2 % images.length);
    }
  };

  const handleAddToCart = () => {
    alert(`${quantity} x ${name} added to cart 🛒`);
  };

  const handleBuyNow = () => {
    alert(`Proceeding to buy ${quantity} x ${name} 💳`);
  };

  return (
    <><Typography
            display={"flex"}
            justifyContent={"center"}
            gap={3}
          >
            <img
              src="/texticon.png"
              alt="icon"
              style={{ width: 50, height: 50, verticalAlign: "middle", marginRight: 10 }}
            />
          <Typography variant="h4"
            sx={{
              textAlign: "center",
              fontFamily: "Arial, sans-serif",
              color:'#ff3838ff',
              fontWeight: 600,
              mb: { xs: 3, md: 10 },
              letterSpacing: "1px",
            }}>Shop By Product Categories</Typography>
          <img
              src="/texticon.png"
              alt="icon"
              style={{ width: 50, height: 50, verticalAlign: "middle", marginRight: 10 }}
            />
          </Typography>
           <Card
      sx={{
        maxWidth: 350,
        borderRadius: "20px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        background: "white",
        position: "relative",
        overflow: "visible",
      }}
    >
      {/* 🔖 Offer Tags */}
      {discount > 0 && (
        <Chip
          icon={<LocalOfferIcon />}
          label={`${discount}% OFF`}
          color="error"
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            fontWeight: "bold",
            borderRadius: "8px",
            zIndex: 2,
          }}
        />
      )}
      {offerPercentage > 0 && (
        <Chip
          icon={<LocalOfferIcon />}
          label={`+${offerPercentage}% Extra`}
          size="small"
          sx={{
            position: "absolute",
            top: discount > 0 ? 50 : 12,
            left: 12,
            fontWeight: "bold",
            color: "white",
            borderRadius: "8px",
            zIndex: 2,
            backgroundColor: "#4caf50",
          }}
        />
      )}

      {/* 🖼️ Product Image with hover zoom + change */}
      <Box
        sx={{
          height: 300,
          width: "100%",
          overflow: "hidden",
          position: "relative",
          cursor: "pointer",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setCurrentImageIndex(0)}
      >
        <img
          src={images[currentImageIndex]}
          alt={name}
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover",
            transition: "transform 0.4s ease",
          }}
          className="hover-zoom"
        />
      </Box>

      {/* Product Details */}
      <CardContent sx={{ textAlign: "center", p: 2 }}>
        {/* Brand */}
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}
        >
          {brand}
        </Typography>

        {/* Product Name */}
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ mb: 1, color: "text.primary", minHeight: "50px" }}
        >
          {name}
        </Typography>

        {/* Price Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            alignItems: "baseline",
          }}
        >
          {discount > 0 && (
            <Typography
              variant="body2"
              sx={{
                textDecoration: "line-through",
                color: "gray",
              }}
            >
              ₹{price}
            </Typography>
          )}
          <Typography variant="h6" color="primary" fontWeight={700}>
            ₹{discountedPrice}
          </Typography>
        </Box>

        {/* Quantity Selector */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            mt: 2,
          }}
        >
          <IconButton size="small" onClick={decreaseQuantity} sx={{ border: "1px solid #ddd" }}>
            <RemoveIcon />
          </IconButton>
          <Typography variant="h6">{quantity}</Typography>
          <IconButton size="small" onClick={increaseQuantity} sx={{ border: "1px solid #ddd" }}>
            <AddIcon />
          </IconButton>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5, mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleAddToCart}
            sx={{
              flex: 1,
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              background: "linear-gradient(45deg,#ff9800,#f44336)",
              "&:hover": { background: "linear-gradient(45deg,#f57c00,#d32f2f)" },
            }}
          >
            Add to Cart
          </Button>
          <Button
            variant="contained"
            onClick={handleBuyNow}
            sx={{
              flex: 1,
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              background: "linear-gradient(45deg,#4caf50,#2e7d32)",
              "&:hover": { background: "linear-gradient(45deg,#43a047,#1b5e20)" },
            }}
          >
            Buy Now
          </Button>
        </Box>
      </CardContent>
    </Card>
    </>
   
  );
};

export default ProductCard;
