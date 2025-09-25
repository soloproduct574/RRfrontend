"use client";
import React from "react";
import { Container, Typography, Box, List, ListItem, ListItemText } from "@mui/material";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />

      {/* Hero Banner */}
      <Box
        sx={{
          position: "relative",
          height: { xs: 200, md: 300 },
          backgroundImage: "url('/privacypolicy.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.65))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Typography variant="h3" color="#fff" fontWeight={700}>
              Privacy Policy
            </Typography>
          </motion.div>
        </Box>
      </Box>

      {/* Content */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Typography variant="body1" paragraph>
            At <strong>RR Traders</strong>, we respect your privacy. This policy
            explains how we collect, use, and protect your information when you
            visit our website or purchase our incense and related products.
          </Typography>

          <List>
            <ListItem>
              <ListItemText
                primary="1. Information We Collect"
                secondary="We may collect personal details such as your name, email, phone number, billing and shipping address when you place an order or contact us."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="2. How We Use Your Information"
                secondary="Your information is used to process orders, provide customer support, and send important updates regarding your purchases."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="3. Cookies & Tracking"
                secondary="Our website may use cookies to improve your browsing experience. You can disable cookies in your browser settings."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="4. Data Security"
                secondary="We use secure payment gateways and industry-standard practices to protect your personal information from unauthorized access."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="5. Third-Party Sharing"
                secondary="We do not sell or rent your personal information. Data may be shared only with trusted service providers (e.g., delivery partners, payment processors)."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="6. Your Rights"
                secondary="You may request access, correction, or deletion of your data at any time by contacting us directly."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="7. Updates to This Policy"
                secondary="We may update this Privacy Policy from time to time. Changes will be posted on this page."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="8. Contact Us"
                secondary="If you have any questions about our Privacy Policy, please email us at anbu77661@gmail.com , anburad86388@gmail.com."
              />
            </ListItem>
          </List>
        </motion.div>
      </Container>

      <Footer />
    </>
  );
};

export default PrivacyPolicy;
