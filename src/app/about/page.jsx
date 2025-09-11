"use client";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  alpha,
  useTheme,
  useMediaQuery,
  Chip,
  Divider
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";

// Professional Color Palette
const colors = {
  primary: '#2C3E50',
  secondary: '#34495E',
  accent: '#E67E22',
  gold: '#F1C40F',
  sage: '#95A5A6',
  cream: '#ECF0F1',
  darkGray: '#2C3E50',
  lightGray: '#BDC3C7'
};

// Modern Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  background: `linear-gradient(135deg, 
    rgba(44, 62, 80, 0.95) 0%, 
    rgba(52, 73, 94, 0.9) 50%, 
    rgba(44, 62, 80, 0.95) 100%), 
    url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover fixed`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 30% 70%, rgba(230, 126, 34, 0.1) 0%, transparent 50%)',
    zIndex: 1,
  }
}));

const ModernSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(12, 0),
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(8, 0),
  },
}));

const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: 20,
  padding: theme.spacing(3),
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    background: 'rgba(255, 255, 255, 0.15)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  }
}));

const ProfessionalCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 16,
  background: '#FFFFFF',
  border: 'none',
  boxShadow: '0 4px 20px rgba(44, 62, 80, 0.08)',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: `linear-gradient(90deg, ${colors.accent}, ${colors.gold})`,
    transform: 'scaleX(0)',
    transformOrigin: 'left',
    transition: 'transform 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(44, 62, 80, 0.12)',
    '&::before': {
      transform: 'scaleX(1)',
    },
    '& .card-icon': {
      transform: 'scale(1.1)',
      background: `linear-gradient(135deg, ${colors.accent}, ${colors.gold})`,
    }
  }
}));

const IconContainer = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 24px',
  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
  transition: 'all 0.3s ease',
  fontSize: '2rem',
}));

const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
  border: `1px solid ${alpha(colors.primary, 0.1)}`,
  borderRadius: 16,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(45deg, ${alpha(colors.accent, 0.05)}, transparent)`,
    zIndex: 0,
  },
  '& > *': {
    position: 'relative',
    zIndex: 1,
  }
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: 20,
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, 
      ${alpha(colors.primary, 0.3)} 0%, 
      transparent 50%, 
      ${alpha(colors.accent, 0.2)} 100%)`,
    zIndex: 2,
  },
  '&:hover': {
    '&::before': {
      background: `linear-gradient(135deg, 
        ${alpha(colors.primary, 0.1)} 0%, 
        transparent 50%, 
        ${alpha(colors.accent, 0.1)} 100%)`,
    },
    '& img': {
      transform: 'scale(1.05)',
    }
  },
  '& img': {
    transition: 'transform 0.4s ease',
  }
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.gold} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  display: 'inline-block',
  fontWeight: 700,
}));

const FloatingParticle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: `linear-gradient(135deg, ${alpha(colors.accent, 0.1)}, ${alpha(colors.gold, 0.05)})`,
  animation: 'float 8s ease-in-out infinite',
  '@keyframes float': {
    '0%, 100%': { 
      transform: 'translateY(0px) rotate(0deg)',
      opacity: 0.5,
    },
    '50%': { 
      transform: 'translateY(-30px) rotate(180deg)',
      opacity: 0.8,
    }
  }
}));

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.25, 0.46, 0.45, 0.94]
    } 
  }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.25, 0.46, 0.45, 0.94]
    } 
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 100 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.25, 0.46, 0.45, 0.94]
    } 
  }
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const AboutUsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Professional commitment data
  const commitments = [
    {
      icon: "🌿",
      title: "Premium Natural Ingredients",
      description: "Sourced sandalwood, jasmine, rose, and frankincense from certified organic suppliers across India.",
      color: colors.accent
    },
    {
      icon: "🏭",
      title: "Traditional Craftsmanship",
      description: "Hand-rolled by skilled artisans using 500-year-old techniques passed down through generations.",
      color: colors.gold
    },
    {
      icon: "♻️",
      title: "Sustainable Practices",
      description: "Eco-friendly bamboo cores, recyclable packaging, and carbon-neutral shipping methods.",
      color: colors.sage
    },
    {
      icon: "🧘",
      title: "Therapeutic Excellence",
      description: "Aromatherapy-grade fragrances scientifically formulated for meditation and stress relief.",
      color: colors.primary
    }
  ];

  const stats = [
    { number: "50,000+", label: "Happy Customers", icon: "👥" },
    { number: "100+", label: "Fragrance Varieties", icon: "🌸" },
    { number: "15+", label: "Years Experience", icon: "⭐" },
    { number: "500+", label: "Cities Delivered", icon: "🚚" }
  ];

  return (
    <>
      <Navbar />
      
      {/* Floating Background Elements */}
      <FloatingParticle sx={{ top: '10%', left: '5%', width: 120, height: 120, animationDelay: '0s' }} />
      <FloatingParticle sx={{ top: '20%', right: '10%', width: 80, height: 80, animationDelay: '-2s' }} />
      <FloatingParticle sx={{ bottom: '30%', left: '8%', width: 60, height: 60, animationDelay: '-4s' }} />
      <FloatingParticle sx={{ bottom: '10%', right: '15%', width: 100, height: 100, animationDelay: '-6s' }} />
      
      {/* Modern Hero Section */}
      <HeroSection>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <Box textAlign="center">
              <motion.div variants={fadeInUp}>
                <Chip 
                  label="Est. 2008 • Premium Incense Crafters"
                  sx={{ 
                    mb: 3,
                    bgcolor: alpha('#FFFFFF', 0.2),
                    color: '#FFFFFF',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }}
                />
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <Typography 
                  variant={isMobile ? "h2" : "h1"} 
                  component="h1" 
                  sx={{ 
                    fontWeight: 800,
                    mb: 3,
                    color: '#FFFFFF',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2
                  }}
                >
                  About{' '}
                  <GradientText 
                    variant={isMobile ? "h2" : "h1"}
                    component="span"
                    sx={{ color: colors.gold }}
                  >
                    RR Traders
                  </GradientText>
                </Typography>
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <Typography 
                  variant={isMobile ? "h6" : "h5"} 
                  sx={{ 
                    maxWidth: 800,
                    mx: 'auto',
                    mb: 6,
                    color: alpha('#FFFFFF', 0.9),
                    lineHeight: 1.6,
                    fontWeight: 300
                  }}
                >
                  Crafting sacred fragrances that bridge ancient wisdom with modern living – 
                  transforming spaces into sanctuaries of peace and spiritual connection.
                </Typography>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <GlassCard sx={{ maxWidth: 600, mx: 'auto' }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#FFFFFF',
                      fontStyle: 'italic',
                      fontSize: '1.1rem'
                    }}
                  >
                    "Where every stick carries the essence of devotion, and every fragrance tells a story of tradition."
                  </Typography>
                </GlassCard>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </HeroSection>

      {/* Stats Section */}
      <ModernSection sx={{ 
        background: `linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)`,
        py: 8
      }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <Grid display={'flex'} justifyContent={'space-between'} spacing={4}>
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <motion.div variants={fadeInUp}>
                    <StatsCard elevation={0}>
                      <Typography 
                        variant="h2" 
                        sx={{ 
                          fontWeight: 800,
                          color: colors.primary,
                          mb: 1,
                          fontSize: { xs: '2rem', md: '2.5rem' }
                        }}
                      >
                        {stat.number}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: colors.secondary,
                          fontWeight: 500,
                          fontSize: '0.95rem'
                        }}
                      >
                        {stat.label}
                      </Typography>
                      <Box sx={{ fontSize: '1.5rem', mt: 1 }}>
                        {stat.icon}
                      </Box>
                    </StatsCard>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </ModernSection>

      {/* Story Section */}
      <ModernSection sx={{ bgcolor: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <Grid container spacing={8} alignItems="center">
              <Grid item xs={12} md={6}>
                <motion.div variants={slideInLeft}>
                  <Chip 
                    label="Our Heritage"
                    sx={{ 
                      mb: 3,
                      bgcolor: alpha(colors.accent, 0.1),
                      color: colors.accent,
                      fontWeight: 600
                    }}
                  />
                  
                  <Typography 
                    variant="h3" 
                    component="h2" 
                    sx={{ 
                      fontWeight: 700,
                      mb: 4,
                      color: colors.primary,
                      lineHeight: 1.3
                    }}
                  >
                    Fifteen Years of Sacred
                    <GradientText variant="h3" component="span" sx={{ ml: 1 }}>
                      Craftsmanship
                    </GradientText>
                  </Typography>
                  
                  <Typography 
                    variant="body1" 
                    paragraph 
                    sx={{ 
                      fontSize: '1.1rem', 
                      lineHeight: 1.8,
                      color: colors.secondary,
                      mb: 3
                    }}
                  >
                    Founded in 2008 with a vision to preserve India's ancient incense-making traditions, 
                    <strong> RR Traders</strong> has grown from a small family business into a trusted name 
                    in premium spiritual fragrances.
                  </Typography>
                  
                  <Typography 
                    variant="body1" 
                    paragraph
                    sx={{ 
                      fontSize: '1.1rem', 
                      lineHeight: 1.8,
                      color: colors.secondary,
                      mb: 4
                    }}
                  >
                    Our master craftsmen source the finest <strong>sandalwood from Mysore, jasmine from Tamil Nadu, 
                    and sacred frankincense from Oman</strong>, ensuring each stick delivers an authentic 
                    aromatic experience that connects you to centuries of spiritual practice.
                  </Typography>

                  <Paper
                    elevation={0}
                    sx={{ 
                      p: 3,
                      background: `linear-gradient(135deg, ${alpha(colors.accent, 0.05)}, ${alpha(colors.gold, 0.03)})`,
                      border: `2px solid ${alpha(colors.accent, 0.1)}`,
                      borderRadius: 3
                    }}
                  >
                    <Typography 
                      variant="h6"
                      sx={{ 
                        color: colors.primary,
                        fontWeight: 600,
                        mb: 1
                      }}
                    >
                      Our Promise
                    </Typography>
                    <Typography 
                      variant="body2"
                      sx={{ 
                        color: colors.secondary,
                        fontStyle: 'italic'
                      }}
                    >
                      Every product is a testament to purity, sustainability, and the timeless art of creating sacred spaces through fragrance.
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
              
              
            </Grid>
          </motion.div>
        </Container>
      </ModernSection>

      {/* Commitments Section */}
      <ModernSection sx={{ 
        background: `linear-gradient(135deg, #F8F9FA 0%, ${alpha(colors.cream, 0.5)} 100%)`
      }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <Box textAlign="center" mb={8}>
              <motion.div variants={fadeInUp}>
                <Chip 
                  label="Our Standards"
                  sx={{ 
                    mb: 3,
                    bgcolor: alpha(colors.primary, 0.1),
                    color: colors.primary,
                    fontWeight: 600
                  }}
                />
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <Typography 
                  variant="h3" 
                  component="h2" 
                  sx={{ 
                    fontWeight: 700,
                    mb: 3,
                    color: colors.primary
                  }}
                >
                  Excellence in Every
                  <GradientText variant="h3" component="span" sx={{ ml: 1 }}>
                    Detail
                  </GradientText>
                </Typography>
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    maxWidth: 700,
                    mx: 'auto',
                    color: colors.secondary,
                    lineHeight: 1.6,
                    fontWeight: 400
                  }}
                >
                  Our commitment to quality, authenticity, and environmental responsibility sets us apart
                </Typography>
              </motion.div>
            </Box>

            <Grid display={'flex'}  gap={4} spacing={4}>
              {commitments.map((item, index) => (
                <Grid item xs={12} sm={6} lg={3} key={index} >
                  <motion.div variants={fadeInUp}>
                    <ProfessionalCard>
                      <CardContent sx={{ p: 4, textAlign: 'center', height: '100%' }}>
                        <IconContainer className="card-icon">
                          <span style={{ fontSize: '2rem' }}>{item.icon}</span>
                        </IconContainer>
                        
                        <Typography 
                          variant="h6" 
                          gutterBottom 
                          sx={{ 
                            fontWeight: 700,
                            mb: 2,
                            color: colors.primary,
                            minHeight: 60,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center'
                          }}
                        >
                          {item.title}
                        </Typography>
                        
                        <Divider sx={{ mb: 2, bgcolor: alpha(item.color, 0.2) }} />
                        
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: colors.secondary,
                            lineHeight: 1.6,
                            fontSize: '0.95rem'
                          }}
                        >
                          {item.description}
                        </Typography>
                      </CardContent>
                    </ProfessionalCard>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </ModernSection>

      {/* Mission Section */}
      <ModernSection sx={{ 
        bgcolor: colors.primary,
        color: '#FFFFFF',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("https://images.unsplash.com/photo-1528109966305-e7332f32eb40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.1,
          zIndex: 0,
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <Grid container spacing={8} alignItems="center">
             

              <Grid item xs={12} md={6}>
                <motion.div variants={slideInRight}>
                  <Chip 
                    label="Our Mission"
                    sx={{ 
                      mb: 3,
                      bgcolor: alpha('#FFFFFF', 0.2),
                      color: '#FFFFFF',
                      fontWeight: 600,
                      border: '1px solid rgba(255,255,255,0.3)'
                    }}
                  />
                  
                  <Typography 
                    variant="h3" 
                    component="h2" 
                    sx={{ 
                      fontWeight: 700,
                      mb: 4,
                      color: '#FFFFFF'
                    }}
                  >
                    Creating Sacred
                    <span style={{ color: colors.gold, marginLeft: '8px' }}>
                      Sanctuaries
                    </span>
                  </Typography>
                  
                  <Typography 
                    variant="h6" 
                    paragraph
                    sx={{ 
                      mb: 4,
                      color: alpha('#FFFFFF', 0.9),
                      lineHeight: 1.7,
                      fontWeight: 300
                    }}
                  >
                    To deliver the <strong>fragrance of purity</strong> that transforms every home into a temple of 
                    serenity, wellness, and divine connection – making spiritual practice accessible to everyone.
                  </Typography>

                  <Box sx={{ mb: 4 }}>
                    {['Premium Quality', 'Spiritual Wellness', 'Traditional Values', 'Modern Convenience'].map((value, index) => (
                      <Chip
                        key={index}
                        label={value}
                        sx={{
                          m: 0.5,
                          bgcolor: alpha('#FFFFFF', 0.1),
                          color: '#FFFFFF',
                          border: '1px solid rgba(255,255,255,0.2)',
                          '&:hover': {
                            bgcolor: alpha('#FFFFFF', 0.2)
                          }
                        }}
                      />
                    ))}
                  </Box>

                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 600,
                      color: colors.gold,
                      fontStyle: 'italic',
                      textAlign: 'center',
                      py: 3,
                      borderTop: '2px solid rgba(255,255,255,0.2)',
                      borderBottom: '2px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    "Lighting the path to peace, purity, and spiritual awakening"
                  </Typography>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </ModernSection>

      <Footer />
    </>
  );
};

export default AboutUsPage;
