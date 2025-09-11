"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, InputAdornment, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Image from "next/image";

export default function HeroBanner() {
  // Array of banner images to rotate through
  const bannerImages = [
    "/footerbg.jpg", // You'll need to add these images to your public folder
    "/logo.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Effect to rotate images every 2 seconds
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
        minHeight: "30vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "center",
        background: "url('/herobaner1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
        position: "relative",
        py: 4,
      }}
    >
      {/* Content container */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "1200px",
          px: { xs: 2, md: 4 },
        }}
      >
        {/* LEFT SIDE: TEXT + SEARCH */}
        <Box
          sx={{
            flex: 1,
            textAlign: { xs: "center", md: "left" },
            mb: { xs: 4, md: 0 },
            zIndex: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "white",
              fontSize: { xs: "2rem", md: "2.5rem" },
              textAlign: { xs: "center", md: "left" },
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              mb: 1,
            }}
          >
            RR Traders
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 3,
              color: "rgba(255,255,255,0.85)",
              fontWeight: 400,
              textAlign: { xs: "center", md: "left" },
              fontSize: { xs: "1rem", md: "1.1rem" },
            }}
          >
            Find your favorite products with us today!
          </Typography>

          {/* SEARCH BAR */}
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              maxWidth: "500px",
              margin: { xs: "0 auto", md: "0" },
              background: "#fff",
              borderRadius: "50px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
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
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
                sx: { py: 1, px: 2 }
              }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{
                borderRadius: "0",
                px: 3,
                py: 1.5,
                textTransform: "capitalize",
                fontWeight: 600,
                width: { xs: "100%", sm: "auto" },
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
            height: { xs: "250px", md: "300px" },
            width: "100%",
          }}
        >
          {bannerImages.map((image, index) => (
            <Box
              key={index}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: currentImageIndex === index ? 1 : 0,
                transition: "opacity 0.5s ease-in-out",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "900px",
                  height: "100%",
                
                }}
              >
                <img
                  src={image}
                  alt={`Products Banner ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "16px",
                    objectFit: "contain",
                    position: "relative",
                    zIndex: 1,
                  }}
                />
              </Box>
            </Box>
          ))}
          
          {/* Indicator dots */}
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
                  backgroundColor: currentImageIndex === index ? "primary.main" : "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                }}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}