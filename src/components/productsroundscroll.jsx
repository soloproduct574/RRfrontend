"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  useTheme,
  IconButton,
  useMediaQuery,
} from "@mui/material";
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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // <600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600–900px
  const isLaptop = useMediaQuery(theme.breakpoints.between("md", "lg")); // 900–1200px
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg")); // >1200px

  const visibleCount = isMobile ? 2 : isTablet ? 4 : isLaptop ? 5 : 6;

  const [startIndex, setStartIndex] = useState(0);
  const containerRef = useRef(null);

  // ✅ Auto-scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prev) =>
        prev >= products.length - visibleCount ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [visibleCount]);

  // ✅ Swipe gestures for mobile
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => (touchStartX = e.changedTouches[0].screenX);
    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) handleNext(); // swipe left
      if (touchEndX - touchStartX > 50) handlePrev(); // swipe right
    };

    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const handleNext = () => {
    setStartIndex((prev) =>
      prev >= products.length - visibleCount ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    setStartIndex((prev) =>
      prev === 0 ? Math.max(0, products.length - visibleCount) : prev - 1
    );
  };

  const visibleProducts = products.slice(startIndex, startIndex + visibleCount);

  return (
    <Box
      sx={{
        width: "100%",
        py: { xs: 3, md: 8 },
        position: "relative",
        overflow: "hidden",
        bgcolor: "#fff",
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={2}
        flexWrap="wrap"
        mb={{ xs: 2, md: 6 }}
      >
        <Image src="/texticon.png" alt="icon" width={35} height={35} />
        <Typography
          variant={isMobile ? "body" : isTablet ? "h5" : "h4"}
          sx={{
            textAlign: "center",
            fontFamily: "Arial, sans-serif",
            color: "#ff3838",
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        >
          Shop By Product Categories
        </Typography>
        <Image src="/texticon.png" alt="icon" width={35} height={35} />
      </Box>

      {/* Product list */}
      <Box
        ref={containerRef}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: { xs: 1, sm: 1, md: 5 },
          overflow: "hidden",
          px: { xs: 2, md: 0 },
          width: "100%",
          transition: "transform 0.8s ease",
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
              cursor: "pointer",
            }}
          >
            <Box
              sx={{
                width: { xs: 80, sm: 100, md: 130, lg: 150 },
                height: { xs: 80, sm: 100, md: 130, lg: 150 },
                borderRadius: "50%",
                overflow: "hidden",
                mb: 1.5,
                mt:{ xs: 3, sm: 2, md: 3, lg: 4 },
                boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
                transition: "transform 0.4s ease, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-6px) scale(1.08)",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
                },
              }}
            >
              <Image
                src={product.src}
                alt={product.name}
                width={200}
                height={200}
                unoptimized
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
            <Typography
              variant={isMobile ? "body2" : "subtitle1"}
              sx={{
                fontWeight: 600,
                color: "#222",
                fontSize: isMobile ? "0.8rem" : "1rem",
              }}
            >
              {product.name}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Navigation Buttons */}
      <>
        <IconButton
          onClick={handlePrev}
          disabled={startIndex === 0}
          sx={{
            position: "absolute",
            top: "50%",
            left: { xs: 20, sm: 20, md: 40 },
            transform: "translateY(-50%)",
            backgroundColor: "white",
            boxShadow: 3,
            "&:hover": {
              backgroundColor: theme.palette.primary.main,
              color: "white",
            },
            opacity: startIndex === 0 ? 0.4 : 1,
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
            right: { xs: 20, sm: 20, md: 40 },
            transform: "translateY(-50%)",
            backgroundColor: "white",
            boxShadow: 3,
            "&:hover": {
              backgroundColor: theme.palette.primary.main,
              color: "white",
            },
            opacity: startIndex >= products.length - visibleCount ? 0.4 : 1,
          }}
        >
          <ArrowForwardIosIcon fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
      </>
    </Box>
  );
};

export default ProductsScroller;
