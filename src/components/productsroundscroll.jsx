"use client";
import React, { useState } from "react";
import { Box, Typography, useTheme, IconButton } from "@mui/material";
import Image from "next/image";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// Example product data
const products = [
  { id: 1, src: "/api/placeholder/200/200", name: "Incense Sticks" },
  { id: 2, src: "/api/placeholder/200/200", name: "Diya Lamps" },
  { id: 3, src: "/api/placeholder/200/200", name: "Holy Books" },
  { id: 4, src: "/api/placeholder/200/200", name: "Prayer Beads" },
  { id: 5, src: "/api/placeholder/200/200", name: "Offerings" },
  { id: 6, src: "/api/placeholder/200/200", name: "Statues" },
  { id: 7, src: "/api/placeholder/200/200", name: "Sacred Cloth" },
  { id: 8, src: "/api/placeholder/200/200", name: "Coconut" },
];

const ProductsScroller = () => {
  const theme = useTheme();
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 6; // show 5 at a time

  const handleNext = () => {
    if (startIndex < products.length - visibleCount) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const visibleProducts = products.slice(startIndex, startIndex + visibleCount);

  return (
    <Box
      sx={{
        width: "100%",
        py: { xs: 4, md: 6 },
        background: "linear-gradient(135deg, #f9f9f9, #f0f0f0)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Heading */}
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          color:'#000',
          fontWeight: 600,
          mb: { xs: 3, md: 5 },
          letterSpacing: "1px",
        }}
      >
        Wide Range of Products
      </Typography>

      {/* Product row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3,
        }}
      >
        {visibleProducts.map((product) => (
          <Box
            key={product.id}
            sx={{
              flex: "0 0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: { xs: 90, sm: 120, md: 150 },
                height: { xs: 90, sm: 120, md: 150 },
                borderRadius: "50%",
                overflow: "hidden",
                mb: 1.5,
                boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
                transition: "transform 0.3s",
                "&:hover": { transform: "scale(1.1)" },
              }}
            >
              <Image
                src={product.src}
                alt={product.name}
                width={200}
                height={200}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, textAlign: "center" }}
            >
              {product.name}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Manual Navigation */}
      <IconButton
        onClick={handlePrev}
        disabled={startIndex === 0}
        sx={{
          position: "absolute",
          top: "50%",
          left: 16,
          transform: "translateY(-50%)",
          backgroundColor: "white",
          boxShadow: 3,
          "&:hover": {
            backgroundColor: theme.palette.primary.main,
            color: "white",
          },
        }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>
      <IconButton
        onClick={handleNext}
        disabled={startIndex >= products.length - visibleCount}
        sx={{
          position: "absolute",
          top: "50%",
          right: 16,
          transform: "translateY(-50%)",
          backgroundColor: "white",
          boxShadow: 3,
          "&:hover": {
            backgroundColor: theme.palette.primary.main,
            color: "white",
          },
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
};

export default ProductsScroller;
