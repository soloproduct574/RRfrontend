"use client";

import React, { useEffect, useState } from "react";
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
import { fetchBannersMedia } from "../redux/slice/bannerSlice.jsx";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

const PoojaBanner = () => {
  const dispatch = useDispatch();
  const { items: banners, status } = useSelector((state) => state.banners);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Flatten ads + banner images to one stream
  const allImages = banners.flatMap((b) => b.all_images || []);

  // Fetch once
  useEffect(() => {
    if (status === "idle") dispatch(fetchBannersMedia());
  }, [dispatch, status]);

  // ✅ Auto slide every 4s regardless of preload
  useEffect(() => {
    if (!allImages.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [allImages.length]);

  if (status === "loading") {
    return (
      <Box
        sx={{
          mt: 3,
          height: { xs: "35vh", sm: "45vh", md: "55vh", lg: "65vh" },
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

  if (!allImages.length) {
    return (
      <Box sx={{ mt: 3, textAlign: "center", color: "text.secondary" }}>
        No Banners Found
      </Box>
    );
  }

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  const prevSlide = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );

  return (
    <>
     

      {/* Slider */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: "35vh", sm: "45vh", md: "55vh", lg: "65vh" },
          overflow: "hidden",
          borderRadius: 2,
          bgcolor: "#ffffffff",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{ position: "relative", width: "100%", height: "100%" }}
          >
            <Image
              src={allImages[currentIndex] || "/placeholder.jpg"}
              alt={`banner-${currentIndex}`}
              fill
              sizes="(max-width: 600px) 100vw,
                     (max-width: 1200px) 80vw,
                     100vw"
              style={{ objectFit: isMobile?"contain":"cover", objectPosition: "center" }}
              priority={currentIndex === 0} // LCP boost first one only
              unoptimized // direct CDN, no next/image proxy issues
            />
          </motion.div>
        </AnimatePresence>

        {/* Nav Arrows */}
        {allImages.length > 1 && (
          <>
            <IconButton
              onClick={prevSlide}
              sx={{ ...navButtonPos, left: isTablet ? 8 : 16 }}
            >
              <ArrowBackIosNew fontSize="small" />
            </IconButton>
            <IconButton
              onClick={nextSlide}
              sx={{ ...navButtonPos, right: isTablet ? 8 : 16 }}
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
          {allImages.map((_, index) => (
            <motion.div
              key={index}
              onClick={() => setCurrentIndex(index)}
              animate={{
                scale: currentIndex === index ? 1.3 : 1,
                backgroundColor:
                  currentIndex === index ? "#fff" : "rgba(255,255,255,0.5)",
              }}
              transition={{ duration: 0.3 }}
              style={{
                width: isMobile ? 8 : 10,
                height: isMobile ? 8 : 10,
                borderRadius: "50%",
                cursor: "pointer",
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
