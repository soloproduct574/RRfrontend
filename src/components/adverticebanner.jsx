"use client";
import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Image from "next/image";

const bannerImages = [
  {
    id: 1,
    src: "/api/placeholder/1200/600",
    alt: "Traditional Pooja Setup",
    title: "Sacred Pooja Ceremony",
    description: "Experience divine blessings with traditional rituals",
  },
  {
    id: 2,
    src: "/api/placeholder/1200/600",
    alt: "Festival Celebration",
    title: "Festival of Lights",
    description: "Celebrate with devotion and joy",
  },
  {
    id: 3,
    src: "/api/placeholder/1200/600",
    alt: "Temple Pooja",
    title: "Divine Atmosphere",
    description: "Immerse in spiritual enlightenment",
  },
  {
    id: 4,
    src: "/api/placeholder/1200/600",
    alt: "Pooja Items",
    title: "Sacred Offerings",
    description: "Traditional items for complete worship",
  }
];

const PoojaBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [paused, setPaused] = useState(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto slide
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

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
        position: "relative",
        width: "100%",
        height: { xs: "350px", sm: "450px", md: "600px", lg: "700px" }, // responsive heights
        overflow: "hidden",
        borderRadius: { xs: 1, sm: 2 },
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
          transition: "transform 0.8s ease-in-out", // smooth sliding
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
            <Image
              src={item.src}
              alt={item.alt}
              fill
              style={{ objectFit: "cover" }}
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            {/* Overlay */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(45deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.25) 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                px: { xs: 2, sm: 3, md: 6 },
                color: "#fff"
              }}
            >
              <Typography
                variant={isMobile ? "h4" : "h2"}
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  textShadow: "2px 2px 6px rgba(0,0,0,0.6)"
                }}
              >
                {item.title}
              </Typography>
              <Typography
                variant={isMobile ? "body1" : "h6"}
                sx={{
                  maxWidth: "700px",
                  textShadow: "1px 1px 4px rgba(0,0,0,0.6)"
                }}
              >
                {item.description}
              </Typography>
            </Box>
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
          zIndex: 10
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
          zIndex: 10
        }}
      >
        <Box onClick={nextSlide} sx={navButtonStyle}>
          →
        </Box>
      </Box>

      {/* Dots Indicator */}
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: 12, sm: 20 },
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
              width: { xs: 8, sm: 12 },
              height: { xs: 8, sm: 12 },
              borderRadius: "50%",
              backgroundColor:
                currentIndex === index
                  ? theme.palette.primary.main
                  : "rgba(255,255,255,0.6)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.2)",
                backgroundColor: theme.palette.primary.main
              }
            }}
          />
        ))}
      </Box>

      {/* Animated Progress Bar */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 4,
          backgroundColor: "rgba(255,255,255,0.3)",
          overflow: "hidden"
        }}
      >
        <Box
          key={currentIndex} // restart animation each slide
          sx={{
            height: "100%",
            width: "100%",
            backgroundColor: theme.palette.primary.main,
            animation: "progress 4s linear forwards",
            "@keyframes progress": {
              "0%": { width: "0%" },
              "100%": { width: "100%" }
            }
          }}
        />
      </Box>
    </Box>
  );
};

const navButtonStyle = {
  width: { xs: 36, sm: 50 },
  height: { xs: 36, sm: 50 },
  borderRadius: "50%",
  backgroundColor: "rgba(255,255,255,0.8)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,1)",
  },
};

export default PoojaBanner;
