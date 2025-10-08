"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  Dialog,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
  Drawer,
  AppBar,
  Toolbar,
  Grid,
  Card,
  CardMedia,
  CardActions,
} from "@mui/material";
import { Close, Menu, Delete } from "@mui/icons-material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/redux/slice/CategoryFileMakeSlice";
import AdminSidebar from "@/components/dashboards/AdminSideBar";

// 🔸 Responsive glass text field style
const getGlassTextFieldStyle = (isMobile) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "white" },
    "&:hover fieldset": { borderColor: "#ff9900" },
    "&.Mui-focused fieldset": { borderColor: "#ff9900" },
  },
  "& .MuiInputLabel-root": { color: "white" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#ff9900" },
  input: { color: "white" },
  "& input::placeholder": {
    color: "rgba(255,255,255,0.7)",
    opacity: 1,
  },
  fontSize: isMobile ? "14px" : "16px",
});

// 🔸 Main Component
export default function ProductRegisterPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const dispatch = useDispatch();

  // Redux state
  const categoriesState = useSelector((state) => state.categoryReducer) || {};
  const categories = categoriesState.items || [];
  console.log("Categories:", categories);
  
  const categoriesStatus = categoriesState.status || "idle";

  // Local UI state
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState(null);
  const [imageError, setImageError] = useState("");
  const [videoError, setVideoError] = useState("");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const [formData, setFormData] = useState({
    product_name: "",
    description: "",
    original_price: "",
    offer_price: "",
    category: "",
    images: [],
    video: null,
  });

  const [previewDialog, setPreviewDialog] = useState({
    open: false,
    src: "",
    type: "",
  });

  // 🔸 Load categories from redux
  useEffect(() => {
    if (categoriesStatus === "idle") {
      dispatch(fetchCategories());
    }
  }, [dispatch, categoriesStatus]);

  /** Handle field and file inputs */
 const handleChange = (e) => {
  const { name, files, value } = e.target;

  if (name === "images" && files) {
    const newFiles = Array.from(files);

    // ✅ Max 5 images total
    if (formData.images.length + newFiles.length > 5) {
      setImageError("Maximum 5 images allowed");
      return;
    }

    // ✅ Validate each image (max 1 MB)
    const oversized = newFiles.filter((file) => file.size > 1 * 1024 * 1024);
    if (oversized.length > 0) {
      setImageError(
        `${oversized.map((f) => f.name).join(", ")} exceeds 1 MB limit`
      );
      return;
    }

    setImageError("");
    const updated = newFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...updated],
    }));
  } 
  
  else if (name === "video" && files) {
    if (files.length > 1) {
      setVideoError("Only one video allowed");
      return;
    }

    const videoFile = files[0];

    // ✅ Validate video (max 15 MB)
    if (videoFile.size > 10 * 1024 * 1024) {
      setVideoError(`${videoFile.name} exceeds 15 MB limit`);
      return;
    }

    setVideoError("");
    setFormData((prev) => ({
      ...prev,
      video: { file: videoFile, url: URL.createObjectURL(videoFile) },
    }));
  } 
  
  else {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
};


  /** Remove specific previews */
  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };
  const removeVideo = () => setFormData((prev) => ({ ...prev, video: null }));

  /** Submit form to backend */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMsg(null);
    setLoading(true);

    if (formData.images.length < 3) {
      setImageError("Minimum 3 images required.");
      setLoading(false);
      return;
    }

    try {
      const fd = new FormData();
      fd.append("product_name", formData.product_name);
      fd.append("description", formData.description);
      fd.append("original_price", formData.original_price);
      fd.append("offer_price", formData.offer_price);
      fd.append(
        "categories",
        formData.category
          ? JSON.stringify([{ name: formData.category }])
          : "[]"
      );
      formData.images.forEach((img) => fd.append("images", img.file));
      if (formData.video) fd.append("video", formData.video.file);

      await axios.post("https://rrbackend-49lt.onrender.com/api/products/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setServerMsg({
        type: "success",
        text: "✅ Product registered successfully!",
      });

      // Reset everything
      setFormData({
        product_name: "",
        description: "",
        original_price: "",
        offer_price: "",
        category: "",
        images: [],
        video: null,
      });
      setImageError("");
      setVideoError("");
    } catch (err) {
      setServerMsg({
        type: "error",
        text: err.response?.data?.message || "Something went wrong!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* 🔸 Mobile AppBar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={() => setMobileDrawerOpen(true)}
              edge="start"
            >
              <Menu />
            </IconButton>
            <Typography variant="h6">Admin Panel</Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* 🔸 Sidebar Drawer */}
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
          },
        }}
      >
        <AdminSidebar onLogout={() => setMobileDrawerOpen(false)} />
      </Drawer>

      {/* 🔸 Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          backgroundImage: "url('/manageproductbg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          p: isMobile ? 1 : 3,
          pt: isMobile ? "64px" : 0,
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.25)",
            zIndex: 1,
          },
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Form Wrapper */}
          <Paper
            elevation={4}
            sx={{
              p: isMobile ? 2 : 4,
              borderRadius: 3,
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            }}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              align="center"
              fontWeight={700}
              mb={3}
            >
              Add Product
            </Typography>

            {serverMsg && (
              <Alert severity={serverMsg.type} sx={{ mb: 2 }}>
                {serverMsg.text}
              </Alert>
            )}

            {/* 🧾 Form */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              {/* Category */}
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  label="Category"
                  onChange={handleChange}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat.category_name}>
                      {cat.category_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Basic Fields */}
              {["product_name", "original_price", "offer_price"].map((f) => (
                <TextField
                  key={f}
                  label={f.replace("_", " ").toUpperCase()}
                  name={f}
                  type={f.includes("price") ? "number" : "text"}
                  fullWidth
                  value={formData[f]}
                  onChange={handleChange}
                  required
                  sx={getGlassTextFieldStyle(isMobile)}
                />
              ))}

              <TextField
                label="Description"
                name="description"
                multiline
                rows={isMobile ? 2 : 3}
                fullWidth
                value={formData.description}
                onChange={handleChange}
                required
                sx={getGlassTextFieldStyle(isMobile)}
              />

              {/* Upload Buttons */}
              <Box
                display="flex"
                flexDirection={isMobile ? "column" : "row"}
                gap={1}
              >
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{
                    color: "#fff",
                    borderColor: "#fff",
                    "&:hover": { borderColor: "#ff9900", color: "#ff9900" },
                  }}
                >
                  Upload Images (3–5)
                  <input
                    hidden
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleChange}
                    disabled={formData.images.length >= 5}
                    max={5}
                  />
                </Button>

                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{
                    color: "#fff",
                    borderColor: "#fff",
                    "&:hover": { borderColor: "#ff9900", color: "#ff9900" },
                  }}
                >
                  Upload Video
                  <input
                    hidden
                    type="file"
                    name="video"
                    accept="video/*"
                    onChange={handleChange}
                    disabled={!!formData.video}
                  />
                </Button>
              </Box>

              {/* Upload Errors */}
              {imageError && <Alert severity="error">{imageError}</Alert>}
              {videoError && <Alert severity="error">{videoError}</Alert>}

              {/* Image Previews */}
              {formData.images.length > 0 && (
                <Box mt={2}>
                  <Typography fontWeight={600}>Image Preview</Typography>
                  <Grid container spacing={1}>
                    {formData.images.map((img, idx) => (
                      <Grid item xs={4} sm={3} key={idx}>
                        <Card sx={{ position: "relative" }}>
                          <CardMedia
                            component="img"
                            image={img.url}
                            alt={`preview-${idx}`}
                            sx={{ height: 80, objectFit: "cover", cursor: "pointer" }}
                            onClick={() =>
                              setPreviewDialog({
                                open: true,
                                type: "image",
                                src: img.url,
                              })
                            }
                          />
                          <CardActions
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => removeImage(idx)}
                              sx={{
                                bgcolor: "rgba(0,0,0,0.5)",
                                color: "white",
                                "&:hover": { bgcolor: "red" },
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Video Preview */}
              {formData.video && (
                <Box mt={2}>
                  <Typography fontWeight={600}>Video Preview</Typography>
                  <Card sx={{ position: "relative" }}>
                    <video
                      src={formData.video.url}
                      style={{ width: "100%", maxHeight: "200px" }}
                      controls
                    />
                    <CardActions
                      sx={{ position: "absolute", top: 0, right: 0 }}
                    >
                      <IconButton
                        size="small"
                        onClick={removeVideo}
                        sx={{
                          bgcolor: "rgba(0,0,0,0.5)",
                          color: "white",
                          "&:hover": { bgcolor: "red" },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Box>
              )}

              {/* Submit */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 2,
                  fontWeight: "bold",
                  borderRadius: 2,
                  background: "linear-gradient(45deg, #ff6600, #ff9900)",
                }}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Add Product"
                )}
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* 🔸 Fullscreen Image/Video Preview Dialog */}
      <Dialog
        open={previewDialog.open}
        onClose={() => setPreviewDialog({ open: false, src: "", type: "" })}
        maxWidth="md"
        fullScreen={isMobile}
      >
        <Box sx={{ position: "relative", p: 1 }}>
          <IconButton
            onClick={() => setPreviewDialog({ open: false, src: "", type: "" })}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "rgba(0,0,0,0.5)",
              color: "#fff",
            }}
          >
            <Close />
          </IconButton>
          {previewDialog.type === "image" ? (
            <img
              src={previewDialog.src}
              alt="preview"
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
            />
          ) : (
            <video
              src={previewDialog.src}
              controls
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
            />
          )}
        </Box>
      </Dialog>
    </Box>
  );
}
