"use client";
import React, { useState } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Grid,
  Paper,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Chip
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Navbar from "@/components/navbar";

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

const ContactFormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '12px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  background: '#f9f9f9',
  height: '100%'
}));

const BranchCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: '12px',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
  }
}));

const MapContainer = styled(Box)(({ theme }) => ({
  borderRadius: '12px',
  overflow: 'hidden',
  height: '500px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  marginTop: theme.spacing(4)
}));

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
      <Box sx={{ pt: 4 }}>
        {/* Banner Section */}
        <BannerSection>
          <img src="/herobaner.jpg" alt="Contact Us" />
          <BannerOverlay>
            <Typography
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              gap={2}
              mt={18}
            >
              <img src="/texticon.png" alt="icon" style={{ width: 50, height: 50 }} />
              <Typography variant="h3" sx={{ fontWeight: 600, letterSpacing: "1px", color: "#fff" }}>
                Contact Us
              </Typography>
              <img src="/texticon.png" alt="icon" style={{ width: 50, height: 50 }} />
            </Typography>
            <Typography variant="h6" sx={{ mt: 2, opacity: 0.9 }}>
              Get in touch with us for any questions about our sacred pooja items
            </Typography>
          </BannerOverlay>
        </BannerSection>

        {/* Form + Image Side by Side */}
        <Container maxWidth="lg" sx={{ mb: 8 }}>
          <Box display={"flex"} flexDirection={{ xs: "column", md: "row" }} justifyContent={"space-evenly"} spacing={4}>
            {/* Form Left */}
            <Box item xs={12} md={6}>
                <form onSubmit={handleSubmit}>
                  <Grid  spacing={3} maxWidth={600} >
                    <Grid item xs={12} sm={6}>
                      <TextField required  label="Your Name" name="name" value={formData.name} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField required fullWidth type="email" label="Email Address" name="email" value={formData.email} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField required fullWidth label="Mobile Number" name="mobile" value={formData.mobile} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField required fullWidth multiline rows={4} label="Your Message" name="message" value={formData.message} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12}>
                      <Button type="submit" variant="contained" size="large" fullWidth sx={{ py: 1.5, fontSize: '1.1rem' }}>
                        Send Message
                      </Button>
                    </Grid>
                  </Grid>
                </form>
            </Box>

            {/* Image Right */}
            <Box item xs={12} md={6} >
              <img src="/festivalbg.png" alt="Contact Illustration" style={{ width: "60%", height: "78%", objectFit: "cover", borderRadius: "12px" }} />
            </Box>
          </Box>
        </Container>

        {/* Branch Locations */}
        <Container maxWidth="lg" sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4, fontWeight: 600 }}>
            Our Branch Locations
          </Typography>

          <Grid container spacing={3}>
            {branches.map((branch) => (
              <Grid item xs={12} md={6} key={branch.id}>
                <BranchCard onClick={() => setSelectedBranch(branch)} sx={{ cursor: "pointer", border: selectedBranch.id === branch.id ? "2px solid" : "none", borderColor: selectedBranch.id === branch.id ? "primary.main" : "transparent" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {branch.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <LocationOnIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">{branch.address}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <PhoneIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">{branch.phone}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <ScheduleIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">{branch.hours}</Typography>
                    </Box>
                    <Chip label="View on Map" size="small" color="primary" variant={selectedBranch.id === branch.id ? "filled" : "outlined"} />
                  </CardContent>
                </BranchCard>
              </Grid>
            ))}
          </Grid>

          {/* Full Width Google Map */}
          <Typography variant="h5" component="h3" gutterBottom sx={{ mt: 6, mb: 2, fontWeight: 600 }}>
            {selectedBranch.name} - Location
          </Typography>
          <MapContainer>
            <iframe src={selectedBranch.mapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={`Google Map for ${selectedBranch.name}`}></iframe>
          </MapContainer>
        </Container>

        {/* Success Snackbar */}
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
            Thank you for your message! We will get back to you soon.
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default ContactPage;
