"use client";
import React from "react";
import {
  Container,
  Typography,
  Box,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  alpha,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// 🎨 Colors
const colors = {
  primary: "#2C3E50",
  secondary: "#34495E",
  accent: "#E67E22",
  gold: "#F39C12",
  cream: "#ECF0F1",
  sage: "#27AE60",
};

// 🌄 Hero Banner
const HeroSection = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "60vh",
  minHeight: 400,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: `linear-gradient(135deg, rgba(44,62,80,0.85), rgba(52,73,94,0.9)), url('https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1920&q=80') center/cover`,
  overflow: "hidden",
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "url('https://images.unsplash.com/photo-1543857778-c4a1a569e7bd?auto=format&fit=crop&w=1920&q=80') center/cover",
    opacity: 0.15,
    mixBlendMode: "overlay",
  },
}));

// Accordion styling
const FAQAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: 12,
  border: `1px solid ${alpha(colors.primary, 0.1)}`,
  background: "rgba(255,255,255,0.95)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  "&:before": { display: "none" },
  "&.Mui-expanded": {
    margin: `${theme.spacing(1)} 0`,
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  },
  transition: "all 0.3s ease",
}));

// Decorative elements
const FloatingIncense = styled(Box)({
  position: "absolute",
  width: 120,
  height: 120,
  opacity: 0.1,
  background: "url('https://images.unsplash.com/photo-1601580519012-77ea84d71c48?auto=format&fit=crop&w=400&q=80') center/contain no-repeat",
  animation: "float 15s infinite ease-in-out",
  "@keyframes float": {
    "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
    "50%": { transform: "translateY(-20px) rotate(5deg)" },
  },
});

// Animations
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const staggerContainer = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const FAQPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // 📝 FAQs Array
  const faqs = [
    {
      q: "What types of incense products do you sell?",
      a: "We offer a wide variety of incense products including traditional incense sticks, cones, dhoop, and pooja essentials. Our products are crafted with natural ingredients like sandalwood, rose, jasmine, lavender, and pure essential oils to enhance your spiritual and meditation practices.",
    },
    {
      q: "Are your incense products natural and safe?",
      a: "Absolutely! All our incense products are made with natural herbs, resins, and essential oils. They are eco-friendly, free from toxic chemicals, and completely safe for meditation, pooja rituals, and aromatherapy. We prioritize your health and environmental sustainability.",
    },
    {
      q: "How should I safely burn incense?",
      a: "For safe burning, always use a proper incense holder or burner. Place it on a heat-resistant surface away from flammable materials. Keep out of reach of children and pets, ensure proper ventilation, and never leave burning incense unattended.",
    },
    {
      q: "How long does an incense stick burn?",
      a: "Our incense sticks typically burn between 30-45 minutes depending on the specific product, size, and ingredients. Some larger specialty sticks may burn for up to 60 minutes.",
    },
    {
      q: "Do you ship incense across India?",
      a: "Yes, we deliver to over 500+ cities across India. All orders come with real-time tracking updates. Standard delivery takes 3-7 business days, with express options available for major metropolitan areas.",
    },
    {
      q: "What is your return policy?",
      a: "We accept returns within 7 days of delivery for damaged, defective, or incorrect products. Please contact us with proof (photos/video) within 48 hours of receiving your order to initiate the return process.",
    },
    {
      q: "Can I cancel my order?",
      a: "You can cancel your order anytime before it has been dispatched. Once your order has been shipped, cancellations are not possible but you may return the products following our return policy upon receipt.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major payment methods including UPI, Net Banking, Debit/Credit cards, and popular Wallets through secure payment gateways. All transactions are encrypted for security, and we never store your card details.",
    },
    {
      q: "How can I contact RR Traders?",
      a: "You can reach us via email at 📩 support@rrtraders.com or call us at 📞 +91 9876543210 during business hours (9 AM - 6 PM, Monday to Saturday). Our dedicated support team responds to all inquiries within 24 hours.",
    },
    {
      q: "Do you offer wholesale or bulk pricing?",
      a: "Yes, we offer special wholesale pricing for bulk orders, religious institutions, and retail partners. Please contact our wholesale department at wholesale@rrtraders.com for customized pricing and options.",
    },
    {
      q: "How should I store my incense products?",
      a: "Store your incense in a cool, dry place away from direct sunlight to preserve their fragrance and quality. Keep them in their original packaging or an airtight container to maintain their aroma until use.",
    },
  ];

  return (
    <>
      <Navbar />

      {/* 🌄 Hero */}
      <HeroSection>
        <FloatingIncense style={{ top: "15%", left: "10%" }} />
        <FloatingIncense style={{ bottom: "20%", right: "15%", animationDelay: "2s" }} />
        <FloatingIncense style={{ top: "30%", right: "20%", animationDelay: "4s", transform: "scale(0.8)" }} />
        
        <Container maxWidth="lg">
          <Box textAlign="center" color="#fff" position="relative" zIndex={1}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <Chip
                  label="❓ Frequently Asked Questions"
                  sx={{
                    bgcolor: "rgba(230, 126, 34, 0.8)",
                    color: "#fff",
                    fontWeight: 600,
                    mb: 3,
                    py: 2,
                    px: 1,
                    fontSize: isMobile ? "0.9rem" : "1rem",
                  }}
                />
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Typography
                  variant={isMobile ? "h3" : "h2"}
                  fontWeight={900}
                  textShadow="2px 2px 8px rgba(0,0,0,0.5)"
                  sx={{ 
                    background: "linear-gradient(45deg, #fff, #f39c12)",
                    backgroundClip: "text",
                    textFillColor: "transparent",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  RR Traders – FAQ
                </Typography>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Typography
                  variant="h6"
                  maxWidth="700px"
                  mx="auto"
                  mt={2}
                  sx={{ 
                    opacity: 0.95,
                    textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
                  }}
                >
                  Find answers to all your questions about our premium incense products, ordering process, delivery, and more. Your spiritual journey made simpler.
                </Typography>
              </motion.div>
            </motion.div>
          </Box>
        </Container>
      </HeroSection>

      {/* FAQ Section */}
      <Box 
        sx={{ 
          py: 8, 
          background: "url('https://images.unsplash.com/photo-1519817914152-22d216bb9170?auto=format&fit=crop&w=1920&q=80') center/cover fixed",
          position: "relative",
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(236, 240, 241, 0.92)",
          }
        }}
      >
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h4"
            align="center"
            fontWeight={800}
            color={colors.primary}
            mb={4}
            sx={{ textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}
          >
            Common Questions
          </Typography>
          <Divider
            sx={{
              width: 120,
              height: 4,
              bgcolor: colors.accent,
              mx: "auto",
              borderRadius: 2,
              mb: 6,
            }}
          />
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {faqs.map((item, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <FAQAccordion>
                  <AccordionSummary 
                    expandIcon={<ExpandMoreIcon sx={{ color: colors.accent }} />}
                    sx={{
                      "&:hover": {
                        backgroundColor: alpha(colors.accent, 0.05),
                      },
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, color: colors.primary, pr: 2 }}>
                      {item.q}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography sx={{ color: colors.secondary, lineHeight: 1.7, fontSize: "1.05rem" }}>
                      {item.a}
                    </Typography>
                  </AccordionDetails>
                </FAQAccordion>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Box>

      {/* Additional Help Section */}
      <Box sx={{ py: 6, bgcolor: alpha(colors.primary, 0.03) }}>
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h5" fontWeight={700} color={colors.primary} gutterBottom>
              Still Have Questions?
            </Typography>
            <Typography variant="body1" color={colors.secondary} sx={{ mb: 3, maxWidth: 600, mx: "auto" }}>
              Can't find the answer you're looking for? Please reach out to our friendly customer support team.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Chip
                label="📧 Email: support@rrtraders.com"
                sx={{ 
                  bgcolor: alpha(colors.sage, 0.15), 
                  color: colors.primary, 
                  fontWeight: 600, 
                  p: 2, 
                  m: 1,
                  fontSize: "1.05rem"
                }}
              />
              <Chip
                label="📞 Phone: +91 9876543210"
                sx={{ 
                  bgcolor: alpha(colors.accent, 0.15), 
                  color: colors.primary, 
                  fontWeight: 600, 
                  p: 2, 
                  m: 1,
                  fontSize: "1.05rem"
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      <Footer />
    </>
  );
};

export default FAQPage;