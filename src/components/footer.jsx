"use client";
import { Box, Container, Grid, Typography, IconButton, Link, useTheme, useMediaQuery } from "@mui/material";
import { Facebook, Instagram, YouTube, Room, Phone, Email } from "@mui/icons-material";

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        mt: 8,
        py: 6,
        background: "linear-gradient(to right, rgba(44, 62, 80, 0.9), rgba(52, 73, 94, 0.95)), url('/pooja-background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: "#fff",
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("/pooja-items-pattern.png") repeat',
          opacity: 0.08,
          zIndex: 0,
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          {/* Brand Section with Logo */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2,
                flexDirection: { xs: 'column', md: 'row' } 
              }}>
                <Box sx={{
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: { md: 2 },
                  mb: { xs: 1, md: 0 },
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  border: '2px solid #f1c40f'
                }}>
                  {/* Replace with your actual logo */}
                  <Box
                    component="img"
                    src="/logo.jpg"
                    alt="RR Traders Logo"
                    sx={{
                      width: '90%',
                      height: '90%',
                      objectFit: 'contain',
                      borderRadius: '50%'
                    }}
                  />
                </Box>
                <Typography 
                  variant="h5" 
                  fontWeight="bold" 
                  textAlign={{ xs: 'center', md: 'left' }}
                  sx={{ 
                    background: 'linear-gradient(45deg, #f1c40f, #e67e22)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  RR Traders
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ 
                opacity: 0.85, 
                textAlign: { xs: 'center', md: 'left' },
                maxWidth: 300,
                lineHeight: 1.6,
                mt: 1
              }}>
                Bringing spirituality closer to you. Explore our premium collection of pooja essentials with divinity and trust.
              </Typography>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" gutterBottom textAlign={{ xs: 'center', md: 'left' }} sx={{ fontWeight: 600 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, alignItems: { xs: 'center', md: 'flex-start' } }}>
              <Link href="/" color="inherit" underline="hover" sx={{ transition: 'all 0.3s', '&:hover': { transform: 'translateX(5px)', color: '#f1c40f' } }}>Home</Link>
              <Link href="/shop" color="inherit" underline="hover" sx={{ transition: 'all 0.3s', '&:hover': { transform: 'translateX(5px)', color: '#f1c40f' } }}>Shop</Link>
              <Link href="/about" color="inherit" underline="hover" sx={{ transition: 'all 0.3s', '&:hover': { transform: 'translateX(5px)', color: '#f1c40f' } }}>About Us</Link>
              <Link href="/contact" color="inherit" underline="hover" sx={{ transition: 'all 0.3s', '&:hover': { transform: 'translateX(5px)', color: '#f1c40f' } }}>Contact</Link>
            </Box>
          </Grid>

          {/* Policies */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" gutterBottom textAlign={{ xs: 'center', md: 'left' }} sx={{ fontWeight: 600 }}>
              Policies
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, alignItems: { xs: 'center', md: 'flex-start' } }}>
              <Link href="/terms" color="inherit" underline="hover" sx={{ transition: 'all 0.3s', '&:hover': { transform: 'translateX(5px)', color: '#f1c40f' } }}>Terms & Conditions</Link>
              <Link href="/privacy" color="inherit" underline="hover" sx={{ transition: 'all 0.3s', '&:hover': { transform: 'translateX(5px)', color: '#f1c40f' } }}>Privacy Policy</Link>
              <Link href="/return" color="inherit" underline="hover" sx={{ transition: 'all 0.3s', '&:hover': { transform: 'translateX(5px)', color: '#f1c40f' } }}>Return Policy</Link>
              <Link href="/shipping" color="inherit" underline="hover" sx={{ transition: 'all 0.3s', '&:hover': { transform: 'translateX(5px)', color: '#f1c40f' } }}>Shipping Info</Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom textAlign={{ xs: 'center', md: 'left' }} sx={{ fontWeight: 600 }}>
              Contact Us
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2, 
              alignItems: { xs: 'center', md: 'flex-start' } 
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Room sx={{ mr: 1.5, color: '#f1c40f' }} />
                <Typography variant="body2">123 Temple Street, Pune, India</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Phone sx={{ mr: 1.5, color: '#f1c40f' }} />
                <Typography variant="body2">+91 98765 43210</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email sx={{ mr: 1.5, color: '#f1c40f' }} />
                <Typography variant="body2">support@rrtraders.com</Typography>
              </Box>
            </Box>

            {/* Social Media Icons */}
            <Box mt={3} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <IconButton 
                color="inherit" 
                href="https://facebook.com" 
                target="_blank"
                sx={{ 
                  backgroundColor: '#3b5998', 
                  mx: 0.5,
                  '&:hover': { backgroundColor: '#2d4373', transform: 'translateY(-3px)' },
                  transition: 'all 0.3s'
                }}
              >
                <Facebook />
              </IconButton>
              <IconButton 
                color="inherit" 
                href="https://instagram.com" 
                target="_blank"
                sx={{ 
                  background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', 
                  mx: 0.5,
                  '&:hover': { opacity: 0.9, transform: 'translateY(-3px)' },
                  transition: 'all 0.3s'
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton 
                color="inherit" 
                href="https://youtube.com" 
                target="_blank"
                sx={{ 
                  backgroundColor: '#FF0000', 
                  mx: 0.5,
                  '&:hover': { backgroundColor: '#cc0000', transform: 'translateY(-3px)' },
                  transition: 'all 0.3s'
                }}
              >
                <YouTube />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom */}
        <Box
          textAlign="center"
          pt={5}
          mt={4}
          borderTop="1px solid rgba(255, 255, 255, 0.2)"
        >
          <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.9rem' }}>
            © {new Date().getFullYear()} RR Traders 🪔 | All Rights Reserved
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1, flexWrap: 'wrap' }}>
            <Link href="/privacy" color="inherit" underline="hover" sx={{ fontSize: '0.8rem', opacity: 0.7, '&:hover': { opacity: 1 } }}>
              Privacy Policy
            </Link>
            <Link href="/terms" color="inherit" underline="hover" sx={{ fontSize: '0.8rem', opacity: 0.7, '&:hover': { opacity: 1 } }}>
              Terms of Service
            </Link>
            <Link href="/return" color="inherit" underline="hover" sx={{ fontSize: '0.8rem', opacity: 0.7, '&:hover': { opacity: 1 } }}>
              Return Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}