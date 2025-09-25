"use client";
import React from "react";
import { Container, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const ReturnPolicy = () => {
  return (
    <>
      <Navbar />

      {/* Hero Banner */}
      <Box
        sx={{
          position: "relative",
          height: { xs: 200, md: 300 },
          backgroundImage: "url('/return-banner.jpg')",
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
            <Typography variant="h3" color="#ffffff82" fontWeight={700}>
              Return & Refund Policy
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
            At <strong>RR Traders</strong>, customer satisfaction is our
            priority. If you are not fully satisfied with your purchase, our
            Return Policy ensures a smooth process:
          </Typography>

          <Typography variant="body1" paragraph>
            🔹 Returns are accepted within <strong>7 days</strong> of delivery
            for unused and unopened incense products.  
            🔹 To request a return, please contact us with your order details.  
            🔹 Items must be in original packaging and condition.  
            🔹 Once inspected, approved refunds will be issued to your original
            payment method.  
            🔹 Shipping charges are non-refundable. Return shipping costs must
            be borne by the customer unless the product was defective or
            damaged.  
            🔹 We do not accept returns for partially used or opened items due
            to hygiene and fragrance sensitivity reasons.
          </Typography>

          <Typography variant="body1" paragraph>
            📩 For return requests: anbu77661@gmail.com , anburad86388@gmail.com
          </Typography>
        </motion.div>
      </Container>

      <Footer />
    </>
  );
};

export default ReturnPolicy;
