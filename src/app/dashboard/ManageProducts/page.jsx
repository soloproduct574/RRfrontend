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
} from "@mui/material";
import { Close, Menu } from "@mui/icons-material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/redux/slice/CategoryFileMakeSlice";
import AdminSidebar from "@/components/dashboards/AdminSideBar";

// Responsive glass text field styles
const getGlassTextFieldStyle = (isMobile) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "white" },
    "&:hover fieldset": { borderColor: "#ff9900" },
    "&.Mui-focused fieldset": { borderColor: "white" },
  },
  "& .MuiInputLabel-root": { color: "white" },
  "& .MuiInputLabel-root.Mui-focused": { color: "white" },
  input: { color: "white" },
  "& input::placeholder": {
    color: "rgba(255,255,255,0.7)",
    opacity: 1,
  },
  fontSize: isMobile ? "14px" : "16px",
});

export default function ProductRegisterPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isLaptop = useMediaQuery(theme.breakpoints.up("md"));
  const dispatch = useDispatch();
  const categoriesState = useSelector((state) => state.categoryReducer) || {};
  const categories = categoriesState.items || [];
  const categoriesStatus = categoriesState.status || "idle";
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

  // Fetch categories on mount
  useEffect(() => {
    if (categoriesStatus === "idle") {
      dispatch(fetchCategories());
    }
  }, [dispatch, categoriesStatus]);

  const handleChange = (e) => {
    const { name, files, value } = e.target;

    if (name === "images" && files) {
      const newFiles = Array.from(files);

      if (formData.images.length + newFiles.length > 5) {
        setImageError("Maximum 5 images allowed");
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
    } else if (name === "video" && files) {
      if (files.length > 1) {
        setVideoError("Only one video allowed");
        return;
      }
      setVideoError("");
      setFormData((prev) => ({
        ...prev,
        video: { file: files[0], url: URL.createObjectURL(files[0]) },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const removeFile = (name) => {
    if (name === "images") {
      setFormData((prev) => ({ ...prev, images: [] }));
      setImageError("");
    } else if (name === "video") {
      setFormData((prev) => ({ ...prev, video: null }));
      setVideoError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setServerMsg(null);

    if (formData.images.length < 3) {
      setImageError("Minimum 3 images required");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("product_name", formData.product_name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("original_price", formData.original_price);
      formDataToSend.append("offer_price", formData.offer_price);
      if (formData.category) {
        formDataToSend.append(
          "categories",
          JSON.stringify([{ name: formData.category }])
        );
      } else {
        formDataToSend.append("categories", "[]");
      }
      formData.images.forEach((img) => formDataToSend.append("images", img.file));
      if (formData.video) {
        formDataToSend.append("video", formData.video.file);
      }
      await axios.post(
        "http://localhost:5000/api/products/",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setServerMsg({
        type: "success",
        text: "✅ Product registered successfully!",
      });

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
    } catch (error) {
      setServerMsg({
        type: "error",
        text: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
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
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setMobileDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <Menu />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
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

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: isLaptop ? "center" : "stretch",
          justifyContent: "center",
          p: isMobile ? 1 : 3,
          backgroundImage: "url('/manageproductbg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          width: "100%",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 1,
          },
          pt: isMobile ? "64px" : 0,
        }}
      >
        <Container
          maxWidth={isMobile || isTablet ? false : "sm"}
          sx={{
            position: "relative",
            zIndex: 2,
            height: isLaptop ? "auto" : "100%",
            display: "flex",
            alignItems: "stretch",
            px: isMobile ? 2 : 3,
          }}
        >
          <Paper
            elevation={4}
            sx={{
              p: isMobile ? 2 : 4,
              borderRadius: 3,
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {/* Title */}
            <Typography
              variant={isMobile ? "h5" : "h4"}
              fontWeight="bold"
              gutterBottom
              align="center"
              sx={{ color: "black" }}
            >
              Add Your Product
            </Typography>

            {serverMsg && (
              <Alert severity={serverMsg.type} sx={{ mb: 2 }}>
                {serverMsg.text}
              </Alert>
            )}

            {/* Form */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                flexGrow: 1,
                overflowY: "auto",
              }}
            >
              {/* Category Dropdown */}
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

              {/* Product Fields */}
              <TextField
                label="Product Name"
                name="product_name"
                fullWidth
                value={formData.product_name}
                onChange={handleChange}
                required
                sx={getGlassTextFieldStyle(isMobile)}
                size={isMobile ? "small" : "medium"}
              />

              <TextField
                label="Original Price"
                name="original_price"
                type="number"
                fullWidth
                value={formData.original_price}
                onChange={handleChange}
                required
                sx={getGlassTextFieldStyle(isMobile)}
                size={isMobile ? "small" : "medium"}
              />

              <TextField
                label="Offer Price"
                name="offer_price"
                type="number"
                fullWidth
                value={formData.offer_price}
                onChange={handleChange}
                required
                sx={getGlassTextFieldStyle(isMobile)}
                size={isMobile ? "small" : "medium"}
              />

              <TextField
                label="Description"
                name="description"
                fullWidth
                multiline
                rows={isMobile ? 2 : 3}
                value={formData.description}
                onChange={handleChange}
                required
                sx={getGlassTextFieldStyle(isMobile)}
                size={isMobile ? "small" : "medium"}
              />

              {/* Upload Images */}
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{
                  color: "#fff",
                  borderColor: "#fff",
                  "&:hover": { borderColor: "#ff9900", color: "#ff9900" },
                  fontSize: isMobile ? "12px" : "14px",
                }}
              >
                Upload Images (3-5 required)
                <input
                  type="file"
                  name="images"
                  hidden
                  accept="image/*"
                  multiple
                  onChange={handleChange}
                  disabled={formData.images.length >= 5}
                />
              </Button>
              {imageError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {imageError}
                </Alert>
              )}

              {/* Upload Video */}
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{
                  color: "#fff",
                  borderColor: "#fff",
                  "&:hover": { borderColor: "#ff9900", color: "#ff9900" },
                  fontSize: isMobile ? "12px" : "14px",
                }}
              >
                Upload Video (Optional)
                <input
                  type="file"
                  name="video"
                  hidden
                  accept="video/*"
                  onChange={handleChange}
                  disabled={formData.video !== null}
                />
              </Button>
              {videoError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {videoError}
                </Alert>
              )}

              {/* Submit */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  fontWeight: "bold",
                  background: "linear-gradient(45deg, #ff6600, #ff9900)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #e65c00, #e68a00)",
                  },
                }}
                disabled={loading}
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

      {/* Preview Dialog */}
      <Dialog
        open={previewDialog.open}
        onClose={() =>
          setPreviewDialog({ open: false, src: "", type: "" })
        }
        maxWidth="md"
        fullScreen={isMobile}
      >
        <Box sx={{ position: "relative", p: isMobile ? 1 : 2 }}>
          <IconButton
            onClick={() =>
              setPreviewDialog({ open: false, src: "", type: "" })
            }
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "rgba(0,0,0,0.5)",
              color: "white",
            }}
          >
            <Close />
          </IconButton>
          {previewDialog.type === "image" ? (
            <img
              src={previewDialog.src}
              alt="preview"
              style={{
                width: "100%",
                height: isMobile ? "auto" : "80vh",
                objectFit: "contain",
              }}
            />
          ) : (
            <video
              src={previewDialog.src}
              controls
              style={{
                width: "100%",
                height: isMobile ? "auto" : "80vh",
                objectFit: "contain",
              }}
            />
          )}
        </Box>
      </Dialog>
    </Box>
  );
}