"use client";
import React, { useState, useEffect, useRef } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";

const bannerImages = [
  {
    id: 1,
    src: "/herobaner.jpg",
    alt: "Traditional Pooja Setup",
  },
  {
    id: 2,
    src: "footerbg.jpg",
    alt: "Festival Celebration",
  },
  {
    id: 3,
    src: "/herobaner.jpg",
    alt: "Temple Pooja",
  },
  {
    id: 4,
    src: "/api/placeholder/1200/600",
    alt: "Pooja Items",
  }
];

const PoojaBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [paused, setPaused] = useState(false);
  const progressRef = useRef(null);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Reset animation on slide change
  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.animation = 'none';
      setTimeout(() => {
        if (progressRef.current) {
          progressRef.current.style.animation = '';
        }
      }, 10);
    }
  }, [currentIndex]);

  // Auto slide
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, paused]);

  const goToSlide = (index) => setCurrentIndex(index);
  const nextSlide = () =>
    setCurrentIndex((prev) =>
      prev === bannerImages.length - 1 ? 0 : prev + 1
    );
  const prevSlide = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? bannerImages.length - 1 : prev - 1
    );

  // Touch swipe handling
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };
  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
  };
  const handleSwipe = () => {
    if (touchStartX.current - touchEndX.current > 75) nextSlide();
    if (touchEndX.current - touchStartX.current > 75) prevSlide();
  };

  return (
    <Box
      sx={{
        mt: 4,
        position: "relative",
        width: "100%",
        height: { xs: "40vh", sm: "50vh", md: "60vh" },
        overflow: "hidden",
        // borderRadius: { xs: 1, sm: 2 },
        boxShadow: 3
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slide Container */}
      <Box
        sx={{
          display: "flex",
          transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: `translateX(-${currentIndex * 100}%)`,
          height: "100%",
          width: `${bannerImages.length * 100}%`
        }}
      >
        {bannerImages.map((item, index) => (
          <Box
            key={item.id}
            sx={{
              minWidth: "100%",
              height: "100%",
              position: "relative",
              flexShrink: 0
            }}
          >
            <img
              src={item.src}
              alt={item.alt}
              style={{ 
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.9)"
              }}
              priority={index === 0}
            />
          </Box>
        ))}
      </Box>

      {/* Navigation Arrows */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: 16,
          transform: "translateY(-50%)",
          zIndex: 10,
          opacity: 0.7,
          transition: "opacity 0.3s",
          "&:hover": { opacity: 1 }
        }}
      >
        <Box onClick={prevSlide} sx={navButtonStyle}>
          ←
        </Box>
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          right: 16,
          transform: "translateY(-50%)",
          zIndex: 10,
          opacity: 0.7,
          transition: "opacity 0.3s",
          "&:hover": { opacity: 1 }
        }}
      >
        <Box onClick={nextSlide} sx={navButtonStyle}>
          →
        </Box>
      </Box>

      {/* Minimal Dots Indicator */}
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 1,
          zIndex: 10
        }}
      >
        {bannerImages.map((_, index) => (
          <Box
            key={index}
            onClick={() => goToSlide(index)}
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: currentIndex === index ? "#fff" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.2)",
                backgroundColor: "#fff"
              }
            }}
          />
        ))}
      </Box>

      {/* Progress Bar */}
      {/* <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 3,
          backgroundColor: "rgba(255,255,255,0.3)",
          overflow: "hidden"
        }}
      >
        <Box
          ref={progressRef}
          sx={{
            height: "100%",
            width: "100%",
            backgroundColor: "#fff",
            animation: "progress 5s linear forwards",
            "@keyframes progress": {
              "0%": { transform: "translateX(-100%)" },
              "100%": { transform: "translateX(0%)" }
            }
          }}
        />
      </Box> */}
    </Box>
  );
};

const navButtonStyle = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: "rgba(0,0,0,0.5)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.3s",
  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.7)",
  },
};

export default PoojaBanner;