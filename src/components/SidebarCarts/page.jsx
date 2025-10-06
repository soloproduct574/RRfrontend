"use client";

import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useTheme } from "@mui/material/styles";
import { useRouter, usePathname } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);

  // Detect screen size
  const isDesktop = useMediaQuery(theme.breakpoints.up("md")); // md = 960px

  const isCartActive = pathname === "/cart";
  const isLikedActive = pathname === "/like";

  const drawerWidth = 250;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "linear-gradient(180deg, #ffffff 0%, #f9f9f9 100%)",
      }}
    >
      {/* Sidebar Header */}
      <Box
        p={1.5}
        sx={{
          borderBottom: "1px solid #ddd",
          textAlign: "center",
          background: "linear-gradient(90deg, #1976d2, #42a5f5)",
          color: "#fff",
          boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Welcome to RR Traders
        </Typography>
      </Box>

      {/* Navigation List */}
      <List sx={{ flexGrow: 1, mt: 1 }}>
        {/* Cart */}
        <ListItemButton
          selected={isCartActive}
          onClick={() => {
            router.push("/cart");
            setMobileOpen(false);
          }}
          sx={{
            borderRadius: "8px",
            mx: 1,
            my: 0.5,
            transition: "all 0.3s ease",
            "&.Mui-selected": {
              backgroundColor: "#e3f2fd",
              borderLeft: "4px solid #1976d2",
              "& .MuiSvgIcon-root": { transform: "scale(1.2)" },
              "&:hover": { backgroundColor: "#bbdefb" },
            },
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          <ListItemIcon>
            <ShoppingCartIcon
              color={isCartActive ? "primary" : "inherit"}
              sx={{ transition: "transform 0.3s ease" }}
            />
          </ListItemIcon>
          <ListItemText
            primary="View Cart"
            primaryTypographyProps={{
              fontWeight: isCartActive ? "bold" : "medium",
            }}
          />
        </ListItemButton>

        {/* Liked Products */}
        <ListItemButton
          selected={isLikedActive}
          onClick={() => {
            router.push("/like");
            setMobileOpen(false);
          }}
          sx={{
            borderRadius: "8px",
            mx: 1,
            my: 0.5,
            transition: "all 0.3s ease",
            "&.Mui-selected": {
              backgroundColor: "#ffebee",
              borderLeft: "4px solid #d32f2f",
              "& .MuiSvgIcon-root": { transform: "scale(1.2)" },
              "&:hover": { backgroundColor: "#ffcdd2" },
            },
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          <ListItemIcon>
            <FavoriteIcon
              color={isLikedActive ? "error" : "inherit"}
              sx={{ transition: "transform 0.3s ease" }}
            />
          </ListItemIcon>
          <ListItemText
            primary="Liked Products"
            primaryTypographyProps={{
              fontWeight: isLikedActive ? "bold" : "medium",
            }}
          />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <>
      {/* Menu Button for Mobile */}
      {!isDesktop && (
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 2000,
            backgroundColor: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Desktop Drawer */}
      {isDesktop ? (
        <Drawer
          variant="permanent"
          anchor="left"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: "1px solid #e0e0e0",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      ) : (
        // Mobile Drawer
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: "1px solid #e0e0e0",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
}
