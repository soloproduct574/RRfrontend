"use client";
import React from "react";
import { Box, Card, CardMedia, Grid, Typography, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";

// List of YouTube video IDs
const videoData = [
  { id: "aTm9fFCNDrY?si=84jeqQCA5NW1VC4-" },
  { id: "TTNuwtERFwM?si=KdabBGsbTQ8rSBAh" },
  { id: "5WdQQKg9dg8?si=eoC0r7hl_p-doeQJ" },
  { id: "fpF5gdTjimM?si=C3rBTTxu4cue7DtY" },
  { id: "LAHVyxTET7A?si=tbHPEuFXeHnWsDM1" },
  { id: "O6cda5SVEew?si=t3__s4rfHZejayXX" },
  { id: "deGZbTdtXbc?si=yb__8ZK76daKb-6R" },
  { id: "7FUoV1VvyzM?si=DKKi310aWWP9RqzG" },
];

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

export default function  
VideoCards() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); 

  return (
    <>
      {/* Section Title */}
      <Box sx={{ textAlign: "center", mb: 3, mt: 5 }}>
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
  Our Youtube Videos
  <img src="/texticon.png" alt="icon" style={{ width: 40, height: 40 }} />
</Typography>

      </Box>

      {/* Cards Section */}
      {isMobile ? (
        // ✅ Mobile → Horizontal scroll
        <Box
          sx={{
            display: "flex",
            gap: 2,
            px: 2,
            py: 3,
            overflowX: "auto",
            overflowY: "hidden",
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": { height: "6px" },
            "&::-webkit-scrollbar-thumb": {
              background: "#ccc",
              borderRadius: "10px",
            },
          }}
        >
          {videoData.map((video, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={index}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  minWidth: 280, // ✅ ensures visible card width in scroll
                  maxWidth: 320,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                  backgroundColor: "#fff",
                }}
              >
                <CardMedia
                  component="iframe"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={`Video ${index + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  sx={{
                    width: "100%",
                    height: 200,
                    aspectRatio: "16/9",
                    border: "none",
                  }}
                />
              </Card>
            </motion.div>
          ))}
        </Box>
      ) : (
        // ✅ Tablet & Laptop → Grid
        <Box display="flex" justifyContent="center" alignItems="center" px={{ xs: 2, md: 6 }} py={4}>
          <Grid container spacing={4} justifyContent="center" alignItems="center" maxWidth="lg">
            {videoData.map((video, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  custom={index}
                >
                  <Card
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                      backgroundColor: "#fff",
                    }}
                  >
                    <CardMedia
                      component="iframe"
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={`Video ${index + 1}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      sx={{
                        width: "100%",
                        height: { sm: 250, md: 220, lg: 200 },
                        aspectRatio: "16/9",
                        border: "none",
                      }}
                    />
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </>
  );
}
