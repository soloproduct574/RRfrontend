"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
  Paper,
  Divider,
  Chip,
  Grid,
  IconButton,
  Card,
  CardMedia,
  useMediaQuery,
  Tooltip,
  Fade,
  Alert,
  Snackbar,
  Drawer,
  AppBar,
  Toolbar,

} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  CloudUpload as CloudUploadIcon,
  Save as SaveIcon,
  HighlightOff as HighlightOffIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import AdminSidebar from "@/components/dashboards/AdminSideBar";
const BannerForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [form, setForm] = useState({
    title: "",
    runningText: [""],
    redirectUrls: [""],
    bannerFiles: [],
    advertiseFiles: [],
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e, index, field) => {
    if (field === "runningText" || field === "redirectUrls") {
      const updated = [...form[field]];
      updated[index] = e.target.value;
      setForm({ ...form, [field]: updated });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const addField = (field) => setForm({ ...form, [field]: [...form[field], ""] });
  
  const removeField = (field, index) => {
    if (form[field].length > 1) {
      setForm({ ...form, [field]: form[field].filter((_, i) => i !== index) });
    }
  };
  
  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setForm({ ...form, [field]: [...form[field], ...files] });
    }
    e.target.value = null;
  };
  
  const removeFile = (field, index) => {
    const newFiles = [...form[field]];
    const removedFile = newFiles[index];
    
    if (removedFile && 'preview' in removedFile) {
      URL.revokeObjectURL(removedFile.preview);
    }
    
    newFiles.splice(index, 1);
    setForm({ ...form, [field]: newFiles });
  };

  const showNotification = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formData = new FormData();

    // ✅ match backend naming
    formData.append("title", form.title || "");

    const validRunningTexts = form.runningText.filter((t) => t.trim() !== "");
    formData.append("rotating_texts", JSON.stringify(validRunningTexts));

    const validRedirectUrls = form.redirectUrls.filter((u) => u.trim() !== "");
    formData.append("redirect_urls", JSON.stringify(validRedirectUrls));

    // ✅ backend expects "banner_images"
    form.bannerFiles.forEach((file) => {
      formData.append("banner_images", file);  
    });

    // ✅ backend expects "advertise_images"
    form.advertiseFiles.forEach((file) => {
      formData.append("advertise_images", file);
    });

    // Debug logging
    console.log("Sending data to API:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const response = await fetch("https://rrbackend-49lt.onrender.com/api/media/banner", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Upload failed (${response.status}): ${errText}`);
    }

    const data = await response.json();
    console.log("✅ Success:", data);

    showNotification("Banner created successfully!", "success");

    // Reset
    setTimeout(() => {
      setForm({
        title: "",
        runningText: [""],
        redirectUrls: [""],
        bannerFiles: [],
        advertiseFiles: [],
      });
    }, 2000);
  } catch (error) {
    console.error("❌ Upload error:", error);
    showNotification(error.message || "Failed to create banner", "error");
  } finally {
    setLoading(false);
  }
};

  // Alternative: Test connection to API
  const testAPIConnection = async () => {
    try {
      const response = await fetch("https://rrbackend-49lt.onrender.com/api/media/banner", {
        method: "GET",
      });
      
      if (!response.ok) {
        console.error("API test failed with status:", response.status);
        const text = await response.text();
        console.error("Response:", text);
      } else {
        console.log("API connection successful");
        const data = await response.json();
        console.log("API response:", data);
      }
    } catch (error) {
      console.error("API connection error:", error);
    }
  };

  // You can call this in useEffect to test connection on mount
  React.useEffect(() => {
    // Uncomment to test API connection when component mounts
    // testAPIConnection();
  }, []);

  const formHasContent = 
    form.title.trim() !== "" || 
    form.runningText.some(text => text.trim() !== "") ||
    form.redirectUrls.some(url => url.trim() !== "") ||
    form.bannerFiles.length > 0 || 
    form.advertiseFiles.length > 0;

    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
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
            
            <Typography variant="h6" noWrap component="div"               onClick={() => setMobileDrawerOpen(true)}
>
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
      component="main"
      sx={{
        minHeight: "100vh",
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #111827, #0f172a)' 
          : 'linear-gradient(135deg, #f9fafb, #f1f5f9)',
        py: { xs: 4, sm: 6 },
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Container maxWidth="lg">
        {/* Page Title */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.5 }}
        >
          <Typography
           mt={{ xs: 5, md:0 }}
            variant={isSmall ? "h5" : "h4"}
            fontWeight="800"
            align="center"
            gutterBottom
            sx={{ 
              color: theme.palette.mode === 'dark' ? '#f3f4f6' : '#111827',
              mb: 4,
              textShadow: "0 2px 10px rgba(0,0,0,0.08)",
              letterSpacing: "-0.5px"
            }}
          >
            <Box component="span" sx={{ position: "relative" }}>
              Create New Banner
              <Box 
                component="span" 
                sx={{ 
                  position: "absolute",
                  bottom: "-4px",
                  left: 0,
                  width: "100%",
                  height: "8px",
                  background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                  borderRadius: "4px",
                  opacity: 0.3,
                  zIndex: -1
                }}
              />
            </Box>
          </Typography>
        </motion.div>

        {/* Main Form */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 2.5, sm: 4 }, 
              borderRadius: 4, 
              background: theme.palette.background.paper,
              boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
              overflow: "hidden",
              position: "relative",
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)'
              }
            }}
            component="form"
            onSubmit={handleSubmit}
          >
            {/* Title */}
            <TextField
              label="Banner Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              fullWidth
              placeholder="Enter a descriptive title for your banner"
              variant="outlined"
              sx={{ 
                mb: 4,
                '& .MuiOutlinedInput-root': { 
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  }
                }
              }}
            />

            {/* Running Texts */}
            <Divider sx={{ my: 4 }}>
              <Chip 
                icon={<motion.div animate={{ rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>🏃</motion.div>}
                label="Running Texts" 
                color="primary" 
                sx={{ fontWeight: 600, px: 2 }}
              />
            </Divider>
            
            {form.runningText.map((text, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <TextField
                    label={`Running Text ${i + 1}`}
                    value={text}
                    onChange={(e) => handleChange(e, i, "runningText")}
                    fullWidth
                    placeholder="Text that will scroll on your banner"
                    size={isSmall ? "small" : "medium"}
                  />
                  <Tooltip title="Remove">
                    <IconButton 
                      onClick={() => removeField("runningText", i)} 
                      disabled={form.runningText.length <= 1}
                      sx={{ 
                        ml: 1, 
                        color: "error.main",
                        opacity: form.runningText.length <= 1 ? 0.5 : 1
                      }}
                      size={isSmall ? "small" : "medium"}
                    >
                      <HighlightOffIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </motion.div>
            ))}
            
            <Button 
              startIcon={<AddIcon />} 
              onClick={() => addField("runningText")} 
              sx={{ 
                mt: 1, 
                mb: 2,
                borderRadius: 2,
                textTransform: "none"
              }}
              variant="outlined"
              size={isSmall ? "small" : "medium"}
            >
              Add Another Text
            </Button>

            {/* Redirect URLs */}
            <Divider sx={{ my: 4 }}>
              <Chip 
                icon={<span>🔗</span>}
                label="Redirect URLs" 
                color="secondary" 
                sx={{ fontWeight: 600, px: 2 }}
              />
            </Divider>
            
            {form.redirectUrls.map((url, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <TextField
                    label={`URL ${i + 1}`}
                    value={url}
                    onChange={(e) => handleChange(e, i, "redirectUrls")}
                    fullWidth
                    placeholder="https://example.com"
                    size={isSmall ? "small" : "medium"}
                  />
                  <Tooltip title="Remove">
                    <IconButton 
                      onClick={() => removeField("redirectUrls", i)} 
                      disabled={form.redirectUrls.length <= 1}
                      sx={{ 
                        ml: 1, 
                        color: "error.main",
                        opacity: form.redirectUrls.length <= 1 ? 0.5 : 1
                      }}
                      size={isSmall ? "small" : "medium"}
                    >
                      <HighlightOffIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </motion.div>
            ))}
            
            <Button 
              startIcon={<AddIcon />} 
              onClick={() => addField("redirectUrls")} 
              sx={{ 
                mt: 1, 
                mb: 2,
                borderRadius: 2,
                textTransform: "none"
              }}
              variant="outlined"
              color="secondary"
              size={isSmall ? "small" : "medium"}
            >
              Add Another URL
            </Button>

            {/* Banner Images */}
            <Divider sx={{ my: 4 }}>
              <Chip 
                icon={<span>🖼️</span>}
                label="Banner Images" 
                color="info" 
                sx={{ fontWeight: 600, px: 2 }}
              />
            </Divider>
            
            <Box sx={{ 
              mb: 3, 
              p: 3, 
              border: '2px dashed',
              borderColor: 'info.main',
              borderRadius: 2,
              backgroundColor: 'action.hover',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'action.selected',
              }
            }}
            // component="label"
            >
              <input
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={(e) => handleFileChange(e, "bannerFiles")}
              />
              <CloudUploadIcon color="info" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Upload Banner Images
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Click or drop files here
              </Typography>
            </Box>
            
            {form.bannerFiles.length > 0 && (
              <Grid container spacing={2}>
                {form.bannerFiles.map((file, i) => (
                  <Grid item xs={6} sm={4} md={3} key={i}>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card sx={{ 
                        borderRadius: 2, 
                        overflow: "hidden", 
                        position: "relative", 
                        height: 140,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)" 
                      }}>
                        <CardMedia 
                          component="img" 
                          image={URL.createObjectURL(file)} 
                          alt={`banner-${i}`} 
                          sx={{ height: "100%", objectFit: "cover" }}
                        />
                        <Tooltip title="Remove">
                          <IconButton
                            onClick={() => removeFile("bannerFiles", i)}
                            size="small"
                            sx={{ 
                              position: "absolute", 
                              top: 8, 
                              right: 8, 
                              bgcolor: "rgba(255,255,255,0.9)",
                              '&:hover': {
                                bgcolor: "rgba(255,255,255,1)",
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" color="error" />
                          </IconButton>
                        </Tooltip>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Advertise Images */}
            <Divider sx={{ my: 4 }}>
              <Chip 
                icon={<span>📢</span>}
                label="Advertise Images" 
                color="warning" 
                sx={{ fontWeight: 600, px: 2 }}
              />
            </Divider>
            
            <Box sx={{ 
              mb: 3, 
              p: 3, 
              border: '2px dashed',
              borderColor: 'warning.main',
              borderRadius: 2,
              backgroundColor: 'action.hover',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'action.selected',
              }
            }}
            // component="label"
            >
              <input
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={(e) => handleFileChange(e, "advertiseFiles")}
              />
              <CloudUploadIcon color="warning" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Upload Advertise Images
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Click or drop files here
              </Typography>
            </Box>
            
            {form.advertiseFiles.length > 0 && (
              <Grid container spacing={2}>
                {form.advertiseFiles.map((file, i) => (
                  <Grid item xs={6} sm={4} md={3} key={i}>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card sx={{ 
                        borderRadius: 2, 
                        overflow: "hidden", 
                        position: "relative", 
                        height: 140,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)" 
                      }}>
                        <CardMedia 
                          component="img" 
                          image={URL.createObjectURL(file)} 
                          alt={`advertise-${i}`} 
                          sx={{ height: "100%", objectFit: "cover" }}
                        />
                        <Tooltip title="Remove">
                          <IconButton
                            onClick={() => removeFile("advertiseFiles", i)}
                            size="small"
                            sx={{ 
                              position: "absolute", 
                              top: 8, 
                              right: 8, 
                              bgcolor: "rgba(255,255,255,0.9)",
                              '&:hover': {
                                bgcolor: "rgba(255,255,255,1)",
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" color="error" />
                          </IconButton>
                        </Tooltip>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Submit Button */}
            <Box sx={{ mt: 5 }}>
              <Fade in={true}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading || !formHasContent}
                  sx={{
                    py: isSmall ? 1.2 : 1.8,
                    borderRadius: 3,
                    fontSize: isSmall ? "15px" : "17px",
                    fontWeight: "bold",
                    textTransform: "none",
                    boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)",
                    background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                    '&:hover': {
                      background: "linear-gradient(90deg, #2563eb, #7c3aed)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                  startIcon={loading ? undefined : <SaveIcon />}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Save Banner"
                  )}
                </Button>
              </Fade>
              <Typography variant="caption" color="text.secondary" align="center" sx={{ display: "block", mt: 2 }}>
                All fields are saved automatically. You can revisit this form anytime.
              </Typography>
            </Box>
          </Paper>
        </motion.div>

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity} 
            sx={{ width: "100%" }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
    </Box>
    </>
  );
};

export default BannerForm;
