"use client";
import React, { useState } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Grid,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Chip,
  FormLabel
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EmailIcon from '@mui/icons-material/Email';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FeaturesSection from "@/components/featuresContact";
import { motion } from "framer-motion";

// Styled components
const BannerSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '400px',
  overflow: 'hidden',
  marginBottom: theme.spacing(6),
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'brightness(0.7)'
  }
}));

const BannerOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  textAlign: 'center',
  background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5))'
}));

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      ease: "easeOut" 
    } 
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      duration: 0.8, 
      ease: "easeOut" 
    } 
  }
};

const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const pulse = {
  hidden: { scale: 1 },
  visible: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Main component
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: ''
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setOpenSnackbar(true);
    setFormData({ name: '', email: '', mobile: '', message: '' });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Branch locations data
  const branches = [
    {
      id: 1,
      name: "Main Store",
      address: "123 Temple Street, Sacred City, India - 560001",
      phone: "+91 98765 43210",
      email: "main@poojaitems.com",
      hours: "9:00 AM - 8:00 PM",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.931292112852!2d77.59431431482133!3d12.93469019089225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15c49c040309%3A0x6553433f72187b01!2sBangalore%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1660122358352!5m2!1sen!2sin"
    },
    {
      id: 2,
      name: "City Center Branch",
      address: "456 Devotion Road, Spiritual Nagar, India - 560002",
      phone: "+91 97654 32109",
      email: "citycenter@poojaitems.com",
      hours: "10:00 AM - 9:00 PM",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.036268637448!2d77.6127603148212!3d12.919718390904897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15c49c040309%3A0x6553433f72187b01!2sBangalore%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1660122358352!5m2!1sen!2sin"
    },
  ];

  const [selectedBranch, setSelectedBranch] = useState(branches[0]);

  return (
    <>
      <Navbar />
      <Box>
        {/* Banner Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
        >
          <BannerSection>
            <img src="/herobaner.jpg" alt="Contact Us" />
            <BannerOverlay>
              <motion.div variants={pulse}>
                <Typography
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  gap={2}
                  mt={18}
                >
                  <motion.img 
                    src="/texticon.png" 
                    alt="icon" 
                    style={{ width: 50, height: 50 }} 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  />
                  <Typography variant="h4" sx={{ fontWeight: 600, letterSpacing: "1px", color: "#fff" }}>
                    Contact Us
                  </Typography>
                  <motion.img 
                    src="/texticon.png" 
                    alt="icon" 
                    style={{ width: 50, height: 50 }} 
                    whileHover={{ rotate: -360 }}
                    transition={{ duration: 0.5 }}
                  />
                </Typography>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Typography variant="h6" sx={{ mt: 2, opacity: 0.9 }}>
                  Get in touch with us for any questions about our sacred pooja items
                </Typography>
              </motion.div>
            </BannerOverlay>
          </BannerSection>
        </motion.div>

        {/* Form Section with Background Image */}
        <Box sx={{ 
          backgroundImage: 'url(/img1.jpg)', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          py: 8
        }}>
          <Container maxWidth="lg">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <Typography
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={4}
                bgcolor={"rgba(255, 153, 29, 0.29)"}
                p={2}
                borderRadius={2}
                mb={4}
              >
                <motion.img 
                  src="/texticon.png" 
                  alt="icon" 
                  style={{ width: 40, height: 40 }} 
                  whileHover={{ scale: 1.2 }}
                />
                <Typography variant="h3" sx={{ fontWeight: 600, letterSpacing: "1px", color: "#ffffffff" }}>
                  Send Us a Message
                </Typography>
                <motion.img 
                  src="/texticon.png" 
                  alt="icon" 
                  style={{ width: 40, height: 40 }} 
                  whileHover={{ scale: 1.2 }}
                />
              </Typography>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  maxWidth: 800,
                  mx: "auto",
                  p: { xs: 2, sm: 4 },
                  bgcolor: "rgba(0, 0, 0, 0.7)",
                  borderRadius: 4,
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
                }}
              >
                <Grid  spacing={3}>
                  {/* Name */}
                  <Grid item xs={12} sm={6}>
                    <FormLabel
                      sx={{
                        mb: 1,
                        display: "block",
                        fontWeight: 600,
                        color: "#fff",
                      }}
                    >
                      Your Name
                    </FormLabel>
                    <TextField
                      required
                      fullWidth
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      variant="outlined"
                      InputProps={{
                        style: { color: "#fff" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.5)",
                          },
                          "&:hover fieldset": {
                            borderColor: "#FF8E53",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#FE6B8B",
                          },
                        },
                      }}
                    />
                  </Grid>

                  {/* Email */}
                  <Grid item xs={12} sm={6}>
                    <FormLabel
                      sx={{
                        mb: 1,
                        display: "block",
                        fontWeight: 600,
                        color: "#fff",
                      }}
                    >
                      Email Address
                    </FormLabel>
                    <TextField
                      required
                      fullWidth
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      variant="outlined"
                      InputProps={{
                        style: { color: "#fff" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.5)",
                          },
                          "&:hover fieldset": {
                            borderColor: "#FF8E53",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#FE6B8B",
                          },
                        },
                      }}
                    />
                  </Grid>

                  {/* Mobile */}
                  <Grid item xs={12}>
                    <FormLabel
                      sx={{
                        mb: 1,
                        display: "block",
                        fontWeight: 600,
                        color: "#fff",
                      }}
                    >
                      Mobile Number
                    </FormLabel>
                    <TextField
                      required
                      fullWidth
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      variant="outlined"
                      InputProps={{
                        style: { color: "#fff" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.5)",
                          },
                          "&:hover fieldset": {
                            borderColor: "#FF8E53",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#FE6B8B",
                          },
                        },
                      }}
                    />
                  </Grid>

                  {/* Message */}
                  <Grid item xs={12}>
                    <FormLabel
                      sx={{
                        mb: 1,
                        display: "block",
                        fontWeight: 600,
                        color: "#fff",
                      }}
                    >
                      Your Message
                    </FormLabel>
                    <TextField
                      required
                      fullWidth
                      multiline
                      rows={4}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      variant="outlined"
                      InputProps={{
                        style: { color: "#fff" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.5)",
                          },
                          "&:hover fieldset": {
                            borderColor: "#FF8E53",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#FE6B8B",
                          },
                        },
                      }}
                    />
                  </Grid>

                  {/* Button */}
                  <Grid item xs={12} mt={2}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        sx={{
                          py: 1.5,
                          fontSize: "1.1rem",
                          background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                          boxShadow: "0 4px 15px rgba(254, 107, 139, 0.5)",
                          borderRadius: 2,
                          fontWeight: 600,
                        }}
                      >
                        Send Message
                      </Button>
                    </motion.div>
                  </Grid>
                </Grid>
              </Box>
            </motion.div>
          </Container>
        </Box>

        {/* Branch Locations */}
        <Container maxWidth="lg" sx={{ my: 8 }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            <Typography
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={2}
              bgcolor="#FF8E53"
              color="white"
              p={2}
              borderRadius={2}
              mb={6}
            >
              <motion.img 
                src="/texticon.png" 
                alt="icon" 
                style={{ width: 40, height: 40 }} 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              />
              <Typography variant="h3" sx={{ fontWeight: 600, letterSpacing: "1px" }}>
                Our Branches
              </Typography>
              <motion.img 
                src="/texticon.png" 
                alt="icon" 
                style={{ width: 40, height: 40 }} 
                whileHover={{ rotate: -360 }}
                transition={{ duration: 0.5 }}
              />
            </Typography>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <Grid display={"flex"} flexWrap="wrap" justifyContent={'space-evenly'} spacing={4}>
              {branches.map((branch) => (
                <Grid item xs={12} md={6} key={branch.id}>
                  <motion.div variants={fadeInUp}>
                    <Card
                      onClick={() => setSelectedBranch(branch)}
                      sx={{
                        cursor: "pointer",
                        border: selectedBranch.id === branch.id ? "2px solid" : "1px solid #e0e0e0",
                        borderColor: selectedBranch.id === branch.id ? "primary.main" : "transparent",
                        borderRadius: 3,
                        boxShadow: 4,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: 8,
                          transform: "translateY(-5px)",
                        },
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {/* Decorative Top Icon/Header */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "#FF9A00",
                          color: "#fff",
                          p: 2,
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                        }}
                      >
                        <LocationOnIcon sx={{ fontSize: 32, mr: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {branch.name}
                        </Typography>
                      </Box>

                      <CardContent sx={{ p: 3, flexGrow: 1 }}>
                        {/* Address */}
                        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                          <LocationOnIcon fontSize="small" sx={{ mr: 1, color: "primary.main", mt: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            {branch.address}
                          </Typography>
                        </Box>

                        {/* Phone */}
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <PhoneIcon fontSize="small" sx={{ mr: 1, color: "success.main" }} />
                          <Typography variant="body2" color="text.secondary">
                            {branch.phone}
                          </Typography>
                        </Box>

                        {/* Email */}
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <EmailIcon fontSize="small" sx={{ mr: 1, color: "info.main" }} />
                          <Typography variant="body2" color="text.secondary">
                            {branch.email}
                          </Typography>
                        </Box>

                        {/* Hours */}
                        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                          <ScheduleIcon fontSize="small" sx={{ mr: 1, color: "warning.main" }} />
                          <Typography variant="body2" color="text.secondary">
                            {branch.hours}
                          </Typography>
                        </Box>

                        {/* Action Chip */}
                        <Chip
                          label="View on Map"
                          size="small"
                          color="warning"
                          variant={selectedBranch.id === branch.id ? "filled" : "outlined"}
                          sx={{
                            fontWeight: 600,
                            mt: "auto",
                            alignSelf: "flex-start",
                          }}
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          {/* Map Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <Box
              sx={{
                mt: 6,
                p: 3,
                bgcolor: "background.paper",
                borderRadius: 3,
                boxShadow: 4,
              }}
            >
              <Typography
                variant="h4"
                component="h3"
                gutterBottom
                sx={{ mb: 3, fontWeight: 700, textAlign: "center", color: "warning.main" }}
              >
                {selectedBranch.name} - Location
              </Typography>

              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: { xs: 300, sm: 400, md: 450 },
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: 3,
                }}
              >
                <iframe
                  src={selectedBranch.mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Google Map for ${selectedBranch.name}`}
                ></iframe>
              </Box>
            </Box>
          </motion.div>
        </Container>

        {/* Success Snackbar */}
        <Snackbar 
          open={openSnackbar} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar} 
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert 
              onClose={handleCloseSnackbar} 
              severity="success" 
              sx={{ 
                width: "100%",
                boxShadow: 3,
                borderRadius: 2
              }}
            >
              Thank you for your message! We will get back to you soon.
            </Alert>
          </motion.div>
        </Snackbar>
      </Box>
      <FeaturesSection/>
      <Footer/>
    </>
  );
};

export default ContactPage;