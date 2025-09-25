"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, InputAdornment, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Image from "next/image";

export default function HeroBanner() {
  const bannerImages = [
    "/banner1.jpg", 
    "/banner2.jpg",
    "/banner3.jpg",
    "/banner4.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "60vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "center",
        background: "url('/mainbanner.jpg') no-repeat center",
        backgroundSize: "contain", // ✅ Make background responsive
        position: "relative",
        py: { xs: 2, md: 4 },
        px: { xs: 2, md: 6 },
      }}
    >
      {/* LEFT SIDE: TEXT + SEARCH */}
      <Box
        sx={{
          flex: 1,
          textAlign: { xs: "center", md: "left" },
          mb: { xs: 3, md: 0 },
          zIndex: 2,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: "#ff6600",
            fontSize: { xs: "1.8rem", md: "2.5rem" },
            // textShadow: "0 2px 6px rgba(0,0,0,0.5)",
            mb: 1,
          }}
        >
          RR Traders
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 3,
            color: "#ff6600",
            // textShadow: "0 1px 3px rgba(0,0,0,0.6)",
            fontSize: { xs: "0.95rem", md: "1.1rem" },
          }}
        >
          Find your favorite products with us today!
        </Typography>

        {/* SEARCH BAR */}
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: { xs: "row", sm: "row" },
            alignItems: "center",
            maxWidth: "500px",
            mx: { xs: "auto", md: "0" },
            background: "#fff",
            borderRadius: "50px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
            overflow: "hidden",
          }}
        >
          <TextField
            placeholder="Search products..."
            variant="standard"
            fullWidth
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start" sx={{ ml: 1 }}>
                  <SearchIcon color="warning" />
                </InputAdornment>
              ),
              sx: { py: 1, px: 2 }
            }}
          />
          <Button
            variant="contained"
            color="warning"
            sx={{
              borderRadius: 0,
              px: 3,
              py: 1.5,
              textTransform: "capitalize",
              fontWeight: 600,
              width: { xs: "50%", sm: "auto" },
            }}
          >
            Search
          </Button>
        </Box>
      </Box>

      {/* RIGHT SIDE: ROTATING BANNER IMAGES */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          width: "100%",
          maxWidth: { xs: "100%", md: "500px" },
          height: { xs: "200px", md: "300px" }, // ✅ Responsive height
          mt: { xs: 12, md: 0 },
        }}
      >
        {bannerImages.map((image, index) => (
          <Box
            key={index}
            sx={{
              position: "absolute",
              inset: 0,
              opacity: currentImageIndex === index ? 1 : 0,
              transition: "opacity 0.8s ease-in-out",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            {/* ✅ Use Next.js Image for optimization */}
            <Image
              src={image}
              alt={`Banner ${index + 1}`}
              fill
              priority={index === 0}
              style={{
                objectFit: "contain", // ✅ better for banners
              }}
            />
          </Box>
        ))}

        {/* Dots Indicator */}
        <Box
          sx={{
            position: "absolute",
            bottom: "10px",
            display: "flex",
            gap: 1,
            zIndex: 3,
          }}
        >
          {bannerImages.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: currentImageIndex === index ? "warning.main" : "rgba(255,255,255,0.5)",
                cursor: "pointer",
              }}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
