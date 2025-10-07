"use client";
import React from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  AppBar,
  Toolbar,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useRouter, usePathname } from "next/navigation";

export default function TopBarButtons() {
  const router = useRouter();
  const pathname = usePathname();

  const isCartActive = pathname === "/cart";
  const isLikedActive = pathname === "/like";

  const navItems = [
    {
      text: "View Cart",
      icon: (
        <ShoppingCartIcon
          color={isCartActive ? "primary" : "inherit"}
          sx={{ transition: "transform 0.3s ease" }}
        />
      ),
      path: "/cart",
      active: isCartActive,
      activeColor: "#e3f2fd",
      borderColor: "#1976d2",
    },
    {
      text: "Liked Products",
      icon: (
        <FavoriteIcon
          color={isLikedActive ? "error" : "inherit"}
          sx={{ transition: "transform 0.3s ease" }}
        />
      ),
      path: "/like",
      active: isLikedActive,
      activeColor: "#ffebee",
      borderColor: "#d32f2f",
    },
  ];

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#fff",
        color: "#000",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        height: { xs: "80px", md: "100px" },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Toolbar sx={{ justifyContent: "center", minHeight: "64px !important" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(90deg, #ffffff 0%, #f9f9f9 100%)",
            width: "100%",
          }}
        >
          <List sx={{ display: "flex", flexDirection: "row", p: 0 }}>
            {navItems.map((item, index) => (
              <ListItemButton
                key={index}
                selected={item.active}
                onClick={() => router.push(item.path)}
                sx={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: { xs: "100px", sm: "120px" },
                  borderRadius: "8px",
                  mx: 1,
                  my: 0.5,
                  transition: "all 0.3s ease",
                  "&.Mui-selected": {
                    backgroundColor: item.activeColor,
                    borderBottom: `3px solid ${item.borderColor}`,
                    "& .MuiSvgIcon-root": { transform: "scale(1.2)" },
                    "&:hover": { backgroundColor: item.activeColor },
                  },
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 0 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "0.8rem",
                    textAlign: "center",
                    fontWeight: item.active ? "bold" : "medium",
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Toolbar>
    </AppBar>
  );
}