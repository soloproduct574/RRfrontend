"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
  IconButton,
  Grid,
  Card,
  CardMedia,
  Container,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Menu,
  Drawer,
  CircularProgress
} from "@mui/material";
import AdminSidebar from "@/components/dashboards/AdminSideBar";
import {
  Delete,
  Add,
  Upload,
  YouTube,
  TextFields,
  Image,
  Campaign,
} from "@mui/icons-material";

export default function BannerForm() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    rotating_texts: [""],
    redirect_urls: [""],
  });

  const [bannerFiles, setBannerFiles] = useState([]);
  const [advertiseFiles, setAdvertiseFiles] = useState([]);
  const [previewBanners, setPreviewBanners] = useState([]);
  const [previewAds, setPreviewAds] = useState([]);

  const [message, setMessage] = useState({ text: "", type: "" });
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRotatingChange = (index, value) => {
    const texts = [...form.rotating_texts];
    texts[index] = value;
    setForm({ ...form, rotating_texts: texts });
  };

  const addRotatingText = () => {
    setForm({ ...form, rotating_texts: [...form.rotating_texts, ""] });
  };

  const removeRotatingText = (index) => {
    setForm({
      ...form,
      rotating_texts: form.rotating_texts.filter((_, i) => i !== index),
    });
  };

  const handleUrlChange = (index, value) => {
    const urls = [...form.redirect_urls];
    urls[index] = value;
    setForm({ ...form, redirect_urls: urls });
  };

  const addRedirectUrl = () => {
    setForm({ ...form, redirect_urls: [...form.redirect_urls, ""] });
  };

  const removeRedirectUrl = (index) => {
    setForm({
      ...form,
      redirect_urls: form.redirect_urls.filter((_, i) => i !== index),
    });
  };

  const handleBannerFilesChange = (e) => {
    const files = Array.from(e.target.files);
    const combined = [...bannerFiles, ...files];
    setBannerFiles(combined);
    setPreviewBanners(combined.map((file) => URL.createObjectURL(file)));
  };

  const removeBannerFile = (index) => {
    const updated = bannerFiles.filter((_, i) => i !== index);
    setBannerFiles(updated);
    setPreviewBanners(updated.map((file) => URL.createObjectURL(file)));
  };

  const handleAdvertiseFilesChange = (e) => {
    const files = Array.from(e.target.files);
    const combined = [...advertiseFiles, ...files];
    setAdvertiseFiles(combined);
    setPreviewAds(combined.map((file) => URL.createObjectURL(file)));
  };

  const removeAdvertiseFile = (index) => {
    const updated = advertiseFiles.filter((_, i) => i !== index);
    setAdvertiseFiles(updated);
    setPreviewAds(updated.map((file) => URL.createObjectURL(file)));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("title", form.title);

    // ✅ Send arrays as JSON strings
    formData.append("rotating_texts", JSON.stringify(form.rotating_texts));
    formData.append("redirect_urls", JSON.stringify(form.redirect_urls));

    // ✅ Append files
    bannerFiles.forEach((file) => formData.append("banner_images", file));
    advertiseFiles.forEach((file) => formData.append("advertise_images", file));

    const res = await fetch("https://rrbackend-49lt.onrender.com/api/media/banner", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok && data.success) {
      setMessage({ text: "✅ Banner created successfully!", type: "success" });
      // Reset form
      setForm({ title: "", rotating_texts: [""], redirect_urls: [""] });
      setBannerFiles([]);
      setAdvertiseFiles([]);
      setPreviewBanners([]);
      setPreviewAds([]);
    } else {
      setMessage({ text: `❌ ${data.message || "Something went wrong"}`, type: "error" });
    }
  } catch (error) {
    console.error(error);
    setMessage({ text: "❌ Server error, please try again.", type: "error" });
  }

  // ✅ Show Snackbar after async is fully resolved
  setOpen(true);

  setLoading(false);
};


  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        {isMobile && (
        <AppBar position="fixed" sx={{ backgroundColor: 'rgba(255, 0, 0, 0.7)', backdropFilter: 'blur(10px)' }}>
          <Toolbar>
            <IconButton
              color="black"
              aria-label="open drawer"
              edge="start"
              sx={{ mr: 2 }}
            >
              <Menu />
            </IconButton>
            <Typography variant="h6" noWrap component="div"               onClick={() => setMobileDrawerOpen(true)}
>
              Admin Panel
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Mobile Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileDrawerOpen : true}
        onClose={() => setMobileDrawerOpen(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: isMobile ? 240 : (isTablet ? 200 : 250),
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
              height: '100vh',          // full height
    overflow: isMobile ? 'auto' : 'hidden', // allow scroll only on mobile
    position: 'fixed',
          },
        }}
      >
        <AdminSidebar onLogout={() => setMobileDrawerOpen(false)} />
      </Drawer>
      
      <Box sx={{ flexGrow: 1, p: isMobile ? 2 : 3, ml: isMobile ? 0 : "280px" }}>
        <Container maxWidth="lg" sx={{ p: 0 }}>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            fontWeight="700"
            gutterBottom
            sx={{ 
              color: "#1e293b",
              mb: 3,
            }}
          >
            Create New Banner
          </Typography>
          
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 4 },
              borderRadius: 3,
              background: "white",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            }}
          >
            <Box component="form" onSubmit={handleSubmit} noValidate encType="multipart/form-data">
              {/* Title Field */}
              <TextField
                label="Banner Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                variant="outlined"
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  }
                }}
              />

              <Grid container spacing={3}>
                {/* Rotating Texts Section */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    p: 3, 
                    borderRadius: 2, 
                    backgroundColor: "#f8fafc",
                    height: "100%",
                    border: "1px solid #e2e8f0"
                  }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <TextFields sx={{ mr: 1, color: "#475569" }} />
                      <Typography variant="h6" fontWeight="600" color="#1e293b">
                        Rotating Texts
                      </Typography>
                    </Box>
                    
                    {form.rotating_texts.map((text, idx) => (
                      <Box
                        key={idx}
                        display="flex"
                        alignItems="center"
                        gap={1}
                        mt={idx > 0 ? 2 : 0}
                      >
                        <TextField
                          label={`Text ${idx + 1}`}
                          value={text}
                          onChange={(e) => handleRotatingChange(idx, e.target.value)}
                          fullWidth
                          size="small"
                        />
                        {idx > 0 && (
                          <IconButton 
                            onClick={() => removeRotatingText(idx)}
                            size="small"
                            sx={{ color: "#ef4444" }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    ))}
                    
                    <Button 
                      onClick={addRotatingText} 
                      startIcon={<Add />}
                      sx={{ mt: 2, color: "#475569" }}
                      size="small"
                    >
                      Add Text
                    </Button>
                  </Box>
                </Grid>

                {/* Redirect URLs Section */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    p: 3, 
                    borderRadius: 2, 
                    backgroundColor: "#f8fafc",
                    height: "100%",
                    border: "1px solid #e2e8f0"
                  }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <YouTube sx={{ mr: 1, color: "#475569" }} />
                      <Typography variant="h6" fontWeight="600" color="#1e293b">
                        YouTube Links
                      </Typography>
                    </Box>
                    
                    {form.redirect_urls.map((url, idx) => (
                      <Box
                        key={idx}
                        display="flex"
                        alignItems="center"
                        gap={1}
                        mt={idx > 0 ? 2 : 0}
                      >
                        <TextField
                          label={`URL ${idx + 1}`}
                          value={url}
                          onChange={(e) => handleUrlChange(idx, e.target.value)}
                          fullWidth
                          size="small"
                        />
                        {idx > 0 && (
                          <IconButton 
                            onClick={() => removeRedirectUrl(idx)}
                            size="small"
                            sx={{ color: "#ef4444" }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    ))}
                    
                    <Button 
                      onClick={addRedirectUrl} 
                      startIcon={<Add />}
                      sx={{ mt: 2, color: "#475569" }}
                      size="small"
                    >
                      Add URL
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 4, borderColor: "#e2e8f0" }} />

              {/* Banner Images Section */}
              <Box sx={{ mb: 4 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Image sx={{ mr: 1, color: "#475569" }} />
                  <Typography variant="h6" fontWeight="600" color="#1e293b">
                    Banner Images
                  </Typography>
                  <Chip 
                    label={`${bannerFiles.length} uploaded`} 
                    size="small" 
                    sx={{ 
                      ml: 2, 
                      backgroundColor: "#f1f5f9",
                      color: "#475569"
                    }}
                  />
                </Box>
                
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<Upload />}
                  sx={{ 
                    mb: 2, 
                    color: "#475569",
                    borderColor: "#cbd5e1",
                    '&:hover': {
                      borderColor: "#94a3b8",
                      backgroundColor: "#f8fafc"
                    }
                  }}
                >
                  Upload Banner Images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleBannerFilesChange}
                    hidden
                  />
                </Button>
                
                <Grid container spacing={2} mt={1}>
                  {previewBanners.map((src, i) => (
                    <Grid key={i} item xs={6} sm={4} md={3} lg={2.4}>
                      <Card 
                        sx={{ 
                          borderRadius: 2, 
                          overflow: 'hidden',
                          position: 'relative',
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                          height: 140
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="140"
                          image={src}
                          alt="banner preview"
                          sx={{ 
                            objectFit: "cover",
                            width: "100%",
                            height: "100%"
                          }}
                        />
                        <IconButton
                          onClick={() => removeBannerFile(i)}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            backgroundColor: "white",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            "&:hover": {
                              backgroundColor: "white",
                            }
                          }}
                        >
                          <Delete fontSize="small" sx={{ color: "#475569" }} />
                        </IconButton>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Advertise Images Section */}
              <Box sx={{ mb: 4 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Campaign sx={{ mr: 1, color: "#475569" }} />
                  <Typography variant="h6" fontWeight="600" color="#1e293b">
                    Advertise Images
                  </Typography>
                  <Chip 
                    label={`${advertiseFiles.length} uploaded`} 
                    size="small" 
                    sx={{ 
                      ml: 2, 
                      backgroundColor: "#f1f5f9",
                      color: "#475569"
                    }}
                  />
                </Box>
                
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<Upload />}
                  sx={{ 
                    mb: 2, 
                    color: "#475569",
                    borderColor: "#cbd5e1",
                    '&:hover': {
                      borderColor: "#94a3b8",
                      backgroundColor: "#f8fafc"
                    }
                  }}
                >
                  Upload Ad Images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleAdvertiseFilesChange}
                    hidden
                  />
                </Button>
                
                <Grid container spacing={2} mt={1}>
                  {previewAds.map((src, i) => (
                    <Grid key={i} item xs={6} sm={4} md={3} lg={2.4}>
                      <Card 
                        sx={{ 
                          borderRadius: 2, 
                          overflow: 'hidden',
                          position: 'relative',
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                          height: 140
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="140"
                          image={src}
                          alt="advertise preview"
                          sx={{ 
                            objectFit: "cover",
                            width: "100%",
                            height: "100%"
                          }}
                        />
                        <IconButton
                          onClick={() => removeAdvertiseFile(i)}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            backgroundColor: "white",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            "&:hover": {
                              backgroundColor: "white",
                            }
                          }}
                        >
                          <Delete fontSize="small" sx={{ color: "#475569" }} />
                        </IconButton>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{ 
                  mt: 2, 
                  py: 1.5, 
                  borderRadius: 2,
                  fontSize: "16px", 
                  fontWeight: "bold",
                  backgroundColor: "#1e293b",
                  '&:hover': {
                    backgroundColor: "#334155",
                  }
                }}
              >
                {loading?(
                  <CircularProgress size={24} color="inherit" />
                ):(
                  "SAVE"
                )}
              </Button>
            </Box>
          </Paper>
        </Container>

        {/* Snackbar */}
        <Snackbar
          open={open}
          autoHideDuration={4000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleClose}
            severity={message.type || "info"}
            sx={{ 
              width: "100%", 
              borderRadius: 2,
              backgroundColor: message.type === "success" ? "#f0fdf4" : "#fef2f2",
              color: message.type === "success" ? "#166534" : "#991b1b"
            }}
          >
            {message.text}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}