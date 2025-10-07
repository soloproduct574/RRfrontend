"use client";
import React, { useState, useRef, useEffect } from "react";
import { IconButton, Box, Tooltip } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const SocialShare = ({ productName }) => {
  const [showIcons, setShowIcons] = useState(false);
  const containerRef = useRef(null);

  const toggleIcons = () => setShowIcons((prev) => !prev);

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this product: ${productName}`);

    switch (platform) {
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
        break;
      case "whatsapp":
        window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, "_blank");
        break;
      case "instagram":
        navigator.clipboard.writeText(window.location.href);
        alert("Product link copied for Instagram 📋");
        break;
      default:
        break;
    }
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowIcons(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Box ref={containerRef} sx={{ position: "relative" }}>
      {/* Main Share Button */}
      <IconButton onClick={toggleIcons}>
        <ShareIcon sx={{ color: "black" }} />
      </IconButton>

      {/* Social Icons */}
      {showIcons && (
        <Box
          sx={{
            position: "absolute",
            top: 40,
            right: 0,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            bgcolor: "background.paper",
            p: 1,
            borderRadius: "12px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
            zIndex: 10,
          }}
        >
          <Tooltip title="Facebook">
            <IconButton onClick={() => handleShare("facebook")} sx={{ color: "#1877f2" }}>
              <FacebookIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="WhatsApp">
            <IconButton onClick={() => handleShare("whatsapp")} sx={{ color: "#25d366" }}>
              <WhatsAppIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Instagram">
            <IconButton onClick={() => handleShare("instagram")} sx={{ color: "#e4405f" }}>
              <InstagramIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};
export default SocialShare;