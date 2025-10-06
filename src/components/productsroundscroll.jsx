"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  useTheme,
  IconButton,
  useMediaQuery,
  CircularProgress,
  Alert,
} from "@mui/material";
import Image from "next/image";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/redux/slice/CategoryFileMakeSlice";

const ProductsScroller = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  // ✅ CORRECT: Use 'categoryReducer' to match your store configuration
  const categoriesState = useSelector((state) => state.categoryReducer) || {};
  const categories = categoriesState.items || [];
  const status = categoriesState.status || "idle";
  const error = categoriesState.error || null;
  
  console.log("🔍 Redux categoryReducer state:", categoriesState);
  console.log("📦 Categories array:", categories);
  console.log("📊 Status:", status);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); 
  const isLaptop = useMediaQuery(theme.breakpoints.between("md", "lg")); 
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg")); 
  const visibleCount = isMobile ? 2 : isTablet ? 4 : isLaptop ? 5 : 6;
  const [startIndex, setStartIndex] = useState(0);
  const containerRef = useRef(null);

  // ✅ Fetch categories on component mount
  useEffect(() => {
    console.log("🚀 Dispatching fetchCategories...");
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categories.length === 0) {
      console.log("⏸️ Auto-scroll paused: No categories available");
      return;
    }
    
    console.log("🔄 Starting auto-scroll with", categories.length, "categories");
    const interval = setInterval(() => {
      setStartIndex((prev) =>
        prev >= categories.length - visibleCount ? 0 : prev + 1
      );
    }, 9000);
    return () => clearInterval(interval);
  }, [categories.length, visibleCount]);

  // ✅ Swipe gestures for mobile
  useEffect(() => {
    const container = containerRef.current;
    if (!container || categories.length === 0) return;
    
    console.log("👆 Setting up touch gestures");
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => (touchStartX = e.changedTouches[0].screenX);
    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) handleNext(); 
      if (touchEndX - touchStartX > 50) handlePrev(); 
    };

    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [categories.length]);

  const handleNext = () => {
    console.log("➡️ Next button clicked");
    setStartIndex((prev) =>
      prev >= categories.length - visibleCount ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    console.log("⬅️ Previous button clicked");
    setStartIndex((prev) =>
      prev === 0 ? Math.max(0, categories.length - visibleCount) : prev - 1
    );
  };

  // Use categories from Redux
  const visibleCategories = categories.slice(startIndex, startIndex + visibleCount);
  
  console.log("👀 Visible categories:", visibleCategories);
  console.log("📍 Start index:", startIndex);
  console.log("👁️ Visible count:", visibleCount);

  // Show loading state
  if (status === "loading") {
    console.log("⏳ Showing loading state");
    return (
      <Box
        sx={{
          width: "100%",
          py: 8,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#fff",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Loading categories...
        </Typography>
      </Box>
    );
  }

  // Show error state
  if (status === "failed") {
    console.log("💥 Showing error state:", error);
    return (
      <Box
        sx={{
          width: "100%",
          py: 8,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#fff",
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          Failed to load categories: {error}
        </Alert>
      </Box>
    );
  }

  console.log("✅ Rendering main component with", categories.length, "categories");

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

      {/* Category list */}
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
          minHeight: 200,
        }}
      >
        {visibleCategories.map((category, index) => {
          console.log(`🎯 Rendering category ${index}:`, category);
          
          // ✅ Use the correct field names from your API
          const categoryImage = category.category_images?.[0] || "/default-category.jpg";
          const categoryName = category.category_name || "Unnamed Category";
          
          return (
            <Box
              key={category._id || index}
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
                  mt: { xs: 3, sm: 2, md: 3, lg: 4 },
                  boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
                  transition: "transform 0.4s ease, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-6px) scale(1.08)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
                  },
                }}
              >
                <Image
                  src={categoryImage}
                  alt={categoryName}
                  width={200}
                  height={200}
                  unoptimized
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover" 
                  }}
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.target.src = "/default-category.jpg";
                  }}
                />
              </Box>
              <Typography
                variant={isMobile ? "body2" : "subtitle1"}
                sx={{
                  fontWeight: 600,
                  color: "#222",
                  fontSize: isMobile ? "0.8rem" : "1rem",
                  maxWidth: "120px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {categoryName}
              </Typography>
            </Box>
          );
        })}
        
        {categories.length === 0 && status === "succeeded" && (
          <Typography variant="body1" color="text.secondary">
            No categories found
          </Typography>
        )}
      </Box>

      {/* Navigation Buttons - Only show if there are enough categories */}
      {categories.length > visibleCount && (
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
            disabled={startIndex >= categories.length - visibleCount}
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
              opacity: startIndex >= categories.length - visibleCount ? 0.4 : 1,
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