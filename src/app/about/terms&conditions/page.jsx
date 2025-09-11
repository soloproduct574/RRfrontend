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

const Terms = () => {
  return (
    <>
      <Navbar />

      {/* Hero Banner */}
      <Box
        sx={{
          position: "relative",
          height: { xs: 200, md: 300 },
          backgroundImage: "url('/image2.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(209, 170, 11, 0.27))",
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
              Terms & Conditions
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
            Welcome to <strong>RR Traders</strong>. By accessing or purchasing our incense
            and related products, you agree to the following terms:
          </Typography>

          <List>
            <ListItem>
              <ListItemText
                primary="1. Product Use"
                secondary="Our incense sticks, cones, and dhoop products are intended strictly for aromatic and spiritual purposes. They must not be consumed, inhaled directly, or used for medical treatment."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="2. Pricing & Availability"
                secondary="Prices are subject to change without prior notice. Availability of specific fragrances or product variants may vary depending on stock."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="3. Orders & Payments"
                secondary="Orders will be processed only after full payment is received through our accepted payment methods. We reserve the right to cancel or reject orders at our discretion."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="4. Shipping & Delivery"
                secondary="We aim to deliver within the estimated timelines, but delays may occur due to courier, customs, or natural circumstances beyond our control. We are not liable for such delays."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="5. Returns & Refunds"
                secondary="Due to the nature of incense and aromatic products, returns are only accepted for unopened, unused items reported within 7 days of delivery. Refunds, if approved, will be processed to the original payment method."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="6. Intellectual Property"
                secondary="All product names, designs, packaging, and branding are the intellectual property of RR Traders. Unauthorized use, reproduction, or distribution is prohibited."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="7. Liability"
                secondary="We are not responsible for any allergies, misuse, or damage resulting from improper handling of our incense products. Please use in a well-ventilated area and keep away from children and pets."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="8. Governing Law"
                secondary="All transactions and disputes will be subject to the jurisdiction of the courts in India."
              />
            </ListItem>
          </List>
        </motion.div>
      </Container>

      <Footer />
    </>
  );
};

export default Terms;
