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
  AppBar,
  Toolbar,
  Drawer, Menu
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import AdminSidebar from "@/components/dashboards/AdminSideBar";

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
      const res = await fetch("https://rrbackend-49lt.onrender.com/api/media/banners");
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
      await fetch(`https://rrbackend-49lt.onrender.com/api/media/banner/${id}`, {
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
        `https://rrbackend-49lt.onrender.com/api/media/banner/${selectedBanner._id}`,
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

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  return (
    <>
    
    <Box sx={{ display: "flex", justifyContent: "center", minHeight: "100vh" }}>
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Toolbar>
          
            <Typography variant="h6" noWrap component="div"    onClick={() => setMobileDrawerOpen(true)}>
              Admin Panel
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileDrawerOpen : true}
        onClose={() => setMobileDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: isMobile ? 240 : isTablet ? 200 : 257,
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            backdropFilter: "blur(10px)",
            height: "100vh",
            position: "fixed",
          },
        }}
      >
        <AdminSidebar onLogout={() => setMobileDrawerOpen(false)} />
      </Drawer>
    
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 10, md: 6 },
        px: { xs: 2, md: 4 },
   
      }}
    >
      <Box maxWidth="lg">
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
                      <Box sx={{ display: "flex", justifyContent: "space-between",gap:2 }}>
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

           {/* Banner Upload */}
<Box sx={{ mt: 3 }}>
  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
    Upload New Banner Images
  </Typography>

  <Box
    // component="label"
    sx={{
      p: 4,
      border: "2px dashed",
      borderColor: "divider",
      borderRadius: 3,
      backgroundColor: "action.hover",
      textAlign: "center",
      cursor: "pointer",
      transition: "all 0.3s ease",
      "&:hover": {
        borderColor: "info.main",
        backgroundColor: "action.selected",
        transform: "scale(1.01)",
        boxShadow: 2,
      },
    }}
  >
    <input
      hidden
      type="file"
      accept="image/*"
      multiple
      onChange={(e) => setNewBannerFiles(Array.from(e.target.files))}
    />
    <CloudUploadIcon sx={{ fontSize: 50, mb: 1, color: "info.main" }} />
    <Typography variant="h6" fontWeight="bold" color="info.main">
      Click or Drag Images Here
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Upload banner images (JPG, PNG, WEBP)
    </Typography>
  </Box>

  {/* Banner Previews */}
  {newBannerFiles?.length > 0 && (
    <Box
      sx={{
        mt: 2,
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      {newBannerFiles.map((file, idx) => (
        <Box
          key={idx}
          sx={{
            position: "relative",
            width: 90,
            height: 90,
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: 2,
          }}
        >
          <img
            src={URL.createObjectURL(file)}
            alt={`banner-${idx}`}
            width="100%"
            height="100%"
            style={{ objectFit: "cover" }}
          />
        </Box>
      ))}
    </Box>
  )}
</Box>

{/* Advertise Upload */}
<Box sx={{ mt: 4 }}>
  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
    Upload New Advertise Images
  </Typography>

  <Box
    // component="label"
    sx={{
      p: 4,
      border: "2px dashed",
      borderColor: "divider",
      borderRadius: 3,
      backgroundColor: "action.hover",
      textAlign: "center",
      cursor: "pointer",
      transition: "all 0.3s ease",
      "&:hover": {
        borderColor: "success.main",
        backgroundColor: "action.selected",
        transform: "scale(1.01)",
        boxShadow: 2,
      },
    }}
  >
    <input
      hidden
      type="file"
      accept="image/*"
      multiple
      onChange={(e) => setNewAdvertiseFiles(Array.from(e.target.files))}
    />
    <CloudUploadIcon sx={{ fontSize: 50, mb: 1, color: "success.main" }} />
    <Typography variant="h6" fontWeight="bold" color="success.main">
      Click or Drag Images Here
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Upload advertise images (JPG, PNG, WEBP)
    </Typography>
  </Box>

  {/* Advertise Previews */}
  {newAdvertiseFiles?.length > 0 && (
    <Box
      sx={{
        mt: 2,
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      {newAdvertiseFiles.map((file, idx) => (
        <Box
          key={idx}
          sx={{
            position: "relative",
            width: 90,
            height: 90,
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: 2,
          }}
        >
          <img
            src={URL.createObjectURL(file)}
            alt={`advertise-${idx}`}
            width="100%"
            height="100%"
            style={{ objectFit: "cover" }}
          />
        </Box>
      ))}
    </Box>
  )}
</Box>

          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdate} variant="contained" color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
    </Box>
    </>
  );
}
