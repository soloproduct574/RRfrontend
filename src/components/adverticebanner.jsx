"use client";
import React, { useState, useEffect, useRef } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import Image from "next/image";

const bannerImages = [
  {
    id: 1,
    src: "/banner1.jpg",
    alt: "Traditional Pooja Setup",
  },
  {
    id: 2,
    src: "/banner2.jpg",
    alt: "Festival Celebration",
  },
  {
    id: 3,
    src: "/banner3.jpg",
    alt: "Temple Pooja",
  },
  {
    id: 4,
    src: "/banner4.jpg",
    alt: "Pooja Items",
  }
];

const PoojaBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const progressRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Reset animation on slide change - if using any CSS animation on progress/loader
  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.animation = "none";
      setTimeout(() => {
        if (progressRef.current) {
          progressRef.current.style.animation = "";
        }
      }, 10);
    }
  }, [currentIndex]);

  // Auto slide every 5 seconds (unless paused)
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

  // Touch swipe handlers for mobile
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

  // When image is loaded, update state to hide the loader overlay.
  const handleImageLoad = (id) => {
    setImagesLoaded((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <Box
      sx={{
        mt: 4,
        position: "relative",
        width: "100%",
        height: { xs: "40vh", sm: "50vh", md: "60vh" },
        overflow: "hidden",
        boxShadow: 3,
        backgroundColor: "#000",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >

      {/* Slides Container */}
      <Box
        sx={{
          display: "flex",
          transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: `translateX(-${currentIndex * 100}%)`,
          height: "100%",
          width: `${bannerImages.length * 100}%`,
        }}
      >
        {bannerImages.map((item, index) => (
          <Box
            key={item.id}
            sx={{
              position: "relative",
              minWidth: "100%",
              height: "100%",
              flexShrink: 0,
              backgroundColor: "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Loading overlay while the image is loading */}
            {!imagesLoaded[item.id] && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  backgroundColor: "rgba(0,0,0,0.6)",
                  zIndex: 1,
                }}
              >
                Loading...
              </Box>
            )}
            <Image
              src={item.src}
              alt={item.alt}
              fill
              // Using cover so image fills container; switch to "contain" if you want all image content visible
              style={{
                objectFit: "fill",
              }}
              priority={index === 0}
              onLoadingComplete={() => handleImageLoad(item.id)}
            />
          </Box>
        ))}
      </Box>

      {/* Navigation Arrows for larger screens */}
      {!isMobile && (
        <>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: 16,
              transform: "translateY(-50%)",
              zIndex: 10,
              opacity: 0.7,
              transition: "opacity 0.3s",
              "&:hover": { opacity: 1 },
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
              "&:hover": { opacity: 1 },
            }}
          >
            <Box onClick={nextSlide} sx={navButtonStyle}>
              →
            </Box>
          </Box>
        </>
      )}

      {/* Dots Indicator */}
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 1,
          zIndex: 10,
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
                backgroundColor: "#fff",
              },
            }}
          />
        ))}
      </Box>
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
  fontSize: "1.2rem",
  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.7)" },
};

export default PoojaBanner;
