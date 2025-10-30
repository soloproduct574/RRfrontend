"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Box,
  Typography,
  useTheme,
  IconButton,
  useMediaQuery,
  Alert,
  Skeleton,
  Button,
} from "@mui/material";
import Image from "next/image";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/Redux/Slice/FileCategoryMakeSlice.jsx";
import { useRouter } from "next/navigation";

const CategoryScroller = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();

  const categoriesState = useSelector((state) => state.categoryReducer) || {};
  const categories = categoriesState.items || [];
  const status = categoriesState.status || "idle";
  const error = categoriesState.error || null;

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isLaptop = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const visibleCount = isMobile ? 3 : isTablet ? 4 : isLaptop ? 5 : 6;

  const [startIndex, setStartIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [imageErrors, setImageErrors] = useState({});
  const containerRef = useRef(null);
  const preloadedImages = useRef(new Set()).current;

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categories.length === 0) return;
    const interval = setInterval(() => {
      setStartIndex((prev) =>
        prev >= categories.length - visibleCount ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [categories.length, visibleCount]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || categories.length === 0) return;

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

  useEffect(() => {
    if (categories.length === 0 || typeof window === "undefined") return;

    const preloadImage = (src) => {
      if (preloadedImages.has(src)) return;
      const img = new window.Image();
      img.src = src;
      img.onload = () => preloadedImages.add(src);
      img.onerror = () => {
        setImageErrors((prev) => ({ ...prev, [src]: true }));
      };
    };

    const visibleCategories = categories.slice(startIndex, startIndex + visibleCount);
    visibleCategories.forEach((cat) => {
      const imageUrl = cat.category_images?.[0];
      if (imageUrl && typeof imageUrl === "string") preloadImage(imageUrl);
    });

    if (categories.length > visibleCount) {
      const nextIndex = (startIndex + visibleCount) % categories.length;
      const nextBatch = categories.slice(nextIndex, nextIndex + visibleCount);
      const preloadTimeout = setTimeout(() => {
        nextBatch.forEach((cat) => {
          const imageUrl = cat.category_images?.[0];
          if (imageUrl && typeof imageUrl === "string") preloadImage(imageUrl);
        });
      }, 1000);
      return () => clearTimeout(preloadTimeout);
    }
  }, [categories, startIndex, visibleCount, preloadedImages]);

  const handleImageLoad = (id) => setImagesLoaded((prev) => ({ ...prev, [id]: true }));
  const handleImageError = (id, url) => {
    setImageErrors((prev) => ({ ...prev, [id]: true, [url]: true }));
    setImagesLoaded((prev) => ({ ...prev, [id]: true }));
  };
  const handleNext = () =>
    setStartIndex((prev) =>
      prev >= categories.length - visibleCount ? 0 : prev + 1
    );
  const handlePrev = () =>
    setStartIndex((prev) =>
      prev === 0 ? Math.max(0, categories.length - visibleCount) : prev - 1
    );

  const displayCategories = useMemo(() => {
    const visible = categories.slice(startIndex, startIndex + visibleCount);
    return visible.length < visibleCount && categories.length > 0
      ? [...visible, ...categories.slice(0, visibleCount - visible.length)]
      : visible;
  }, [categories, startIndex, visibleCount]);

  const getCategoryImageUrl = (category) => {
    const categoryId = category._id || "";
    const imageUrl = category.category_images?.[0];
    if (imageErrors[categoryId] || imageErrors[imageUrl]) return "/default-category.jpg";
    if (!imageUrl || typeof imageUrl !== "string") return "/default-category.jpg";
    return imageUrl;
  };

  if (status === "loading") {
    return (
      <Box sx={{ width: "100%", py: { xs: 3, md: 8 }, bgcolor: "#fff" }}>
        <Box display="flex" justifyContent="center" alignItems="center" gap={2} mb={{ xs: 2, md: 6 }}>
          <Image src="/texticon.png" alt="icon" width={35} height={35} priority />
          <Typography variant={isMobile ? "h6" : "h4"} sx={{ color: "#ff3838", fontWeight: 700 }}>
            Shop By Product Categories
          </Typography>
          <Image src="/texticon.png" alt="icon" width={35} height={35} priority />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", gap: { xs: 1, md: 5 }, px: { xs: 2, md: 0 } }}>
          {[...Array(visibleCount)].map((_, i) => (
            <Box key={i} textAlign="center">
              <Skeleton variant="rectangular" animation="wave" sx={{ width: { xs: 95, sm: 100, md: 130, lg: 170 }, height: { xs: 95, sm: 100, md: 130, lg: 170 }, mb: 1.5 }} />
              <Skeleton variant="text" width={80} animation="wave" />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  if (status === "failed") {
    return (
      <Box sx={{ width: "100%", py: 8, display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "#fff" }}>
        <Alert severity="error">Failed to load categories: {error}</Alert>
      </Box>
    );
  }

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
      <Box display="flex" justifyContent="center" alignItems="center" gap={2} flexWrap="wrap" mb={{ xs: 2, md: 6 }}>
        <Image src="/texticon.png" alt="icon" width={35} height={35} priority />
        <Typography variant={isMobile ? "h6" : "h4"} sx={{ color: "#ff3838", fontWeight: 700 }}>
          Shop By Product Categories
        </Typography>
        <Image src="/texticon.png" alt="icon" width={35} height={35} priority />
      </Box>

      {/* Category list */}
      <Box
        ref={containerRef}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: { xs: 1.5, sm: 2, md: 5 },
          px: { xs: 1, md: 0 },
          width: "100%",
          transition: "transform 0.8s ease",
          minHeight: 200,
        }}
      >
        {displayCategories.map((category, index) => {
          const id = category._id || `temp-${index}`;
          const categoryImage = getCategoryImageUrl(category);
          const categoryName = category.category_name || "Unnamed Category";
          const isLoaded = imagesLoaded[id];

          return (
            <Box
  key={id}
  onClick={() => router.push(`/products?category=${encodeURIComponent(categoryName)}`)}
  sx={{
    flex: "0 0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s",
    "&:hover": {
      transform: "translateY(-5px)",
    },
  }}
>
  <Box
    sx={{
      position: "relative",
      width: { xs: 95, sm: 100, md: 130, lg: 170 },
      height: { xs: 95, sm: 100, md: 130, lg: 170 },
      overflow: "hidden",
      mb: 1.5,
      mt: { xs: 3, sm: 2, md: 3, lg: 4 },
      transition: "transform 0.4s ease, box-shadow 0.3s",
      "&:hover": {
        transform: "scale(1.08)",
        boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
      },
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {!isLoaded && (
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
    )}
    <Image
      src={categoryImage}
      alt={categoryName}
      width={isMobile ? 100 : 200}
      height={isMobile ? 100 : 200}
      quality={isMobile ? 70 : 85}
      unoptimized={categoryImage !== "/default-category.jpg"}
      priority={index < (isMobile ? 3 : 4)}
      onLoad={() => handleImageLoad(id)}
      onError={() => handleImageError(id, categoryImage)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 0.3s ease",
        transform: "scale(0.9)",
      }}
    />
  </Box>

  <Typography
    variant="subtitle1"
    sx={{
      fontWeight: 600,
      color: "#333",
      fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
      maxWidth: { xs: "95px", sm: "100px", md: "130px", lg: "170px" },
      textAlign: "center",
      lineHeight: 1.25,
      mt: 1,
      wordBreak: "break-word",
      whiteSpace: "normal",
    }}
  >
    {categoryName}
  </Typography>
</Box>

          );
        })}
      </Box>

      {/* Nav arrows */}
      {categories.length > visibleCount && (
        <>
          <IconButton
            onClick={handlePrev}
            aria-label="Previous"
            sx={{
              position: "absolute",
              top: "55%",
              left: { xs: 5, sm: 10, md: 20 },
              transform: "translateY(-50%)",
              backgroundColor: "white",
              boxShadow: 3,
              "&:hover": {
                backgroundColor: theme.palette.primary.main,
                color: "white",
              },
              opacity: startIndex === 0 ? 0.4 : 1,
              zIndex: 10,
              width: { xs: 30, sm: 36, md: 40 },
              height: { xs: 30, sm: 36, md: 40 },
            }}
          >
            <ArrowBackIosNewIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>

          <IconButton
            onClick={handleNext}
            aria-label="Next"
            sx={{
              position: "absolute",
              top: "55%",
              right: { xs: 5, sm: 10, md: 20 },
              transform: "translateY(-50%)",
              backgroundColor: "white",
              boxShadow: 3,
              "&:hover": {
                backgroundColor: theme.palette.primary.main,
                color: "white",
              },
              opacity: startIndex >= categories.length - visibleCount ? 0.4 : 1,
              zIndex: 10,
              width: { xs: 30, sm: 36, md: 40 },
              height: { xs: 30, sm: 36, md: 40 },
            }}
          >
            <ArrowForwardIosIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
        </>
      )}

      {/* View More button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button
          variant="contained"
          onClick={() => router.push("/products")}
          sx={{
            borderRadius: "40px",
            fontWeight: 700,
            fontSize: "16px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
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
            "&:active": { transform: "scale(0.96)" },
          }}
        >
          View More
        </Button>
      </Box>
    </Box>
  );
};

export default CategoryScroller;
