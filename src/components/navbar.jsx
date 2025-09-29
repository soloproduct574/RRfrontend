"use client";

import * as React from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import { styled, alpha } from "@mui/material/styles";
import { usePathname } from "next/navigation";
import RegisterModal from "../app/auth/register/page";

const pages = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const NavLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== "isActive",
})(({ theme, isActive }) => ({
  position: "relative",
  textDecoration: "none",
  color: isActive ? "#ff6600" : "#000",
  fontWeight: isActive ? 600 : 500,
  padding: theme.spacing(1, 1.5),
  transition: "all 0.3s ease",
  "&:after": {
    content: '""',
    position: "absolute",
    width: isActive ? "100%" : "0%",
    height: "2px",
    left: "0",
    bottom: "0",
    backgroundColor: "#ff6600",
    transition: "width 0.3s",
  },
  "&:hover": {
    color: "#ff6600",
  },
  "&:hover:after": {
    width: "100%",
  },
}));

const CartButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#ff6600",
  color: "#fff",
  padding: theme.spacing(0.8, 2),
  borderRadius: "4px",
  fontWeight: 500,
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#e65c00",
    transform: "translateY(-2px)",
  },
}));

const ChatButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#ff6600",
  color: "#fff",
  padding: theme.spacing(0.8, 2),
  borderRadius: "4px",
  fontWeight: 500,
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#e65c00",
    transform: "translateY(-2px)",
  },
}));

export default function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [openRegister, setOpenRegister] = React.useState(false);
  const pathname = usePathname();

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  const handleOpenRegisterModal = () => setOpenRegister(true);
  const handleCloseRegisterModal = () => setOpenRegister(false);

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "transparent",
          color: "#000",
          boxShadow: "none",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            py: 1,
            maxWidth: "xl",
            mx: "auto",
            width: "100%",
          }}
        >
          {/* LOGO */}
          <LogoContainer component={Link} href="/">
            <Box
              component="img"
              src="/logo.jpg"
              alt="RR_Traders Logo"
              sx={{
                width: 90,
                height: 55,
                objectFit: "contain",
                borderRadius: "4px",
                border: "1px solid rgba(0,0,0,0.1)",
              }}
            />
          </LogoContainer>
          <Typography>RR Traders</Typography>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
            {pages.map((page) => (
              <NavLink key={page.name} href={page.path} isActive={pathname === page.path}>
                {page.name}
              </NavLink>
            ))}

            <CartButton component={Link} href="/cart" startIcon={<ShoppingCartIcon />}>
              Cart
            </CartButton>

            <ChatButton onClick={handleOpenRegisterModal}>Chat With Us</ChatButton>
          </Box>

          {/* Mobile Menu */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{
                color: "#000",
                "&:hover": { backgroundColor: alpha("#ff6600", 0.1) },
              }}
            >
              <Badge badgeContent={3} color="error">
                <MenuIcon />
              </Badge>
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
                "& .MuiPaper-root": {
                  borderRadius: "8px",
                  mt: 1.5,
                  minWidth: 180,
                  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu} selected={pathname === page.path}>
                  <NavLink href={page.path} isActive={pathname === page.path} sx={{ width: "100%" }}>
                    {page.name}
                  </NavLink>
                </MenuItem>
              ))}
              <MenuItem
                onClick={() => {
                  handleCloseNavMenu();
                  handleOpenRegisterModal();
                }}
              >
                Chat With Us
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Register Modal */}
      <RegisterModal open={openRegister} onClose={handleCloseRegisterModal} />
    </>
  );
}