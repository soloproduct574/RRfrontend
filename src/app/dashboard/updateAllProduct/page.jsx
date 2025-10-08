"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct, updateProduct } from '@/redux/slice/DashboardProductHandle';
import { 
  Box, 
  Typography, 
  Paper, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Avatar,
  Chip,
  Stack,
  Container,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Grid,
  Divider,
  Card,
  CardMedia,
  CardContent,
  Tab,
  Tabs,
  Snackbar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
  Drawer,
  Menu

} from '@mui/material';
import { 
  Edit, 
  Delete, 
  Search, 
  Category, 
  BrandingWatermark, 
  Close, 
  Save,
  Image as ImageIcon,
  Videocam,
  CloudUpload,
  HighlightOff
} from '@mui/icons-material';
import AdminSidebar from '@/components/dashboards/AdminSideBar';

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.dashboardProduct);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  // State management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 5 : 10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  // Refs for file uploads
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    product_name: '',
    description: '',
    original_price: 0,
    offer_price: 0,
    percentage_discount: 0,
    product_images: [],
    product_videos: [],
    categories: '',
    brands: '',
    newImages: [],
    newVideos: [],
    removedImages: [],
    removedVideos: []
  });
  
  // Initial data loading
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Update rowsPerPage when screen size changes
  useEffect(() => {
    setRowsPerPage(isMobile ? 5 : 10);
  }, [isMobile]);

  // Event handlers - memoized for better performance
  const handleDelete = useCallback((id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id))
        .unwrap()
        .then(() => {
          showSnackbar('Product deleted successfully', 'success');
        })
        .catch((err) => {
          showSnackbar(`Failed to delete product: ${err.toString()}`, 'error');
        });
    }
  }, [dispatch]);

  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  }, []);

  const handleChangeTab = useCallback((event, newValue) => {
    setTabValue(newValue);
  }, []);

  const handleOpenEditDialog = useCallback((product) => {
    setSelectedProduct(product);
    setFormData({
      product_name: product.product_name || '',
      description: product.description || '',
      original_price: product.original_price || 0,
      offer_price: product.offer_price || 0,
      percentage_discount: product.percentage_discount || 0,
      product_images: product.product_images || [],
      product_videos: product.product_videos || [],
      categories: product.categories.map(cat => cat.name).join(', ') || '',
      // brands: product.brands.map(brand => brand.name).join(', ') || '',
      newImages: [],
      newVideos: [],
      removedImages: [],
      removedVideos: []
    });
    setOpenDialog(true);
    setTabValue(0);
  }, []);

  const handleCloseEditDialog = useCallback(() => {
    // Clean up any object URLs to prevent memory leaks
    formData.newImages.forEach(img => {
      if (img.preview) URL.revokeObjectURL(img.preview);
    });
    
    setOpenDialog(false);
    setSelectedProduct(null);
    setFormData({
      product_name: '',
      description: '',
      original_price: 0,
      offer_price: 0,
      percentage_discount: 0,
      product_images: [],
      product_videos: [],
      categories: '',
      brands: '',
      newImages: [],
      newVideos: [],
      removedImages: [],
      removedVideos: []
    });
  }, [formData.newImages]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  }, []);

  const handleImageUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    // Preview images with optimized creation
    const newImageFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    
    setFormData(prevData => ({
      ...prevData,
      newImages: [...prevData.newImages, ...newImageFiles]
    }));
    
    // Reset input
    e.target.value = null;
  }, []);

  const handleVideoUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    // Preview videos
    const newVideoFiles = files.map(file => ({
      file,
      name: file.name,
      type: file.type,
      size: (file.size / (1024 * 1024)).toFixed(2)
    }));
    
    setFormData(prevData => ({
      ...prevData,
      newVideos: [...prevData.newVideos, ...newVideoFiles]
    }));
    
    // Reset input
    e.target.value = null;
  }, []);

  const handleRemoveImage = useCallback((index, type) => {
    if (type === 'existing') {
      setFormData(prevData => ({
        ...prevData,
        removedImages: [...prevData.removedImages, index]
      }));
    } else {
      setFormData(prevData => {
        const updatedNewImages = [...prevData.newImages];
        URL.revokeObjectURL(updatedNewImages[index].preview);
        updatedNewImages.splice(index, 1);
        return { 
          ...prevData, 
          newImages: updatedNewImages 
        };
      });
    }
  }, []);

  const handleRemoveVideo = useCallback((index, type) => {
    if (type === 'existing') {
      setFormData(prevData => ({
        ...prevData,
        removedVideos: [...prevData.removedVideos, index]
      }));
    } else {
      setFormData(prevData => {
        const updatedNewVideos = [...prevData.newVideos];
        updatedNewVideos.splice(index, 1);
        return { 
          ...prevData, 
          newVideos: updatedNewVideos 
        };
      });
    }
  }, []);

  const handleUpdateResult = useCallback((result) => {
    if (result && result.success) {
      showSnackbar('Product updated successfully', 'success');
      handleCloseEditDialog();
      dispatch(fetchProducts());
    } else {
      const errorMessage = result?.message || 'Update failed';
      showSnackbar(`Failed to update: ${errorMessage}`, 'error');
    }
  }, [dispatch, handleCloseEditDialog, showSnackbar]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setEditLoading(true);
    
    try {
      // Filter out removed images and videos
      const filteredImages = formData.product_images.filter(
        (_, index) => !formData.removedImages.includes(index)
      );
      
      const filteredVideos = formData.product_videos.filter(
        (_, index) => !formData.removedVideos.includes(index)
      );
      
      // Format categories and brands
      const formattedCategories = formData.categories
        .split(',')
        .filter(cat => cat.trim() !== '')
        .map(cat => ({ name: cat.trim() }));
        
      // const formattedBrands = formData.brands
      //   .split(',')
      //   .filter(brand => brand.trim() !== '')
      //   .map(brand => ({ name: brand.trim() }));

      // Prepare product data
      const productData = {
        product_name: formData.product_name,
        description: formData.description,
        original_price: Number(formData.original_price),
        offer_price: Number(formData.offer_price),
        percentage_discount: Number(formData.percentage_discount),
        product_images: filteredImages,
        product_videos: filteredVideos,
        categories: formattedCategories,
        // brands: formattedBrands
      };
      
      let result;
      
      // Handle file uploads if needed
      if (formData.newImages.length > 0 || formData.newVideos.length > 0) {
        const formDataForUpload = new FormData();
        formDataForUpload.append('productData', JSON.stringify(productData));
        
        formData.newImages.forEach(image => {
          formDataForUpload.append('images', image.file);
        });
        
        formData.newVideos.forEach(video => {
          formDataForUpload.append('videos', video.file);
        });
        
        result = await dispatch(updateProduct({
          id: selectedProduct._id,
          productData: formDataForUpload,
          isFormData: true
        })).unwrap();
      } else {
        result = await dispatch(updateProduct({
          id: selectedProduct._id,
          productData,
          isFormData: false
        })).unwrap();
      }
      
      handleUpdateResult(result);
    } catch (error) {
      console.error("Update error:", error);
      
      let errorMessage = 'Unknown error occurred';
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object') {
        try {
          errorMessage = JSON.stringify(error);
        } catch (e) {
          errorMessage = 'Error could not be displayed';
        }
      }
      
      showSnackbar(`Update failed: ${errorMessage}`, 'error');
    } finally {
      setEditLoading(false);
    }
  }, [dispatch, formData, handleUpdateResult, selectedProduct, showSnackbar]);

  // Memoized derived data
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    
    return products.filter((product) => 
      product.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredProducts, page, rowsPerPage]);

  // Loading and error states
  if (loading && (!Array.isArray(products) || products.length === 0)) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    const errorMessage = typeof error === 'object' 
      ? JSON.stringify(error) 
      : String(error);
      
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Alert severity="error" sx={{ width: '100%', maxWidth: 800 }}>
          Error: {errorMessage}
        </Alert>
      </Box>
    );
  }

  return (

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
            
            <Typography variant="h6" noWrap component="div"  onClick={() => setMobileDrawerOpen(true)}>
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

    <Box  ml={isMobile ? 10 : 27}  maxWidth="xl" sx={{ py: 3 }}>
      <Box 
        display="flex" 
        flexDirection={isMobile ? 'column' : 'row'} 
        justifyContent="space-between" 
        alignItems={isMobile ? 'stretch' : 'center'} 
        mb={3}
        gap={isMobile ? 2 : 0}
      >
        <Typography variant="h5" fontWeight="600">
          Product Management
        </Typography>
        
        <FormControl variant="outlined" size="small" sx={{ width: isMobile ? '100%' : 300 }}>
          <InputLabel htmlFor="search-products">Search Products</InputLabel>
          <OutlinedInput
            id="search-products"
            value={searchTerm}
            onChange={handleSearchChange}
            endAdornment={
              <InputAdornment position="end">
                <Search />
              </InputAdornment>
            }
            label="Search Products"
          />
        </FormControl>
      </Box>
      
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 250px)' }}>
          <Table stickyHeader aria-label="products table">
            <TableHead>
              <TableRow>
                <TableCell width="50">Image</TableCell>
                <TableCell>Product Name</TableCell>
                {!isMobile && <TableCell>Description</TableCell>}
                <TableCell align="right">Price</TableCell>
                {!isMobile && <TableCell align="right">Discount</TableCell>}
                {!isMobile && <TableCell>Categories</TableCell>}
                <TableCell align="center" width="100">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedProducts.length > 0 ? (
                displayedProducts.map((product) => (
                  <TableRow hover key={product._id}>
                    <TableCell>
                      <Avatar
                        variant="rounded"
                        src={product.product_images && product.product_images.length > 0 
                          ? product.product_images[0] 
                          : ''}
                        alt={product.product_name}
                        sx={{ width: 40, height: 40 }}
                      >
                        <ImageIcon />
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="500">
                        {product.product_name}
                      </Typography>
                      {isMobile && (
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {product.description}
                        </Typography>
                      )}
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            maxWidth: 300
                          }}
                        >
                          {product.description}
                        </Typography>
                      </TableCell>
                    )}
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="600" color="success.main">
                        ${product.offer_price}
                      </Typography>
                      {product.original_price !== product.offer_price && (
                        <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                          ${product.original_price}
                        </Typography>
                      )}
                    </TableCell>
                    {!isMobile && (
                      <TableCell align="right">
                        {product.percentage_discount > 0 ? (
                          <Chip 
                            label={`${product.percentage_discount}%`} 
                            size="small"
                            color="error"
                          />
                        ) : (
                          <Typography variant="body2">—</Typography>
                        )}
                      </TableCell>
                    )}
                    {!isMobile && (
                      <TableCell>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                          {Array.isArray(product.categories) && product.categories.slice(0, isMedium ? 1 : 2).map((category) => (
                            <Chip
                              key={category._id}
                              label={category.name}
                              size="small"
                              variant="outlined"
                              color="primary"
                              icon={<Category fontSize="small" />}
                              sx={{ mb: 0.5, maxWidth: 120 }}
                            />
                          ))}
                          {Array.isArray(product.brands) && !isMedium && product.brands.slice(0, 1).map((brand) => (
                            <Chip
                              key={brand._id}
                              label={brand.name}
                              size="small"
                              variant="outlined"
                              color="secondary"
                              icon={<BrandingWatermark fontSize="small" />}
                              sx={{ mb: 0.5, maxWidth: 120 }}
                            />
                          ))}
                          {((Array.isArray(product.categories) && product.categories.length > (isMedium ? 1 : 2)) || 
                            (!isMedium && Array.isArray(product.brands) && product.brands.length > 1)) && (
                            <Chip
                              label="+"
                              size="small"
                              variant="outlined"
                              color="default"
                              sx={{ mb: 0.5 }}
                            />
                          )}
                        </Stack>
                      </TableCell>
                    )}
                    <TableCell>
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Edit">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleOpenEditDialog(product)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDelete(product._id)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isMobile ? 4 : 7} align="center" sx={{ py: 3 }}>
                    {searchTerm ? 'No products match your search' : 'No products found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={isMobile ? [5, 10, 25] : [10, 25, 50, 100]}
          component="div"
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={isMobile ? "Rows:" : "Rows per page:"}
        />
      </Paper>

      {/* Edit Product Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        sx={{
          '& .MuiDialog-paper': {
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Typography variant="h6" component="div" fontWeight="bold">
            Edit Product
          </Typography>
          <IconButton edge="end" onClick={handleCloseEditDialog} aria-label="close">
            <Close />
          </IconButton>
        </DialogTitle>
        
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
          aria-label="product edit tabs"
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab label={isMobile ? "Basic" : "Basic Info"} icon={<Edit />} iconPosition="start" value={0} />
          <Tab label="Images" icon={<ImageIcon />} iconPosition="start" value={1} />
          <Tab label="Videos" icon={<Videocam />} iconPosition="start" value={2} />
        </Tabs>
        
        <form onSubmit={handleSubmit}>
          <DialogContent 
            dividers 
            sx={{
              overflowY: 'auto',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            {/* Basic Info Tab */}
            {tabValue === 0 && (
              <Grid container display={'flex'} flexDirection={'column'} spacing={isMobile ? 2 : 3}>
                 <Grid item xs={12} sm={6}>
                  <TextField
                    label="Categories"
                    name="categories"
                    value={formData.categories}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    helperText="Example:Main categories name , cubsamburani "
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Product Name"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleChange}
                    fullWidth
                    required
                    helperText="Example:product categories name , like thulasi cubsamburani "

                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={isMobile ? 3 : 4}
                    variant="outlined"
                                        helperText="Example: how to create product and like using materials"

                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Original Price"
                    name="original_price"
                    value={formData.original_price}
                    onChange={handleChange}
                    fullWidth
                    required
                    type="number"
                   
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Offer Price"
                    name="offer_price"
                    value={formData.offer_price}
                    onChange={handleChange}
                    fullWidth
                    required
                    type="number"
                    
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Discount Percentage"
                    name="percentage_discount"
                    value={formData.percentage_discount}
                    onChange={handleChange}
                    fullWidth
                    type="number"
                    InputProps={{
                      endAdornment: <Box component="span" ml={0.5}>%</Box>
                    }}
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                
               
                
                {/* <Grid item xs={12} sm={6}>
                  <TextField
                    label="Brand Name"
                    name="brands"
                    value={formData.brands}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    helperText="Example: company name "
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid> */}
              </Grid>
            )}
            
            {/* Images Tab */}
            {tabValue === 1 && (
              <Box>
                <Box 
                  sx={{ 
                    mb: 3, 
                    p: isMobile ? 2 : 3, 
                    border: '2px dashed #ccc', 
                    borderRadius: 2, 
                    textAlign: 'center',
                    bgcolor: 'background.paper',
                    cursor: 'pointer'
                  }}
                  onClick={() => imageInputRef.current?.click()}
                >
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <CloudUpload sx={{ fontSize: isMobile ? 36 : 48, color: 'primary.main', mb: 1 }} />
                  <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
                    Click to Upload Images
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Supports: JPG, PNG, GIF (Max: 5MB each)
                  </Typography>
                </Box>
                
                {/* Existing Images */}
                {formData.product_images.length > 0 && (
                  <>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Current Images ({formData.product_images.filter((_, idx) => !formData.removedImages.includes(idx)).length})
                    </Typography>
                    <Grid container spacing={isMobile ? 1 : 2} sx={{ mb: 3 }}>
                      {formData.product_images.map((image, index) => {
                        // Skip rendering removed images
                        if (formData.removedImages.includes(index)) return null;
                        
                        // Render only non-removed images
                        return (
                          <Grid item xs={6} sm={4} md={3} key={`existing-${index}`}>
                            <Card sx={{ position: 'relative', height: '100%' }}>
                              <CardMedia
                                component="img"
                                height={isMobile ? "100" : "140"}
                                image={image}
                                alt={`Product ${index + 1}`}
                                sx={{ objectFit: 'contain', backgroundColor: '#f5f5f5' }}
                              />
                              <IconButton
                                size="small"
                                color="error"
                                sx={{
                                  position: 'absolute',
                                  top: 5,
                                  right: 5,
                                  bgcolor: 'rgba(255,255,255,0.8)',
                                  width: isMobile ? 24 : 32,
                                  height: isMobile ? 24 : 32,
                                }}
                                onClick={() => handleRemoveImage(index, 'existing')}
                              >
                                <HighlightOff fontSize={isMobile ? "small" : "medium"} />
                              </IconButton>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </>
                )}
                
                {/* New Images */}
                {formData.newImages.length > 0 && (
                  <>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Newly Added Images
                    </Typography>
                    <Grid container spacing={isMobile ? 1 : 2}>
                      {formData.newImages.map((image, index) => (
                        <Grid item xs={6} sm={4} md={3} key={`new-${index}`}>
                          <Card sx={{ position: 'relative' }}>
                            <CardMedia
                              component="img"
                              height={isMobile ? "100" : "140"}
                              image={image.preview}
                              alt={image.name}
                            />
                            {!isMobile && (
                              <CardContent sx={{ py: 1, px: 2 }}>
                                <Typography variant="caption" noWrap title={image.name}>
                                  {image.name}
                                </Typography>
                              </CardContent>
                            )}
                            <IconButton
                              size="small"
                              color="error"
                              sx={{
                                position: 'absolute',
                                top: 5,
                                right: 5,
                                bgcolor: 'rgba(255,255,255,0.8)',
                                width: isMobile ? 24 : 32,
                                height: isMobile ? 24 : 32,
                              }}
                              onClick={() => handleRemoveImage(index, 'new')}
                            >
                              <HighlightOff fontSize={isMobile ? "small" : "medium"} />
                            </IconButton>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}
                
                {formData.product_images.filter((_, idx) => !formData.removedImages.includes(idx)).length === 0 && 
                  formData.newImages.length === 0 && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    No images added yet. Click the upload area to add images.
                  </Alert>
                )}
              </Box>
            )}
            
            {/* Videos Tab */}
            {tabValue === 2 && (
              <Box>
                <Box 
                  sx={{ 
                    mb: 3, 
                    p: isMobile ? 2 : 3, 
                    border: '2px dashed #ccc', 
                    borderRadius: 2, 
                    textAlign: 'center',
                    bgcolor: 'background.paper',
                    cursor: 'pointer'
                  }}
                  onClick={() => videoInputRef.current?.click()}
                >
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={handleVideoUpload}
                    style={{ display: 'none' }}
                  />
                  <Videocam sx={{ fontSize: isMobile ? 36 : 48, color: 'primary.main', mb: 1 }} />
                  <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
                    Click to Upload Videos
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Supports: MP4, WebM, MOV (Max: 50MB each)
                  </Typography>
                </Box>
                
                {/* Existing Videos */}
                {formData.product_videos.length > 0 && (
                  <>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Current Videos ({formData.product_videos.filter((_, idx) => !formData.removedVideos.includes(idx)).length})
                    </Typography>
                    <List sx={{ bgcolor: 'background.paper', mb: 3 }}>
                      {formData.product_videos.map((video, index) => {
                        if (formData.removedVideos.includes(index)) return null;
                        
                        return (
                          <ListItem key={`existing-video-${index}`} divider>
                            <ListItemAvatar>
                              <Avatar>
                                <Videocam />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText 
                              primary={`Video ${index + 1}`} 
                              secondary={
                                typeof video === 'string' 
                                  ? video 
                                  : 'Video URL'
                              }
                              primaryTypographyProps={{ noWrap: true }}
                              secondaryTypographyProps={{ 
                                noWrap: true, 
                                style: { maxWidth: isMobile ? '180px' : '60vw' } 
                              }}
                            />
                            <ListItemSecondaryAction>
                              <IconButton 
                                edge="end" 
                                color="error"
                                onClick={() => handleRemoveVideo(index, 'existing')}
                              >
                                <Delete fontSize={isMobile ? "small" : "medium"} />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        );
                      })}
                    </List>
                  </>
                )}
                
                {/* New Videos */}
                {formData.newVideos.length > 0 && (
                  <>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Newly Added Videos
                    </Typography>
                    <List sx={{ bgcolor: 'background.paper' }}>
                      {formData.newVideos.map((video, index) => (
                        <ListItem key={`new-video-${index}`} divider>
                          <ListItemAvatar>
                            <Avatar>
                              <Videocam />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText 
                            primary={video.name}
                            secondary={`${video.size} MB | ${video.type}`}
                            primaryTypographyProps={{ noWrap: true }}
                            secondaryTypographyProps={{ 
                              noWrap: true, 
                              style: { maxWidth: isMobile ? '180px' : '60vw' } 
                            }}
                          />
                          <ListItemSecondaryAction>
                            <IconButton 
                              edge="end" 
                              color="error"
                              onClick={() => handleRemoveVideo(index, 'new')}
                            >
                              <Delete fontSize={isMobile ? "small" : "medium"} />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
                
                {formData.product_videos.filter((_, idx) => !formData.removedVideos.includes(idx)).length === 0 &&
                  formData.newVideos.length === 0 && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    No videos added yet. Click the upload area to add videos.
                  </Alert>
                )}
              </Box>
            )}
          </DialogContent>
          
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button 
              onClick={handleCloseEditDialog} 
              variant="outlined" 
              color="inherit"
              size={isMobile ? "small" : "medium"}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              startIcon={<Save />}
              disabled={editLoading}
              size={isMobile ? "small" : "medium"}
            >
              {editLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
         <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
    </Box>
  );
};

export default ProductList;
