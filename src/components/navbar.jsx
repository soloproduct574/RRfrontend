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
import Avatar from "@mui/material/Avatar";
import { styled, alpha } from "@mui/material/styles";
import { usePathname } from "next/navigation";
import LoginModal from "../app/auth/login/page.jsx";
import RegisterModal from "../app/auth/register/page";

const pages = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
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

const ProfileMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: "8px",
    marginTop: theme.spacing(1.5),
    minWidth: 160,
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    "& .MuiMenuItem-root": {
      padding: theme.spacing(1.2, 2),
      "&:hover": {
        backgroundColor: alpha("#ff6600", 0.1),
        color: "#ff6600",
      },
    },
  },
}));

export default function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [openLogin, setOpenLogin] = React.useState(false);
  const [openRegister, setOpenRegister] = React.useState(false);
  const pathname = usePathname();

  // Handlers
  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleOpenLoginModal = () => {
    setAnchorElUser(null);
    setOpenLogin(true);
  };

  const handleCloseLoginModal = () => setOpenLogin(false);

  const handleOpenRegisterModal = () => {
    setAnchorElUser(null);
    setOpenRegister(true);
  };

  const handleCloseRegisterModal = () => setOpenRegister(false);

  // Switch between modals
  const handleSwitchToRegister = () => {
    setOpenLogin(false);
    setOpenRegister(true);
  };
  const handleSwitchToLogin = () => {
    setOpenRegister(false);
    setOpenLogin(true);
  };

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
          {/* <HoverButton text="RR_Traders" /> */}

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

            {/* Profile Avatar & Menu */}
            <Box sx={{ ml: 1 }}>
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{
                  p: 0.5,
                  border: "1px solid rgba(0,0,0,0.1)",
                  "&:hover": {
                    borderColor: "#ff6600",
                    backgroundColor: alpha("#ff6600", 0.1),
                  },
                }}
              >
                <Avatar alt="Profile" src="/user.png" sx={{ width: 36, height: 36 }} />
              </IconButton>
              <ProfileMenu
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                {/* <MenuItem onClick={handleOpenLoginModal}>Login</MenuItem> */}
                <MenuItem onClick={handleOpenRegisterModal}>Register</MenuItem>
              </ProfileMenu>
            </Box>
          </Box>

          {/* Mobile Menu */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{
                color: "#000",
                "&:hover": {
                  backgroundColor: alpha("#ff6600", 0.1),
                },
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
                <MenuItem
                  key={page.name}
                  onClick={handleCloseNavMenu}
                  selected={pathname === page.path}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: alpha("#ff6600", 0.1),
                      color: "#ff6600",
                    },
                  }}
                >
                  <NavLink href={page.path} isActive={pathname === page.path} sx={{ width: "100%" }}>
                    {page.name}
                  </NavLink>
                </MenuItem>
              ))}
              {/* <MenuItem
                onClick={() => {
                  handleCloseNavMenu();
                  handleOpenLoginModal();
                }}
              >
                Login
              </MenuItem> */}
              <MenuItem
                onClick={() => {
                  handleCloseNavMenu();
                  handleOpenRegisterModal();
                }}
              >
                Register
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ✅ Login & Register Modals */}
      <LoginModal
        open={openLogin}
        onClose={handleCloseLoginModal}
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterModal
        open={openRegister}
        onClose={handleCloseRegisterModal}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
}