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
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: 250,
      boxSizing: "border-box",
      background: "#ffffff",
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
        p={2}
        sx={{
          borderBottom: "1px solid #ddd",
          textAlign: "center",
          background: "#f7f7f7",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Menu
        </Typography>
      </Box>

      {/* Navigation List */}
      <List sx={{ flexGrow: 1 }}>
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
              "&:hover": { backgroundColor: "#bbdefb" },
            },
            "&:hover": { backgroundColor: "#f1f1f1" },
          }}
        >
          <ListItemIcon>
            <ShoppingCartIcon color={isCartActive ? "primary" : "inherit"} />
          </ListItemIcon>
          <ListItemText
            primary="View Cart"
            primaryTypographyProps={{
              fontWeight: isCartActive ? "bold" : "normal",
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
              "&:hover": { backgroundColor: "#ffcdd2" },
            },
            "&:hover": { backgroundColor: "#f1f1f1" },
          }}
        >
          <ListItemIcon>
            <FavoriteIcon color={isLikedActive ? "error" : "inherit"} />
          </ListItemIcon>
          <ListItemText
            primary="Liked Products"
            primaryTypographyProps={{
              fontWeight: isLikedActive ? "bold" : "normal",
            }}
          />
        </ListItemButton>
      </List>
    </Drawer>
  );
}
