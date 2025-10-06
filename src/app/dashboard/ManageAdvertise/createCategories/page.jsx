"use client";

import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createCategory, fetchCategories } from "@/Redux/Slice/CategoryFileMakeSlice";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import MenuIcon from "@mui/icons-material/Menu";
import AdminSidebar from "@/components/dashboards/AdminSideBar";

const AddCategoryPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const { error } = useSelector((state) => state.categoryReducer);

  const [categoryName, setCategoryName] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert("Please enter a category name");
      return;
    }

    if (images.length === 0) {
      alert("Please select at least one image");
      return;
    }

    const formData = new FormData();
    formData.append("category_name", categoryName);
    images.forEach((image) => {
      formData.append("category_images", image);
    });

    try {
      setLoading(true); // start loading

      const result = await dispatch(createCategory(formData)).unwrap();
      console.log("Upload successful:", result);

      await dispatch(fetchCategories());

      setCategoryName("");
      setImages([]);

      // Wait 1 second for a smooth UX effect
      setTimeout(() => {
        setLoading(false);
        router.push("/categories/list");
      }, 1000);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to create category. Please try again.");
      setLoading(false); // stop loading if failed
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", minHeight: "100vh" }}>
      {/* Mobile AppBar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setMobileDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Admin Panel
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileDrawerOpen : true}
        onClose={() => setMobileDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: isMobile ? 240 : isTablet ? 200 : 257,
            backgroundColor: "rgba(0,0,0,0.9)",
            backdropFilter: "blur(10px)",
          },
        }}
      >
        <AdminSidebar onLogout={() => setMobileDrawerOpen(false)} />
      </Drawer>

      {/* Form Section */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: { xs: 2, sm: 4 },
        }}
      >
        <Card
          component={motion.div}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 70 }}
          sx={{
            width: "100%",
            maxWidth: 480,
            borderRadius: 4,
            p: { xs: 3, sm: 4 },
            boxShadow: "0px 8px 30px rgba(0,0,0,0.12)",
            backdropFilter: "blur(10px)",
            bgcolor: "rgba(255,255,255,0.9)",
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              fontWeight="bold"
              align="center"
              sx={{
                mb: 3,
                background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Create New Category
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                label="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                fullWidth
                required
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
              />

              {/* Upload Box */}
              <Box
                onClick={handleBoxClick}
                sx={{
                  mb: 3,
                  border: "2px dashed #94a3b8",
                  borderRadius: 3,
                  p: 3,
                  textAlign: "center",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "#6366f1",
                    backgroundColor: "#f9fafb",
                  },
                }}
              >
                <input
                  ref={fileInputRef}
                  hidden
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <CloudUploadIcon sx={{ fontSize: 40, color: "#6366f1", mb: 1 }} />
                <Typography variant="body1" fontWeight={600}>
                  {images.length > 0
                    ? `${images.length} file(s) selected`
                    : "Click or drag images here"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Supports: JPG, PNG, GIF
                </Typography>
              </Box>

              {/* Preview Thumbnails */}
              {images.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1.5,
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  {images.map((img, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        position: "relative",
                        overflow: "hidden",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      }}
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt="preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <IconButton
                        onClick={() => removeImage(i)}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          bgcolor: "rgba(255,255,255,0.85)",
                          "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                        }}
                      >
                        <HighlightOffIcon color="error" fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  py: 1.3,
                  fontWeight: 600,
                  borderRadius: 2.5,
                  background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                  "&:hover": {
                    background: "linear-gradient(90deg, #2563eb, #7c3aed)",
                    transform: loading ? "none" : "translateY(-2px)",
                    boxShadow: loading
                      ? "none"
                      : "0 6px 15px rgba(59,130,246,0.3)",
                  },
                }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  "Create Category"
                )}
              </Button>

              {error && (
                <Typography color="error" mt={2} align="center">
                  {error}
                </Typography>
              )}
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AddCategoryPage;
