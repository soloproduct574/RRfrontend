"use client";
import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  useTheme,
  alpha,
  Container,
} from "@mui/material";
import { motion } from "framer-motion";
import SpaIcon from "@mui/icons-material/Spa";
import EmojiNatureIcon from "@mui/icons-material/EmojiNature";
import RecyclingIcon from "@mui/icons-material/Autorenew";
import HandshakeIcon from "@mui/icons-material/Handshake";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ForestIcon from "@mui/icons-material/Forest";
import FactoryIcon from "@mui/icons-material/Factory";
import PublicIcon from "@mui/icons-material/Public";
import WaterDropIcon from "@mui/icons-material/Opacity";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
// Replace EcoIcon with another suitable icon
import NatureIcon from "@mui/icons-material/Nature";
import ScienceIcon from "@mui/icons-material/Science";

const values = [
  {
    title: "SUSTAINABLE PRODUCTION",
    color: "#1a237e",
    subtitle: "Eco-conscious manufacturing",
    items: [
      { 
        icon: <RecyclingIcon fontSize="large" />, 
        label: "Closed-Loop Recycling System",
        description: "Zero-waste production with 95% material reuse"
      },
      { 
        icon: <FactoryIcon fontSize="large" />, 
        label: "Solar-Powered Facilities",
        description: "100% renewable energy in our manufacturing units"
      },
      { 
        icon: <ForestIcon fontSize="large" />, 
        label: "Regenerative Sourcing",
        description: "Partnering with certified sustainable farms"
      },
      { 
        icon: <PublicIcon fontSize="large" />, 
        label: "Carbon-Neutral Logistics",
        description: "Electric vehicle delivery & carbon offset programs"
      },
    ],
  },
  {
    title: "PURE & NATURAL",
    color: "#2e7d32",
    subtitle: "Authentic botanical formulations",
    items: [
      { 
        icon: <SpaIcon fontSize="large" />, 
        label: "Clinical-Grade Botanicals",
        description: "Lab-tested for purity and potency"
      },
      { 
        icon: <WaterDropIcon fontSize="large" />, 
        label: "Cold-Extracted Oils",
        description: "Preserving natural bioactive compounds"
      },
      { 
        icon: <ScienceIcon fontSize="large" />, 
        label: "No Synthetic Preservatives",
        description: "Natural preservation systems only"
      },
      { 
        icon: <LocalFloristIcon fontSize="large" />, 
        label: "Fresh Batch Production",
        description: "Small batches for maximum freshness"
      },
    ],
  },
  {
    title: "ETHICAL COMMITMENT",
    color: "#5d4037",
    subtitle: "Responsible business practices",
    items: [
      { 
        icon: <HandshakeIcon fontSize="large" />, 
        label: "Fair-Trade Certified",
        description: "Living wages for all supply chain partners"
      },
      { 
        icon: <NatureIcon fontSize="large" />, 
        label: "Cruelty-Free Certified",
        description: "Leaping Bunny certified, no animal testing"
      },
      { 
        icon: <FavoriteIcon fontSize="large" />, 
        label: "Community Investment",
        description: "5% profits to environmental conservation"
      },
      { 
        icon: <EmojiNatureIcon fontSize="large" />, 
        label: "Biodiversity Protection",
        description: "Supporting native species habitats"
      },
    ],
  },
];

// Animation variants
const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardVariant = {
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100,
      duration: 0.8
    }
  }
};

const itemVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100
    }
  }
};

const ValuesSection = () => {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 2, sm: 3 },
        position: "relative",
        overflow: "hidden",
      }}
    >
    
      
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
         
          <Box sx={{ textAlign: "center", mb: 3,  }}>
                <Typography
            variant="h4"
            sx={{
              fontFamily: "Arial, sans-serif",
              color: "#ff3838ff",
              fontWeight: 600,
              letterSpacing: "1px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              fontSize: {
                xs: "1.4rem", // 📱 Mobile
                sm: "1.5rem", // 📱➡💻 Tablet
                md: "2rem",   // 💻 Laptop
                lg: "2.5rem", // 🖥️ Large screens
              },
            }}
          >
            <img src="/texticon.png" alt="icon" style={{ width: 40, height: 40 }} />
            Our Values For a Greener Future
            <img src="/texticon.png" alt="icon" style={{ width: 40, height: 40 }} />
          </Typography>
          
                </Box>
          <Typography
            variant={{xs: "body1", md: "h6"}}
            align="center"
            component="p"
            sx={{
              fontWeight: 400,
              mb: { xs: 6, md: 10 },
              color: "text.secondary",
              maxWidth: 600,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Committed to sustainable innovation, pure ingredients, and ethical practices 
            that respect both people and planet.
          </Typography>
        </motion.div>

        <motion.div
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <Grid display={{ xs: "block", md: "flex" }} spacing={4}  justifyContent="space-evenly" gap={5} >
            {values.map((section, idx) => (
              <Grid item xs={12} md={6} lg={4} key={section.title} mt={{ xs: 3, md: 0 }}>
                <motion.div variants={cardVariant}>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: 4,
                      py: 4,
                      px: 3,
                      textAlign: "center",
                      background: `linear-gradient(145deg, 
                        ${alpha("#ffffff", 0.9)} 0%, 
                        ${alpha(section.color, 0.03)} 50%,
                        ${alpha("#ffffff", 0.9)} 100%)`,
                      border: `1px solid ${alpha(section.color, 0.1)}`,
                      boxShadow: `
                        0 4px 20px ${alpha(section.color, 0.08)},
                        0 2px 8px ${alpha(section.color, 0.04)},
                        inset 0 1px 0 ${alpha("#ffffff", 0.8)}
                      `,
                      backdropFilter: "blur(10px)",
                      transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                      maxHeight: {xs: '100%', md: '95vh'},
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        transform: "translateY(-8px) scale(1.02)",
                        boxShadow: `
                          0 20px 40px ${alpha(section.color, 0.15)},
                          0 8px 24px ${alpha(section.color, 0.1)},
                          inset 0 1px 0 ${alpha("#ffffff", 0.9)}
                        `,
                        border: `1px solid ${alpha(section.color, 0.2)}`,
                      },
                    }}
                  >
                    <Typography
                      variant="h5"
                      component="h3"
                      fontWeight={700}
                      sx={{
                        color: section.color,
                        mb: 1,
                        letterSpacing: "0.5px",
                        fontSize: { xs: "1.25rem", md: "1.5rem" },
                      }}
                    >
                      {section.title}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      component="p"
                      sx={{
                        color: "text.secondary",
                        mb: 4,
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        fontSize: "0.75rem",
                      }}
                    >
                      {section.subtitle}
                    </Typography>

                    <Box sx={{ flex: 1 }}>
                      {section.items.map((item, i) => (
                        <motion.div
                          key={i}
                          variants={itemVariant}
                          whileHover={{ 
                            scale: 1.03,
                            transition: { duration: 0.2 }
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              textAlign: "left",
                              p: 2.5,
                              mb: 2,
                              borderRadius: 3,
                              background: `linear-gradient(90deg, 
                                ${alpha(section.color, 0.05)} 0%, 
                                transparent 100%)`,
                              border: `1px solid ${alpha(section.color, 0.08)}`,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                background: `linear-gradient(90deg, 
                                  ${alpha(section.color, 0.1)} 0%, 
                                  transparent 100%)`,
                                border: `1px solid ${alpha(section.color, 0.15)}`,
                              },
                            }}
                          >
                            <Box
                              sx={{
                                color: section.color,
                                mr: 2.5,
                                mt: 0.5,
                                flexShrink: 0,
                              }}
                            >
                              {item.icon}
                            </Box>
                            <Box>
                              <Typography
                                component="h4"
                                sx={{
                                  fontSize: "1rem",
                                  fontWeight: 600,
                                  color: theme.palette.text.primary,
                                  lineHeight: 1.3,
                                  mb: 0.5,
                                }}
                              >
                                {item.label}
                              </Typography>
                              <Typography
                                variant="body2"
                                component="p"
                                sx={{
                                  color: "text.secondary",
                                  lineHeight: 1.5,
                                  fontSize: "0.875rem",
                                }}
                              >
                                {item.description}
                              </Typography>
                            </Box>
                          </Box>
                        </motion.div>
                      ))}
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ValuesSection;
