"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Provider, useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Avatar,
  Container,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
  useTheme,
  useMediaQuery,
  Drawer,
  AppBar,
  Toolbar, 

} from "@mui/material";
import { Edit, Delete, Add, CloudUpload, Refresh,Menu } from "@mui/icons-material";
import categoryReducer, {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "@/Redux/Slice/CategoryFileMakeSlice";
import AdminSidebar from "@/components/dashboards/AdminSideBar";

// --- Theme ---
const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
  },
  shape: { borderRadius: 10 },
});

// --- Redux Store ---
const store = configureStore({
  reducer: {
    categories: categoryReducer,
  },
});

// --- Category Form ---
const CategoryForm = ({ category, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    category_name: "",
    description: "",
    category_image: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize form when editing or creating
  useEffect(() => {
    if (category) {
      setFormData({
        category_name: category.category_name || "",
        description: category.description || "",
        category_image: null,
      });
      if (category.category_images?.length > 0) {
        setImagePreview(category.category_images[0]);
      }
    } else {
      setFormData({ category_name: "", description: "", category_image: null });
      setImagePreview("");
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, category_image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("category_name", formData.category_name);
      data.append("description", formData.description);
      if (formData.category_image) {
        data.append("category_images", formData.category_image);
      }

      if (category) {
        await dispatch(updateCategory({ id: category._id, formData: data })).unwrap();
      } else {
        await dispatch(createCategory(data)).unwrap();
      }

      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {/* Image Upload */}
        <Grid item xs={12} sm={5}>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUpload />}
              fullWidth
            >
              Upload Image
              <input type="file" hidden accept="image/*" onChange={handleImage} />
            </Button>
            {imagePreview && (
              <Avatar
                src={imagePreview}
                alt="Preview"
                variant="rounded"
                sx={{
                  width: "100%",
                  height: 200,
                }}
              />
            )}
          </Box>
        </Grid>

        {/* Category Fields */}
        <Grid item xs={12} sm={7}>
          <TextField
            fullWidth
            label="Category Name"
            name="category_name"
            value={formData.category_name}
            onChange={handleChange}
            required
            margin="normal"
          />
          
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading || !formData.category_name.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {category ? "Update Category" : "Create Category"}
        </Button>
      </Box>
    </Box>
  );
};

// --- Category List ---
const CategoryList = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.categories);
  const [openForm, setOpenForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: "" });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  useEffect(() => {
    if (status === "idle") dispatch(fetchCategories());
  }, [status, dispatch]);

  const handleEdit = (category) => {
    setEditingCategory(category);
    setOpenForm(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setOpenForm(true);
  };

  const handleDelete = (category) => {
    setDeleteDialog({ open: true, id: category._id, name: category.category_name });
  };

  const confirmDelete = async () => {
    await dispatch(deleteCategory(deleteDialog.id)).unwrap();
    setDeleteDialog({ open: false, id: null, name: "" });
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingCategory(null);
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
    <Box sx={{ p: { xs: 1, sm: 3 }, flex: 1, ml: isMobile ? 0 : isTablet ? '200px' : '257px', mt: isMobile ? 7 : 0 }}>
      {/* Header */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        mb={3}
        gap={2}
      >
        <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 600 }}>
          🏷️ Manage Categories
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            onClick={() => dispatch(fetchCategories())}
            variant="outlined"
            startIcon={<Refresh/>}
            sx={{ whiteSpace: "nowrap",backgroundColor:"#6df338ff",'&:hover':{backgroundColor:"#00e626ff"},color:"black" }}
            disabled={status === "loading"}
          >
            Refresh
          </Button>
          <Button
            onClick={handleAdd}
            variant="contained"
            startIcon={<Add />}
            disabled={status === "loading"}
            sx={{ whiteSpace: "nowrap",backgroundColor:"#ff6600",'&:hover':{backgroundColor:"#e65c00"}}}
          >
            Add Category
          </Button>
        </Box>
      </Box>

      {/* Show errors */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {status === "loading" && items.length === 0 && (
        <Box textAlign="center" my={5}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading categories...</Typography>
        </Box>
      )}

      {/* Grid with Image Cards */}
      <Grid container spacing={3}>
        {items.map((cat) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={cat._id}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                overflow: "hidden",
                transition: "all 0.3s ease-in-out",
                ":hover": { transform: "translateY(-4px)", boxShadow: 6 },
              }}
            >
              <Box sx={{ position: "relative", width: 300, height: 220 }}>
                {cat.category_images?.length > 0 ? (
                  <Image
                    src={cat.category_images[0]}
                    alt={cat.category_name}
                    fill
                    style={{
                      objectFit: "contain",
                    }}
                    sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "180px",
                      backgroundColor: "#f5f5f5",
                      color: "#aaa",
                    }}
                  >
                    No Image
                  </Box>
                )}
              </Box>

              <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}  >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "black" }}
                >
                  {cat.category_name}
                </Typography>

                <Box gap={1}>
                  <IconButton color="primary" onClick={() => handleEdit(cat)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(cat)}>
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {items.length === 0 && status === "succeeded" && (
        <Box textAlign="center" mt={6}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No categories found 😔
          </Typography>
          <Button variant="contained" onClick={handleAdd} startIcon={<Add />}>
            Add your first category
          </Button>
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="md">
        <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
        <DialogContent>
          <CategoryForm category={editingCategory} onClose={handleCloseForm} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null, name: "" })}
      >
        <DialogTitle sx={{ color: "error.main" }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete “{deleteDialog.name}”? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false })}>Cancel</Button>
          <Button color="error" variant="contained" startIcon={<Delete />} onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </Box>
  );
};

// --- Main Page Wrapper ---
export default function ManageCategoriesPage() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <CategoryList />
        </Container>
      </ThemeProvider>
    </Provider>
  );
}
