"use client";

import { Box, Grid, Typography, Button } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedIcon from "@mui/icons-material/Verified";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { keyframes } from "@mui/system";
import ContactButton from "./SupportCOmponents/Buttons";

// Define the shake animation
const shake = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(5deg); }
  100% { transform: rotate(0deg); }
`;

// Define the bloom animation
const bloom = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(244, 80, 30, 1); }
  70% { box-shadow: 0 0 0 10px rgba(244, 81, 30, 0); }
  100% { box-shadow: 0 0 0 0 rgba(244, 81, 30, 0); }
`;

export default function FeaturesSection() {
  const features = [
    {
      icon: <LocalShippingIcon sx={{ fontSize: 50 }} />,
      title: "100% SAFE DELIVERY",
    },
    {
      icon: <VerifiedIcon sx={{ fontSize: 50 }} />,
      title: "TOP-NOTCH QUALITY",
    },
    {
      icon: <CurrencyRupeeIcon sx={{ fontSize: 50 }} />,
      title: "BEST PRICE",
    },
  ];

  return (
    <Box
      sx={{
        background: "linear-gradient(55deg, #f2e9e92e 55%, #FAA533 40%)",
        py: 5,
        px: 5,
        px: { xs: 2, sm: 4, md: 8 },
      }}
    >
      <Grid container spacing={12} alignItems="center">
        {/* Left Section - Features */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={18} justifyContent="center">
            {features.map((feature, index) => (
              <Grid
                item
                xs={12}
                sm={4}
                key={index}
                sx={{ textAlign: "center" }}
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(145deg, #ffffff, #f5f5f5)",
                    border: "1px solid #f4511e",
                    borderRadius: "50%",
                    width: 100,
                    height: 100,
                    mb: 2,
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    animation: `${bloom} 2s infinite`,
                    "&:hover": {
                      animation: `${shake} 0.5s ease-in-out, ${bloom} 2s infinite`,
                      "& svg": {
                        color: "#d63d14",
                      },
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <Box
                    sx={{
                      color: "#f4511e",
                      "&:hover": {
                        animation: `${shake} 0.5s ease-in-out`,
                      },
                    }}
                  >
                    {feature.icon}
                  </Box>
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    color: "#333",
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    mt: 1,
                  }}
                >
                  {feature.title}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Right Section - Contact */}
        <Grid item xs={12} md={4} sx={{ textAlign: { xs: "center", md: "left" } }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontStyle: "oblique",
              fontWeight: 700, 
              color: "#000000ff",
              fontSize: { xs: "1.1rem", sm: "1.25rem" , md: "1.8rem"}
            }}
          >
            Have Queries or Concerns?
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: "#300909ff" }}>
            Our team is ready to assist you with any questions
          </Typography>
         <Box ml={7}>          <ContactButton />
</Box>
        </Grid>
      </Grid>
    </Box>
  );
}