"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, IconButton, useMediaQuery } from "@mui/material";
import Image from "next/image";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const products = [
  { id: 1, src: "/img1.jpg", name: "Incense Sticks" },
  { id: 2, src: "/img1.jpg", name: "Diya Lamps" },
  { id: 3, src: "/img1.jpg", name: "Holy Books" },
  { id: 4, src: "/img1.jpg", name: "Prayer Beads" },
  { id: 5, src: "/img1.jpg", name: "Offerings" },
  { id: 6, src: "/img1.jpg", name: "Statues" },
  { id: 7, src: "/img1.jpg", name: "Sacred Cloth" },
  { id: 8, src: "/img1.jpg", name: "Coconut" },
];

const ProductsScroller = () => {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  // Breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // <600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600px - 900px
  const isLaptop = useMediaQuery(theme.breakpoints.between("md", "lg")); // 900px - 1200px
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg")); // >1200px

  // Determine visible products
  const visibleCount = isMobile ? 2 : isTablet ? 4 : isLaptop ? 5 : 6;

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const visibleProducts = mounted ? products.slice(startIndex, startIndex + visibleCount) : [];

  return (
    <Box sx={{ width: "100%", py: { xs: 2, md: 8 }, position: "relative", overflow: "hidden" }}>
      {/* Heading */}
      <Box display="flex" justifyContent="center" alignItems="center" gap={2} flexWrap="wrap" mb={{ xs: 2, md: 6 }}>
        <Image src="/texticon.png" alt="icon" width={40} height={40} />
        <Typography
          variant={isMobile ? "h6" : isTablet ? "h5" : "h4"}
          sx={{
            textAlign: "center",
            fontFamily: "Arial, sans-serif",
            color: "#ff3838",
            fontWeight: 600,
          }}
        >
          Shop By Product Categories
        </Typography>
        <Image src="/texticon.png" alt="icon" width={40} height={40} />
      </Box>

      {/* Product row */}
      {mounted && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: { xs: 2, sm: 3, md: 5 },
            overflowX: "hidden",
            px: { xs: 2, md: 0 },
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
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  width: { xs: 80, sm: 100, md: 130, lg: 150 },
                  height: { xs: 80, sm: 100, md: 130, lg: 150 },
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
              <Typography variant={isMobile ? "body2" : "subtitle1"} sx={{ fontWeight: 600 }}>
                {product.name}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Navigation Buttons */}
      {mounted && (
        <>
          <IconButton
            onClick={handlePrev}
            disabled={startIndex === 0}
            sx={{
              position: "absolute",
              top: "50%",
              left: { xs: 10, sm: 20, md: 40, lg: 60 },
              transform: "translateY(-50%)",
              backgroundColor: "white",
              boxShadow: 3,
              "&:hover": { backgroundColor: theme.palette.primary.main, color: "white" },
            }}
          >
            <ArrowBackIosNewIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>

          <IconButton
            onClick={handleNext}
            disabled={startIndex >= products.length - visibleCount}
            sx={{
              position: "absolute",
              top: "50%",
              right: { xs: 10, sm: 20, md: 40, lg: 60 },
              transform: "translateY(-50%)",
              backgroundColor: "white",
              boxShadow: 3,
              "&:hover": { backgroundColor: theme.palette.primary.main, color: "white" },
            }}
          >
            <ArrowForwardIosIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
        </>
      )}
    </Box>
  );
};

export default ProductsScroller;
