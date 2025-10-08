// components/OrderDashboard.jsx
'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Drawer,
  Divider,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Chip,
  Tooltip,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Menu,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchOrders,
  deleteOrder,
  fetchOrderById,
  selectOrders,
  selectOrdersLoading,
  selectOrdersError,
  selectOrdersSummary,
  selectCurrentOrder,
} from '../../../redux/slice/orderSlice.jsx';
import AdminSidebar from '@/components/dashboards/AdminSideBar';

const OrderDashboard = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const order = useSelector(selectCurrentOrder);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);
  const summary = useSelector(selectOrdersSummary);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch orders on mount
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleViewOrder = (id) => {
    dispatch(fetchOrderById(id));
    setDrawerOpen(true);
  };

  

  const handleRefresh = () => dispatch(fetchOrders());

  /**
   * CLASSIFY ORDERS
   */
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const newOrders = orders.filter(
    (o) => new Date(o.createdAt) >= today
  );
  const oldOrders = orders.filter(
    (o) => new Date(o.createdAt) < today
  );

  /**
   * DATA GRID COLUMNS
   */
  const columns = [
    {
      field: 'name',
      headerName: 'Customer',
      flex: 1,
      renderCell: (params) => (
        <Typography fontWeight="bold">{params.row.name}</Typography>
      ),
    },
    {
      field: 'mobileNumber',
      headerName: 'Mobile',
      flex: 0.8,
    },
    {
      field: 'paymentMode',
      headerName: 'Payment Mode',
      flex: 0.6,
      renderCell: (params) => (
        <Chip
          label={params.row.paymentMode}
          color={params.row.orderStatus === 'Pending' ? 'warning' : 'success'}
          size="small"
        />
      ),
    },
    {
      field: 'payment Image',
      headerName: 'Payment Image',
      flex: 0.6,
      renderCell: (params) => (
       <img
          src={
            params.row.photo
          }
          alt="Payment"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      flex: 0.8,
      renderCell: (params) =>
        new Date(params.row.createdAt).toLocaleDateString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.6,
      sortable: false,
      renderCell: (params) => (
        <>
          <Tooltip title="View Details">
            <IconButton
              color="primary"
              onClick={() => handleViewOrder(params.row._id)}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title="Delete Order">
            <IconButton
              color="error"
              onClick={() => handleDelete(params.row._id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip> */}
        </>
      ),
    },
  ];

  /**
   * DRAWER CONTENT — single order
   */
  const renderOrderDetails = () =>
    order ? (
      <Box sx={{ width: isMobile ? '100vw' : 450, p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Order Details
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2">
          <strong>Order ID:</strong> {order._id}
        </Typography>
        <Typography variant="body2">
          <strong>Customer Name:</strong> {order.name}
        </Typography>
        <Typography variant="body2">
          <strong>Mobile:</strong> {order.mobileNumber}
        </Typography>
        <Typography variant="body2">
          <strong>Address:</strong> {order.shippingAddress}
        </Typography>
        <Typography variant="body2">
          <strong>Pincode:</strong> {order.pincode}
        </Typography>
        <Typography variant="body2">
          <strong>Payment Mode:</strong> {order.paymentMode}
        </Typography>
        <Typography variant="body2" mt={1}>
          <strong> Payment Screenshot:</strong>{' '}
</Typography>
 {order.photo && (
  <Box
    sx={{
      my: 1.5,
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: 2,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      bgcolor: '#fafafa',
    }}
  >
    {(() => {
      // Determine correct image URL
      const isCloudUrl = order.photo.startsWith('http');
      const imageUrl = isCloudUrl
        ? order.photo
        : `${process.env.NEXT_PUBLIC_BASE_URL || ''}${order.photo.replace(/\\/g, '/')}`;

      return (
        <img
          src={imageUrl}
          alt="Payment Screenshot"
          style={{
            width: '100%',
            maxHeight: 200,
            objectFit: 'contain',
            cursor: 'pointer',
          }}
          onClick={() => window.open(imageUrl, '_blank')}
        />
      );
    })()}
  </Box>
)}

        <Divider sx={{ my: 2 }} />
        {order.orderItems?.length > 0 && (
          <>
            <Typography variant="subtitle1">Items ({order.orderItems.length})</Typography>
            <List dense>
              {order.orderItems.map((item) => (
                <ListItem key={item._id}>
                  <Avatar src={item.productImage} alt={item.productName} sx={{ mr: 2 }} />
                  <ListItemText
                    primary={item.productName}
                    secondary={`Qty: ${item.quantity} × ₹${item.offerPrice} = ₹${item.itemTotal}`}
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" fontWeight="bold">
          Summary
        </Typography>
        {order.orderSummary && (
          <>
            <Typography variant="body2">Subtotal: ₹{order.orderSummary.subtotal}</Typography>
            <Typography variant="body2">Tax: ₹{order.orderSummary.tax}</Typography>
            <Typography variant="body2">Total: ₹{order.orderSummary.total}</Typography>
            <Typography variant="body2" color="text.secondary">
              Items: {order.orderSummary.itemCount}
            </Typography>
          </>
        )}
        <Divider sx={{ my: 2 }} />
        <Typography variant="caption" color="text.secondary">
          Created: {new Date(order.createdAt).toLocaleString()}
        </Typography>
      </Box>
    ) : (
      <Box p={2}>No order selected.</Box>
    );
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
    <Box sx={{ p: { xs: 2, md: 4 }  }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          Dashboard – Orders
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
        >
          Refresh
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography>Total Orders</Typography>
            <Typography variant="h6" fontWeight="bold">{summary.totalOrders || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography>Total Revenue</Typography>
            <Typography variant="h6" fontWeight="bold">₹{summary.totalRevenue || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography>Avg Order Value</Typography>
            <Typography variant="h6" fontWeight="bold">₹{summary.avgOrderValue || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography>Total Items</Typography>
            <Typography variant="h6" fontWeight="bold">{summary.totalItems || 0}</Typography>
          </Paper>

        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" fontWeight="bold">
              New Orders Today
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {newOrders.length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* New Orders Section */}
      <Typography variant="h6" sx={{ mb: 1 }}>
        🆕 New Orders (Today)
      </Typography>
      <Paper sx={{ height: 300, mb: 4 }}>
        <DataGrid
          rows={newOrders}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          pageSize={5}
          disableRowSelectionOnClick
        />
      </Paper>

      {/* Old Orders Section */}
      <Typography variant="h6" sx={{ mb: 1 }}>
        📦 Previous Orders
      </Typography>
      <Paper sx={{ height: 400 }}>
        <DataGrid
          rows={oldOrders}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          pageSize={5}
          disableRowSelectionOnClick
        />
      </Paper>

      <Drawer
        anchor={isMobile ? 'bottom' : 'right'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {renderOrderDetails()}
      </Drawer>
    </Box>
    </Box>
    </>
  );
};

export default OrderDashboard;
