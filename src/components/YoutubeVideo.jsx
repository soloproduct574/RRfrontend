"use client";
import React from "react";
import { Box, Card, CardMedia, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";

// List of YouTube video IDs
const videoData = [
  { id: "dQw4w9WgXcQ" },
  { id: "V-_O7nl0Ii0" },
  { id: "C0DPdy98e4c" },
  { id: "kXYiU_JCYtU" },
  { id: "ScMzIvxBSi4" },
  { id: "NEMbS4wVnzM" },
  { id: "45cYwDMibGo" },
  { id: "3JZ_D3ELwOQ" },
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

export default function VideoCards() {
  return (
    <>
    <Box sx={{ textAlign: "center", mb: 10,mt:10 }}>
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
            }}
          >
            <img src="/texticon.png" alt="icon" style={{ width: 50, height: 50 }} />
            Top Trending Products
            <img src="/texticon.png" alt="icon" style={{ width: 50, height: 50 }} />
          </Typography>
        </Box>
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={{ xs: 2, md: 6 }}
      py={4}
    >
      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="center"
        maxWidth="lg"
      >
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
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
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
                    height: { xs: 200, sm: 250, md: 220, lg: 200 },
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
    </>
  );
}
