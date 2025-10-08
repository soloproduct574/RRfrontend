"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Drawer,
  useMediaQuery,
  TextField,
} from "@mui/material";
import AdminSidebar from "@/components/dashboards/AdminSideBar";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Media queries
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:900px)");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://rrbackend-49lt.onrender.com/api/auth/users");
        setUsers(response.data.users || []);
      } catch (err) {
        setError("Failed to fetch users.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.mobileNumber.includes(searchQuery)
  );

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Typography color="error">{error}</Typography>;
  if (users.length === 0) return <Typography>No users found.</Typography>;

  return (
    <Box sx={{ display: "flex", overflow: "hidden", height: "100vh" }}>
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
          p: 3,
          ml: isMobile ? 0 : isTablet ? "200px" : "257px",
          width: `calc(100% - ${isMobile ? 0 : isTablet ? 200 : 257}px)`,
          boxSizing: "border-box",
          overflow: "hidden",
          height: "100vh",
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, textAlign: "center" }}>
          Registered Users
        </Typography>

        {/* Search Box */}
        <Box sx={{ display: "flex", justifyContent: "right", mb: 2 }}>
          <TextField
            placeholder="Search by name, email, or mobile"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ width: "100%", maxWidth: 400 }}
          />
        </Box>

        {/* Users Table */}
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: 6,
            borderRadius: 3,
            overflow: "hidden",
            maxHeight: "calc(100vh - 150px)",
          }}
        >
          <Table sx={{ tableLayout: "fixed", width: "100%" }}>
            <TableHead
              sx={{
                backgroundColor: "#1976d2",
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              <TableRow>
                <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Mobile</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Joined At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow
                  key={user._id}
                  sx={{
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": { transform: "scale(1.02)", boxShadow: 3 },
                    backgroundColor: index % 2 === 0 ? "#f4f6f8" : "#ffffff",
                  }}
                >
                  <TableCell sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {/* Avatar Circle */}
                 
                    {user.fullName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.mobileNumber}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}{" "}
                    {new Date(user.createdAt).toLocaleTimeString()}
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: "center", py: 3 }}>
                    No matching users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default UsersList;
