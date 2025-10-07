"use client";

import React from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useTheme } from "@mui/material/styles";
import { useRouter, usePathname } from "next/navigation";

export default function TopBarButtons() {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isCartActive = pathname === "/cart";
  const isLikeActive = pathname === "/like";

  return (
    <Box
      sx={{
        width: "100%",
        position: "sticky",
        top: 0,
        zIndex: 2000,
        // background:    "linear-gradient(90deg, #1976d2, #42a5f5, #64b5f6, #90caf9)",
        py: { xs: 1, sm: 1.5,mt:1 },
        px: { xs: 1, sm: 2 },
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: { xs: 1, sm: 2 },
        // boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
      }}
    >
      {/* <Typography
        variant={isMobile ? "subtitle1" : "h6"}
        sx={{
          color: "#000000ff",
          fontWeight: 700,
          letterSpacing: 0.5,
          textShadow: "0 1px 2px rgba(0,0,0,0.25)",
        }}
      >
        RR Traders
      </Typography> */}

      {/* Buttons Row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, sm: 2 },
          // flexWrap: "wrap",
        }}
      >
        {/* Cart Button */}
        <Tooltip title="Go to Cart">
          <Button
            onClick={() => router.push("/cart")}
            variant="contained"
            startIcon={<ShoppingCartIcon />}
            sx={{
              textTransform: "none",
              borderRadius: "30px",
              px: { xs: 2, sm: 3 },
              background: isCartActive
                ? "linear-gradient(135deg, #1565c0, #1e88e5)"
                : "rgba(255,255,255,0.9)",
              color: isCartActive ? "#fff" : "#1565c0",
              fontWeight: isCartActive ? 600 : 500,
              boxShadow: isCartActive
                ? "0 3px 8px rgba(33,150,243,0.4)"
                : "0 2px 5px rgba(0,0,0,0.1)",
              "&:hover": {
                background: isCartActive
                  ? "linear-gradient(135deg, #0d47a1, #1565c0)"
                  : "rgba(255,255,255,1)",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              },
              transition: "all 0.3s ease",
            }}
          >
            {isMobile ? null : "View Cart"}
          </Button>
        </Tooltip>

        {/* Liked Products */}
        <Tooltip title="Liked Products">
          <Button
            onClick={() => router.push("/like")}
            variant="contained"
            startIcon={<FavoriteIcon />}
            sx={{
              textTransform: "none",
              borderRadius: "30px",
              px: { xs: 2, sm: 3 },
              background: isLikeActive
                ? "linear-gradient(135deg, #d32f2f, #f44336)"
                : "rgba(255,255,255,0.9)",
              color: isLikeActive ? "#fff" : "#d32f2f",
              fontWeight: isLikeActive ? 600 : 500,
              boxShadow: isLikeActive
                ? "0 3px 8px rgba(244,67,54,0.4)"
                : "0 2px 5px rgba(0,0,0,0.1)",
              "&:hover": {
                background: isLikeActive
                  ? "linear-gradient(135deg, #b71c1c, #d32f2f)"
                  : "rgba(255,255,255,1)",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              },
              transition: "all 0.3s ease",
            }}
          >
            {isMobile ? null : "Liked Products"}
          </Button>
        </Tooltip>

        {/* Optional: Right arrow to browse forward */}
        {!isMobile && (
          <IconButton
            size="small"
            sx={{
              ml: 1,
              color: "#fff",
              background: "rgba(255,255,255,0.25)",
              borderRadius: "50%",
              "&:hover": {
                background: "rgba(255,255,255,0.4)",
                transform: "scale(1.1)",
              },
              transition: "all 0.3s ease",
            }}
            onClick={() => router.push("/products")}
          >
            <ArrowForwardIosIcon sx={{ fontSize: 20 }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
