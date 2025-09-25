"use client";
import React, { useEffect, useRef, useState } from "react";
import { Box, useTheme, useMediaQuery, CircularProgress, Typography } from "@mui/material";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchBannersMedia } from "../Redux/Slice/BannerSlice";

const PoojaBanner = () => {
  const dispatch = useDispatch();
  const { items: banners, status } = useSelector((state) => state.banners);

  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [paused, setPaused] = useState(false);
  const progressRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState({});

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (status === "idle") dispatch(fetchBannersMedia());
  }, [dispatch, status]);

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.animation = "none";
      setTimeout(() => {
        if (progressRef.current) progressRef.current.style.animation = "";
      }, 10);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (paused || banners.length === 0) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, paused, banners.length]);

  const goToSlide = (index) => setCurrentIndex(index);
  const nextSlide = () =>
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

  const handleTouchStart = (e) => (touchStartX.current = e.changedTouches[0].screenX);
  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    if (touchStartX.current - touchEndX.current > 75) nextSlide();
    if (touchEndX.current - touchStartX.current > 75) prevSlide();
  };

  const handleImageLoad = (id) => {
    setImagesLoaded((prev) => ({ ...prev, [id]: true }));
  };

  if (status === "loading") {
    return (
      <Box
        sx={{
          mt: 4,
          height: { xs: "35vh", sm: "45vh", md: "55vh", lg: "60vh" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (!banners || banners.length === 0) {
    return (
      <Box sx={{ mt: 4, textAlign: "center", color: "#555" }}>
        No Banners Found
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ textAlign: "center", mb: 8, mt: 7 }}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{
            fontFamily: "Arial, sans-serif",
            color: "#ff3838ff",
            fontWeight: 600,
            letterSpacing: "1px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: isMobile ? 1 : 2,
          }}
        >
          <img
            src="/texticon.png"
            alt="icon"
            style={{ width: isMobile ? 30 : 50, height: isMobile ? 30 : 50 }}
          />
          RR New Updates
          <img
            src="/texticon.png"
            alt="icon"
            style={{ width: isMobile ? 30 : 50, height: isMobile ? 30 : 50 }}
          />
        </Typography>
      </Box>

      <Box
        sx={{
          mt: 4,
          position: "relative",
          width: "100%",
          height: { xs: "35vh", sm: "45vh", md: "55vh", lg: "60vh" },
          overflow: "hidden",
          boxShadow: 3,
          backgroundColor: "#000",
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides */}
        <Box
          sx={{
            display: "flex",
            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: `translateX(-${currentIndex * 100}%)`,
            height: "100%",
            width: `${banners.length * 100}%`,
          }}
        >
          {banners.map((banner, index) => (
            <Box
              key={banner._id}
              sx={{
                minWidth: "100%",
                position: "relative",
                height: "100%",
                flexShrink: 0,
                backgroundColor: "#000",
              }}
            >
              {!imagesLoaded[banner._id] && (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    zIndex: 1,
                  }}
                >
                  Loading...
                </Box>
              )}
              <Image
                src={banner.banner_images[0]}
                alt={banner.title}
                fill
                sizes="100vw"
                style={{ objectFit: "cover" }}
                priority={index === 0}
                onLoadingComplete={() => handleImageLoad(banner._id)}
              />
            </Box>
          ))}
        </Box>

        {/* Navigation Arrows */}
        {!isMobile && banners.length > 1 && (
          <>
            <Box sx={{ ...navButtonPos, left: isTablet ? 8 : 16 }}>
              <Box onClick={prevSlide} sx={navButtonStyle}>
                ←
              </Box>
            </Box>
            <Box sx={{ ...navButtonPos, right: isTablet ? 8 : 16 }}>
              <Box onClick={nextSlide} sx={navButtonStyle}>
                →
              </Box>
            </Box>
          </>
        )}

        {/* Dots */}
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: isMobile ? 0.5 : 1,
            zIndex: 10,
          }}
        >
          {banners.map((_, index) => (
            <Box
              key={index}
              onClick={() => goToSlide(index)}
              sx={{
                width: isMobile ? 8 : 10,
                height: isMobile ? 8 : 10,
                borderRadius: "50%",
                backgroundColor:
                  currentIndex === index ? "#fff" : "rgba(255,255,255,0.5)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </Box>
      </Box>
    </>
  );
};

const navButtonPos = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 10,
  opacity: 0.7,
  transition: "opacity 0.3s",
  "&:hover": { opacity: 1 },
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
  "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
};

export default PoojaBanner;
