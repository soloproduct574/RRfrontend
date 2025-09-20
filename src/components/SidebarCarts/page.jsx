"use client";

import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useRouter, usePathname } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const isCartActive = pathname === "/cart";
  const isLikedActive = pathname === "/like";

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 250,
        height: "100vh",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 250,
          boxSizing: "border-box",
          background: "linear-gradient(180deg, #ffffff 0%, #f9f9f9 100%)",
          borderRight: "1px solid #e0e0e0",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          top: 0,
          left: 0,
        },
      }}
    >
      {/* Sidebar Header */}
      <Box
        p={1}
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
        <ListItemButton
          selected={isCartActive}
          onClick={() => router.push("/cart")}
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
            secondaryTypographyProps={{
              fontSize: "0.8rem",
              color: "text.secondary",
            }}
          />
        </ListItemButton>

        <ListItemButton
          selected={isLikedActive}
          onClick={() => router.push("/like")}
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
            secondaryTypographyProps={{
              fontSize: "0.8rem",
              color: "text.secondary",
            }}
          />
        </ListItemButton>
      </List>
    </Drawer>
  );
}
