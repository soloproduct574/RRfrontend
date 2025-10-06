"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Stack,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";

export default function BannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [newBannerFiles, setNewBannerFiles] = useState([]);
  const [newAdvertiseFiles, setNewAdvertiseFiles] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]); // keep removed previous images

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  // ✅ Fetch banners
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/media/banners");
      const data = await res.json();
      if (data.success) {
        setBanners(data.banners);
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // ✅ Delete Banner
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      await fetch(`http://localhost:5000/api/media/banner/${id}`, {
        method: "DELETE",
      });
      setBanners((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  };

  // ✅ Edit Banner (open dialog)
  const handleEdit = (banner) => {
    setSelectedBanner(banner);
    setNewBannerFiles([]);
    setNewAdvertiseFiles([]);
    setDeletedImages([]);
    setEditDialog(true);
  };

  // ✅ Remove an existing image from preview
  const handleRemoveOldImage = (url) => {
    setDeletedImages((prev) => [...prev, url]);
    setSelectedBanner((prev) => ({
      ...prev,
      banner_images: prev.banner_images?.filter((img) => img !== url),
      advertise_images: prev.advertise_images?.filter((img) => img !== url),
    }));
  };

  // ✅ Update Banner with images
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("title", selectedBanner.title);
      formData.append(
        "rotating_texts",
        JSON.stringify(selectedBanner.rotating_texts || [])
      );
      formData.append(
        "redirect_urls",
        JSON.stringify(selectedBanner.redirect_urls || [])
      );

      // Send deleted images list
      if (deletedImages.length > 0) {
        formData.append("deleted_images", JSON.stringify(deletedImages));
      }

      // Append new banner images if selected
      newBannerFiles.forEach((file) => {
        formData.append("banner_images", file);
      });

      // Append new advertise images if selected
      newAdvertiseFiles.forEach((file) => {
        formData.append("advertise_images", file);
      });

      const res = await fetch(
        `http://localhost:5000/api/media/banner/${selectedBanner._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.success) {
        setBanners((prev) =>
          prev.map((b) => (b._id === selectedBanner._id ? data.banner : b))
        );
        setEditDialog(false);
      }
    } catch (err) {
      console.error("❌ Update error:", err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 4, md: 6 },
        px: { xs: 2, md: 4 },
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #0f172a, #1e293b)"
            : "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
      }}
    >
      <Container maxWidth="lg">
        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Typography
            variant={isSmall ? "h5" : "h4"}
            fontWeight="bold"
            align="center"
            sx={{
              mb: 4,
              letterSpacing: "-0.5px",
              color: theme.palette.mode === "dark" ? "#f9fafb" : "#0f172a",
              textShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            🎨 Banner Management
          </Typography>
        </motion.div>

        {/* Loading */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {banners.map((banner) => (
              <Grid item xs={12} sm={6} md={4} key={banner._id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                    }}
                  >
                    {banner.banner_images?.[0] && (
                      <CardMedia
                        component="img"
                        height={180}
                        image={banner.banner_images[0]}
                        alt={banner.title}
                        sx={{ objectFit: "cover" }}
                      />
                    )}
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        fontWeight="bold"
                        sx={{ color: theme.palette.primary.main }}
                      >
                        {banner.title}
                      </Typography>

                      {/* Rotating Texts */}
                      <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
                        {banner.rotating_texts?.map((txt, i) => (
                          <Chip
                            key={i}
                            label={txt}
                            size="small"
                            color="primary"
                            sx={{ fontWeight: 500 }}
                          />
                        ))}
                      </Stack>

                      {/* Redirect URLs */}
                      <Stack direction="column" spacing={0.5} mb={2}>
                        {banner.redirect_urls?.map((url, i) => (
                          <Typography
                            key={i}
                            variant="body2"
                            sx={{ color: theme.palette.info.main }}
                          >
                            {url}
                          </Typography>
                        ))}
                      </Stack>

                      {/* Actions */}
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleEdit(banner)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDelete(banner._id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Edit Dialog */}
        <Dialog
          open={editDialog}
          onClose={() => setEditDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle fontWeight="bold">✏️ Edit Banner</DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              value={selectedBanner?.title || ""}
              onChange={(e) =>
                setSelectedBanner({ ...selectedBanner, title: e.target.value })
              }
              fullWidth
              margin="normal"
            />

            {/* Show existing images */}
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Current Banner Images
            </Typography>
            <Grid container spacing={2}>
              {selectedBanner?.banner_images?.map((img, i) => (
                <Grid item xs={6} sm={4} key={i}>
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      image={img}
                      alt={`banner-${i}`}
                      sx={{ borderRadius: 2, height: 120, objectFit: "cover" }}
                    />
                    <IconButton
                      onClick={() => handleRemoveOldImage(img)}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "rgba(255,255,255,0.8)",
                      }}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Current Advertise Images
            </Typography>
            <Grid container spacing={2}>
              {selectedBanner?.advertise_images?.map((img, i) => (
                <Grid item xs={6} sm={4} key={i}>
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      image={img}
                      alt={`adv-${i}`}
                      sx={{ borderRadius: 2, height: 120, objectFit: "cover" }}
                    />
                    <IconButton
                      onClick={() => handleRemoveOldImage(img)}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "rgba(255,255,255,0.8)",
                      }}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* File Inputs */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1">Upload New Banner Images</Typography>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setNewBannerFiles(Array.from(e.target.files))}
              />
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1">Upload New Advertise Images</Typography>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  setNewAdvertiseFiles(Array.from(e.target.files))
                }
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdate} variant="contained" color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
