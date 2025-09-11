"use client";

import { useState } from "react";
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
} from "@mui/material";
import { Close } from "@mui/icons-material";
import axios from "axios";
import AdminSidebar from "@/components/dashboards/AdminSideBar";

const glassTextFieldStyle = {
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
};

export default function ProductRegisterPage() {
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState(null);
  const [imageError, setImageError] = useState("");

  const [formData, setFormData] = useState({
    product_name: "",
    description: "",
    original_price: "",
    offer_price: "",
    categories: "",
    brands: "",
    images: [],
    videos: [],
  });

  const [previewDialog, setPreviewDialog] = useState({
    open: false,
    src: "",
    type: "",
  });

  const handleChange = (e) => {
    const { name, files } = e.target;
    if (files && name === "images") {
      const newFiles = Array.from(files);
      
      // Check if adding these files would exceed the maximum
      if (formData.images.length + newFiles.length > 5) {
        setImageError("Maximum 5 images allowed");
        return;
      }
      
      setImageError(""); // Clear any previous error
      
      const updated = newFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));

      setFormData((prev) => ({
        ...prev,
        [name]: [...prev[name], ...updated],
      }));
    } else if (files) {
      // For videos or other file types
      const newFiles = Array.from(files);
      const updated = newFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));

      setFormData((prev) => ({
        ...prev,
        [name]: [...prev[name], ...updated],
      }));
    }
  };

  const removeFile = (name, index) => {
    setFormData((prev) => {
      const updated = [...prev[name]];
      updated.splice(index, 1);
      return { ...prev, [name]: updated };
    });
    
    // Clear image error when removing images
    if (name === "images") {
      setImageError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setServerMsg(null);

    // Validate images before submitting
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

      // ✅ Convert categories input (comma-separated) → [{ name: "..." }]
      if (formData.categories.trim()) {
        const categoriesArray = formData.categories
          .split(",")
          .map((c) => ({ name: c.trim() }));
        formDataToSend.append("categories", JSON.stringify(categoriesArray));
      } else {
        formDataToSend.append("categories", "[]");
      }

      // ✅ Convert brands input (comma-separated) → [{ name: "..." }]
      if (formData.brands.trim()) {
        const brandsArray = formData.brands
          .split(",")
          .map((b) => ({ name: b.trim() }));
        formDataToSend.append("brands", JSON.stringify(brandsArray));
      } else {
        formDataToSend.append("brands", "[]");
      }

      // Files
      formData.images.forEach((img) => {
        formDataToSend.append("images", img.file);
      });
      formData.videos.forEach((vid) => {
        formDataToSend.append("videos", vid.file);
      });

      await axios.post("http://localhost:5000/api/products/", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setServerMsg({
        type: "success",
        text: "✅ Product registered successfully!",
      });

      setFormData({
        product_name: "",
        description: "",
        original_price: "",
        offer_price: "",
        categories: "",
        brands: "",
        images: [],
        videos: [],
      });
      setImageError("");
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
      <Box sx={{ width: 240, flexShrink: 0 }}>
        <AdminSidebar />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          backgroundImage: "url('/manageproductbg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
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
            WebkitBackdropFilter: "blur(6px)",
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="sm" sx={{ position: "relative", zIndex: 2 }}>
          <Paper
            elevation={4}
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              align="center"
              sx={{ color: "black" }}
            >
              Add Your Product
            </Typography>

            {serverMsg && (
              <Alert 
                severity={serverMsg.type}
                sx={{ mb: 2 }}
              >
                {serverMsg.text}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              {/* Input Fields */}
              <TextField label="Product Name" name="product_name" fullWidth value={formData.product_name} onChange={(e) => setFormData({ ...formData, product_name: e.target.value })} required sx={glassTextFieldStyle} />
              <TextField label="Description" name="description" fullWidth multiline rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required sx={glassTextFieldStyle} />
              <TextField label="Original Price" name="original_price" type="number" fullWidth value={formData.original_price} onChange={(e) => setFormData({ ...formData, original_price: e.target.value })} required sx={glassTextFieldStyle} />
              <TextField label="Offer Price" name="offer_price" type="number" fullWidth value={formData.offer_price} onChange={(e) => setFormData({ ...formData, offer_price: e.target.value })} required sx={glassTextFieldStyle} />
              <TextField
                label="Categories"
                placeholder="e.g. Electronics, Smartphones"
                name="categories"
                fullWidth
                value={formData.categories}
                onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                sx={glassTextFieldStyle}
              />
              <TextField
                label="Brands"
                name="brands"
                fullWidth
                value={formData.brands}
                onChange={(e) => setFormData({ ...formData, brands: e.target.value })}
                sx={glassTextFieldStyle}
              />

              {/* Upload Images */}
              <Button variant="outlined" component="label" fullWidth sx={{ color: "#fff", borderColor: "#fff", "&:hover": { borderColor: "#ff9900", color: "#ff9900" } }}>
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

              {/* Image Preview Bar */}
              {formData.images.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" sx={{ color: "white", mb: 1 }}>
                    Images: {formData.images.length}/5
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    {formData.images.map((img, index) => (
                      <Box key={index} sx={{ position: "relative" }}>
                        <img
                          src={img.url}
                          alt="preview"
                          style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8, cursor: "pointer" }}
                          onClick={() => setPreviewDialog({ open: true, src: img.url, type: "image" })}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeFile("images", index)}
                          sx={{ position: "absolute", top: 0, right: 0, background: "rgba(0,0,0,0.5)", color: "white" }}
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Upload Videos */}
              <Button variant="outlined" component="label" fullWidth sx={{ color: "#fff", borderColor: "#fff", "&:hover": { borderColor: "#ff9900", color: "#ff9900" } }}>
                Upload Videos
                <input type="file" name="videos" hidden accept="video/*" multiple onChange={handleChange} />
              </Button>

              {/* Video Preview Bar */}
              {formData.videos.length > 0 && (
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}>
                  {formData.videos.map((vid, index) => (
                    <Box key={index} sx={{ position: "relative" }}>
                      <video
                        src={vid.url}
                        style={{ width: 120, height: 100, objectFit: "cover", borderRadius: 8, cursor: "pointer" }}
                        onClick={() => setPreviewDialog({ open: true, src: vid.url, type: "video" })}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeFile("videos", index)}
                        sx={{ position: "absolute", top: 0, right: 0, background: "rgba(0,0,0,0.5)", color: "white" }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Submit */}
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, py: 1.5, borderRadius: 2, fontWeight: "bold", textTransform: "none", background: "linear-gradient(45deg, #ff6600, #ff9900)", "&:hover": { background: "linear-gradient(45deg, #e65c00, #e68a00)" } }} disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : "Add Product"}
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Preview Dialog */}
      <Dialog open={previewDialog.open} onClose={() => setPreviewDialog({ open: false, src: "", type: "" })} maxWidth="md">
        <Box sx={{ position: "relative", p: 2 }}>
          <IconButton onClick={() => setPreviewDialog({ open: false, src: "", type: "" })} sx={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.5)", color: "white" }}>
            <Close />
          </IconButton>
          {previewDialog.type === "image" ? (
            <img src={previewDialog.src} alt="preview" style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: 8 }} />
          ) : (
            <video src={previewDialog.src} controls style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: 8 }} />
          )}
        </Box>
      </Dialog>
    </Box>
  );
}