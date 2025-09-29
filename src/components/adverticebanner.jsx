"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Typography,
  IconButton,
} from "@mui/material";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchBannersMedia } from "../Redux/Slice/BannerSlice";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";

const PoojaBanner = () => {
  const dispatch = useDispatch();
  const { items: banners, status } = useSelector((state) => state.banners);

  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [paused, setPaused] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (status === "idle") dispatch(fetchBannersMedia());
  }, [dispatch, status]);

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

  const handleTouchStart = (e) =>
    (touchStartX.current = e.changedTouches[0].screenX);
  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    if (touchStartX.current - touchEndX.current > 75) nextSlide();
    if (touchEndX.current - touchStartX.current > 75) prevSlide();
  };

  const handleImageLoad = (id) =>
    setImagesLoaded((prev) => ({ ...prev, [id]: true }));

  if (status === "loading") {
    return (
      <Box
        sx={{
          mt: 4,
          height: { xs: "30vh", sm: "40vh", md: "55vh", lg: "65vh" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "black",
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (!banners || banners.length === 0) {
    return (
      <Box sx={{ mt: 4, textAlign: "center", color: "text.secondary" }}>
        No Banners Found
      </Box>
    );
  }

  return (
    <>
      {/* Heading */}
      <Box sx={{ textAlign: "center", mb: 6, mt: 7 }}>
        <Typography
          variant={isMobile ? "h6" : "h4"}
          sx={{
            fontFamily: "Arial, sans-serif",
            color: "#ff3838ff",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: isMobile ? 1 : 2,
          }}
        >
          <Image
            src="/texticon.png"
            alt="icon"
            width={isMobile ? 25 : 40}
            height={isMobile ? 25 : 40}
          />
          RR New Updates
          <Image
            src="/texticon.png"
            alt="icon"
            width={isMobile ? 25 : 40}
            height={isMobile ? 25 : 40}
          />
        </Typography>
      </Box>

      {/* Slider */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: "30vh", sm: "40vh", md: "55vh", lg: "65vh" },
          overflow: "hidden",
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "black",
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slide wrapper */}
        <Box
          sx={{
            display: "flex",
            transition: "transform 0.6s ease-in-out",
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
                bgcolor: "black",
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
            <IconButton
              onClick={prevSlide}
              sx={{
                ...navButtonPos,
                left: isTablet ? 8 : 16,
              }}
            >
              <ArrowBackIosNew fontSize="small" />
            </IconButton>
            <IconButton
              onClick={nextSlide}
              sx={{
                ...navButtonPos,
                right: isTablet ? 8 : 16,
              }}
            >
              <ArrowForwardIos fontSize="small" />
            </IconButton>
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
                bgcolor:
                  currentIndex === index ? "white" : "rgba(255,255,255,0.5)",
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
  bgcolor: "rgba(0,0,0,0.4)",
  color: "white",
  "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
};

export default PoojaBanner;