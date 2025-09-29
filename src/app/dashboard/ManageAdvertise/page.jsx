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
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Power as PowerIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  Home as HomeIcon,
  TableRows as TableCellsIcon,
  Group as UsersIcon,
  Settings as Cog6ToothIcon,
} from "@mui/icons-material";
import { logout } from "@/Redux/Slice/AdminAuthSlice";

const AdminSidebar = ({ isMobile, sidebarOpen, setSidebarOpen }) => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard Overview", icon: HomeIcon, href: "/admin-dashboard" },
    { name: "Manage Products", icon: TableCellsIcon, href: "/dashboard/ManageProducts" },
    { name: "Manage Advertise", icon: TableCellsIcon, href: "/dashboard/ManageAdvertise" },
    { name: "Manage Users", icon: UsersIcon, href: "/dashboard/ManageUsers" },
    { name: "Settings", icon: Cog6ToothIcon, href: "/admin-dashboard/settings" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    router.push("/admin-login");
  };

  const SidebarContent = (
    <div className="h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-lg">
      <div className="p-6 text-2xl font-bold border-b border-gray-700 flex items-center gap-2">
        ⚡ Admin Panel
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center w-full px-4 py-2 rounded-lg transition ease-in-out ${
                isActive ? "bg-gray-700 text-yellow-400 font-semibold" : "hover:bg-gray-700 text-gray-300"
              }`}
              onClick={() => isMobile && setSidebarOpen(false)}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <Button
          variant="contained"
          color="error"
          startIcon={<PowerIcon />}
          fullWidth
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar for mobile */}
      {isMobile ? (
        <>
          <Box
            sx={{
              position: "fixed",
              left: sidebarOpen ? 0 : "-280px",
              top: 0,
              width: 280,
              height: "100vh",
              zIndex: 40,
              transition: "left 0.3s ease-in-out",
            }}
          >
            {SidebarContent}
          </Box>
          {sidebarOpen && (
            <Box
              onClick={() => setSidebarOpen(false)}
              sx={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 30,
              }}
            />
          )}
        </>
      ) : (
        <Box sx={{ width: 280, flexShrink: 0 }}>
          {SidebarContent}
        </Box>
      )}
    </>
  );
};

const BannerForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // mobile/tablet
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    runningText: [""],
    redirectUrls: [""],
    bannerFiles: [],
    advertiseFiles: [],
  });
  const [loading, setLoading] = useState(false);

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
  const removeField = (field, index) => setForm({ ...form, [field]: form[field].filter((_, i) => i !== index) });
  const handleFileChange = (e, field) => setForm({ ...form, [field]: [...form[field], ...Array.from(e.target.files)] });
  const removeFile = (field, index) => setForm({ ...form, [field]: form[field].filter((_, i) => i !== index) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000); // simulate API
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Hamburger menu for mobile */}
      {isMobile && (
        <IconButton
          onClick={() => setSidebarOpen(!sidebarOpen)}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 50,
            background: "#1e293b",
            color: "white",
            "&:hover": { background: "#334155" },
          }}
        >
          {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      )}

      {/* Sidebar */}
      <AdminSidebar isMobile={isMobile} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          p: isMobile ? 2 : 4,
          background: "linear-gradient(135deg, #f9fafb, #f1f5f9)",
        }}
      >
        <Container maxWidth="lg" sx={{ p: 0 }}>
          {/* Page Title */}
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              fontWeight="700"
              gutterBottom
              sx={{ color: "#0f172a", mb: 3, textAlign: "center" }}
            >
              🚀 Create New Banner
            </Typography>
          </motion.div>

          {/* Main Form */}
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, background: "white", boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}>
              {/* Title */}
              <TextField
                label="Banner Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                variant="outlined"
                sx={{ mb: 4, "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
              />

              {/* Running Texts */}
              <Divider sx={{ my: 4 }}>
                <Chip label="🏃 Running Texts" color="primary" variant="outlined" />
              </Divider>
              {form.runningText.map((text, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <TextField
                    label={`Text ${i + 1}`}
                    value={text}
                    onChange={(e) => handleChange(e, i, "runningText")}
                    fullWidth
                  />
                  <IconButton onClick={() => removeField("runningText", i)} sx={{ ml: 1, color: "error.main" }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button startIcon={<AddIcon />} onClick={() => addField("runningText")} sx={{ mt: 1 }}>
                Add More
              </Button>

              {/* Redirect URLs */}
              <Divider sx={{ my: 4 }}>
                <Chip label="🔗 Redirect URLs" color="secondary" variant="outlined" />
              </Divider>
              {form.redirectUrls.map((url, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <TextField
                    label={`URL ${i + 1}`}
                    value={url}
                    onChange={(e) => handleChange(e, i, "redirectUrls")}
                    fullWidth
                  />
                  <IconButton onClick={() => removeField("redirectUrls", i)} sx={{ ml: 1, color: "error.main" }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button startIcon={<AddIcon />} onClick={() => addField("redirectUrls")} sx={{ mt: 1 }}>
                Add More
              </Button>

              {/* Banner Images */}
              <Divider sx={{ my: 4 }}>
                <Chip label="🖼 Banner Images" color="success" variant="outlined" />
              </Divider>
              <Button variant="outlined" component="label" startIcon={<ImageIcon />} sx={{ mb: 2 }}>
                Upload Banner
                <input type="file" hidden multiple onChange={(e) => handleFileChange(e, "bannerFiles")} />
              </Button>
              <Grid container spacing={2}>
                {form.bannerFiles.map((file, i) => (
                  <Grid item xs={6} sm={4} md={3} key={i}>
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Card sx={{ borderRadius: 3, overflow: "hidden", position: "relative", height: 160, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                        <CardMedia component="img" image={URL.createObjectURL(file)} alt={`banner-${i}`} sx={{ objectFit: "cover", height: "100%" }} />
                        <IconButton
                          onClick={() => removeFile("bannerFiles", i)}
                          size="small"
                          sx={{ position: "absolute", top: 6, right: 6, backgroundColor: "rgba(255,255,255,0.9)", "&:hover": { backgroundColor: "white" } }}
                        >
                          <DeleteIcon fontSize="small" sx={{ color: "#ef4444" }} />
                        </IconButton>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>

              {/* Advertise Images */}
              <Divider sx={{ my: 4 }}>
                <Chip label="📢 Advertise Images" color="warning" variant="outlined" />
              </Divider>
              <Button variant="outlined" component="label" startIcon={<ImageIcon />} sx={{ mb: 2 }}>
                Upload Advertise
                <input type="file" hidden multiple onChange={(e) => handleFileChange(e, "advertiseFiles")} />
              </Button>
              <Grid container spacing={2}>
                {form.advertiseFiles.map((file, i) => (
                  <Grid item xs={6} sm={4} md={3} key={i}>
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Card sx={{ borderRadius: 3, overflow: "hidden", position: "relative", height: 160, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                        <CardMedia component="img" image={URL.createObjectURL(file)} alt={`advertise-${i}`} sx={{ objectFit: "cover", height: "100%" }} />
                        <IconButton
                          onClick={() => removeFile("advertiseFiles", i)}
                          size="small"
                          sx={{ position: "absolute", top: 6, right: 6, backgroundColor: "rgba(255,255,255,0.9)", "&:hover": { backgroundColor: "white" } }}
                        >
                          <DeleteIcon fontSize="small" sx={{ color: "#ef4444" }} />
                        </IconButton>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </motion.div>

          {/* Sticky Save Button */}
          <Box sx={{ position: "sticky", bottom: 0, background: "white", py: 2, borderTop: "1px solid #e2e8f0", mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              onClick={handleSubmit}
              sx={{
                py: 1.5,
                borderRadius: 3,
                fontSize: "16px",
                fontWeight: "bold",
                background: "linear-gradient(90deg, #1e293b, #0f172a)",
                "&:hover": { background: "linear-gradient(90deg, #334155, #1e293b)" },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "SAVE"}
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default BannerForm;
