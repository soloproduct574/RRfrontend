"use client";
import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { styled, keyframes } from "@mui/system";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import StarIcon from "@mui/icons-material/Star";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

// 🔥 Smooth infinite scroll animation (continuous right → left)
const scrollTicker = keyframes`
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

// Background gradient animation
const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Outer container
const TickerContainer = styled(Paper)(({ theme }) => ({
    background: "linear-gradient(270deg, #0f2027, #203a43, #2c5364)",
backgroundSize: "400% 400%",
animation: `${gradientShift} 15s ease infinite`,
// background: "linear-gradient(270deg, #667eea, #764ba2, #6B8DD6, #8E37D7)",
// backgroundSize: "400% 400%",
// animation: `${gradientShift} 18s ease infinite`,
  color: "white",
  height: "45px",
  width: "100%",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  borderRadius: 0,
  borderBottom: "1px solid rgba(255,255,255,0.3)",
  boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
}));

// Track holds the scrolling items
const TickerTrack = styled(Box)({
  display: "flex",
  whiteSpace: "nowrap",
  animation: `${scrollTicker} 25s linear infinite`, // slower for smoothness
});

// Single offer box
const OfferBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginRight: "60px", // space between offers
}));

const OfferText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "0.95rem",
  marginLeft: "6px",
  whiteSpace: "nowrap",
  textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
}));

// 💡 Offers with icons
const offers = [
  { text: "Special Weekend Sale - 25% OFF!", icon: <LocalOfferIcon /> },
  { text: "Free Shipping above $50 🚚", icon: <LocalShippingIcon /> },
  { text: "Buy One Get One Free 🎁", icon: <ShoppingBagIcon /> },
  { text: "Flash Sale - Limited time 🔥", icon: <WhatshotIcon /> },
  { text: "Exclusive Offer for New Users ⭐", icon: <StarIcon /> },
  { text: "Mega Clearance Sale up to 70% OFF", icon: <FlashOnIcon /> },
  { text: "Loyalty Rewards on Every Order 🏆", icon: <EmojiEventsIcon /> },
];

const RotatingOffers = () => {
  // duplicate array → concatenated → ensures infinite seamless scroll
  const loopedOffers = offers.concat(offers);

  return (
    <TickerContainer elevation={1}>
      <TickerTrack>
        {loopedOffers.map((offer, index) => (
          <OfferBox key={index}>
            {offer.icon}
            <OfferText variant="body1">{offer.text}</OfferText>
          </OfferBox>
        ))}
      </TickerTrack>
    </TickerContainer>
  );
};

export default RotatingOffers;
