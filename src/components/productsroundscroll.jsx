"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Box,
  Typography,
  useTheme,
  IconButton,
  useMediaQuery,
  CircularProgress,
  Alert,
  Skeleton,
  Button,
} from "@mui/material";
import Image from "next/image";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/slice/CategoryFileMakeSlice";
import { useRouter } from "next/navigation";
const CategoryScroller = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();

  // Get categories from Redux state
  const categoriesState = useSelector((state) => state.categoryReducer) || {};
  const categories = categoriesState.items || [];
  const status = categoriesState.status || "idle";
  const error = categoriesState.error || null;

  // Responsive settings
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); 
  const isLaptop = useMediaQuery(theme.breakpoints.between("md", "lg")); 
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg")); 
  const visibleCount = isMobile ? 2 : isTablet ? 4 : isLaptop ? 5 : 6;
  
  const [startIndex, setStartIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [imageErrors, setImageErrors] = useState({});
  const containerRef = useRef(null);
  const preloadedImages = useRef(new Set()).current;

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Auto scroll carousel
  useEffect(() => {
    if (categories.length === 0) return;
    
    const interval = setInterval(() => {
      setStartIndex((prev) =>
        prev >= categories.length - visibleCount ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [categories.length, visibleCount]);

  // Setup touch gestures for mobile
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

  // Preload images for smoother experience - using browser API safely
  useEffect(() => {
    if (categories.length === 0 || typeof window === 'undefined') return;
    
    // Function to preload an image using browser Image constructor
    const preloadImage = (src) => {
      if (preloadedImages.has(src)) return;
      
      // Use the browser's global Image constructor, not the imported Next.js Image component
      const img = new window.Image();
      img.src = src;
      img.onload = () => {
        preloadedImages.add(src);
      };
      img.onerror = () => {
        setImageErrors(prev => ({...prev, [src]: true}));
      };
    };
    
    // Preload visible images first
    const visibleCategories = categories.slice(startIndex, startIndex + visibleCount);
    visibleCategories.forEach(category => {
      const imageUrl = category.category_images?.[0];
      if (imageUrl && typeof imageUrl === 'string') preloadImage(imageUrl);
    });
    
    // Then preload the next batch with a delay
    if (categories.length > visibleCount) {
      const nextIndex = (startIndex + visibleCount) % categories.length;
      const nextBatch = categories.slice(nextIndex, nextIndex + visibleCount);
      
      const preloadTimeout = setTimeout(() => {
        nextBatch.forEach(category => {
          const imageUrl = category.category_images?.[0];
          if (imageUrl && typeof imageUrl === 'string') preloadImage(imageUrl);
        });
      }, 1000);
      
      return () => clearTimeout(preloadTimeout);
    }
  }, [categories, startIndex, visibleCount, preloadedImages]);

  // Handle image load state
  const handleImageLoad = (id) => {
    setImagesLoaded(prev => ({...prev, [id]: true}));
  };

  // Handle image error
  const handleImageError = (id, url) => {
    setImageErrors(prev => ({...prev, [id]: true, [url]: true}));
    setImagesLoaded(prev => ({...prev, [id]: true}));
  };

  // Navigation handlers
  const handleNext = () => {
    setStartIndex((prev) =>
      prev >= categories.length - visibleCount ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    setStartIndex((prev) =>
      prev === 0 ? Math.max(0, categories.length - visibleCount) : prev - 1
    );
  };

  // Memoize display categories to prevent unnecessary re-renders
  const displayCategories = useMemo(() => {
    const visibleCategories = categories.slice(startIndex, startIndex + visibleCount);
    
    return visibleCategories.length < visibleCount && categories.length > 0
      ? [...visibleCategories, ...categories.slice(0, visibleCount - visibleCategories.length)]
      : visibleCategories;
  }, [categories, startIndex, visibleCount]);

  // Helper function to get proper image URL or fallback
  const getCategoryImageUrl = (category) => {
    const categoryId = category._id || '';
    const imageUrl = category.category_images?.[0];
    
    // Check if there was a previous error loading this image
    if (imageErrors[categoryId] || imageErrors[imageUrl]) {
      return "/default-category.jpg";
    }
    
    // Validate URL format to prevent Next.js Image loading issues
    if (!imageUrl || typeof imageUrl !== 'string') {
      return "/default-category.jpg";
    }
    
    return imageUrl;
  };

  // Show loading state
  if (status === "loading") {
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
          <Image src="/texticon.png" alt="icon" width={35} height={35} priority />
          <Typography
            variant={isMobile ? "h6" : isTablet ? "h5" : "h4"}
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
          <Image src="/texticon.png" alt="icon" width={35} height={35} priority />
        </Box>
        
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: { xs: 1, sm: 1, md: 5 },
            px: { xs: 2, md: 0 },
            width: "100%",
          }}
        >
          {[...Array(visibleCount)].map((_, index) => (
            <Box
              key={index}
              sx={{
                flex: "0 0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Skeleton
                variant="rectangular"
                animation="wave"
                sx={{
                  width: { xs: 80, sm: 100, md: 130, lg: 170 },
                  height: { xs: 80, sm: 100, md: 130, lg: 170 },
                  mb: 1.5,
                  mt: { xs: 3, sm: 2, md: 3, lg: 4 },
                }}
              />
              <Skeleton variant="text" width={80} animation="wave" />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  // Show error state
  if (status === "failed") {
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

  return (
    <Box
           onClick={() => router.push("/products")}

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
        <Image src="/texticon.png" alt="icon" width={35} height={35} priority />
        <Typography
          variant={isMobile ? "h6" : isTablet ? "h5" : "h4"}
          component="h2"
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
        <Image src="/texticon.png" alt="icon" width={35} height={35} priority />
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
        {displayCategories.map((category, index) => {
          const categoryId = category._id || `temp-${index}`;
          const categoryImage = getCategoryImageUrl(category);
          const categoryName = category.category_name || "Unnamed Category";
          const isLoaded = imagesLoaded[categoryId];
          
          return (
            <Box
              key={categoryId}
              sx={{
                flex: "0 0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                cursor: "pointer",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                }
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: { xs: 80, sm: 100, md: 130, lg: 170 },
                  height: { xs: 80, sm: 100, md: 130, lg: 170 },
                  overflow: "hidden",
                  mb: 1.5,
                  mt: { xs: 3, sm: 2, md: 3, lg: 4 },
                  boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
                  transition: "transform 0.4s ease, box-shadow 0.3s",
                  "&:hover": {
                    transform: "scale(1.08)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
                  },
                  backgroundColor: "#f0f0f0",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid #e0e0e0",
                }}
              >
                {/* Show skeleton while image loads */}
                {!isLoaded && (
                  <Skeleton 
                    variant="rectangular" 
                    animation="wave"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%"
                    }}
                  />
                )}
                
                {/* Using a lower resolution image for mobile to improve load times */}
                <Image
                  src={categoryImage}
                  alt={categoryName}
                  width={isMobile ? 100 : 200}
                  height={isMobile ? 100 : 200}
                  quality={isMobile ? 70 : 85}
                  unoptimized={categoryImage !== "/default-category.jpg"}
                  priority={index < (isMobile ? 2 : 4)}
                  onLoad={() => handleImageLoad(categoryId)}
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "contain",
                    opacity: isLoaded ? 1 : 0,
                    transition: "opacity 0.3s ease",
                    transform: "scale(0.9)",
                    
                  }}
                  onError={() => handleImageError(categoryId, categoryImage)}
                />
              </Box>
              
              <Typography
                variant="subtitle1"
                component="h3"
                sx={{
                  fontWeight: 600,
                  color: "#333",
                  fontSize: { xs: "0.875rem", sm: "0.925rem", md: "1rem" },
                  maxWidth: { xs: "90px", sm: "100px", md: "130px", lg: "170px" },
                  height: { xs: "2.5em", sm: "2.5em" },
                  overflow: "hidden",
                  textAlign: "center",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  lineHeight: 1.25,
                  textShadow: "0px 0px 1px rgba(255,255,255,0.8)",
                  padding: "0 4px",
                  marginTop: 1,
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
            aria-label="Previous categories"
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
            aria-label="Next categories"
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

      <Box sx={{ display: "flex", justifyContent: "center" }} mt={3}>
  <Button
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
  </Button>
</Box>

    </Box>
  );
};

export default CategoryScroller;
