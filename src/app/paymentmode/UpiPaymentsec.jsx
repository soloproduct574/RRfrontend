import React from "react";
import { Card, Box, Typography, Chip, IconButton, Button, Tooltip } from "@mui/material";
import { ContentCopy, Download, Payment } from "@mui/icons-material";
import { motion } from "framer-motion";
import FileDownload from "js-file-download";

const UpiPaymentSection = ({ total = 499 }) => {
  // UPI info
  const upiId = "8098264616@ptyes";
  const phoneNumber = "8098264616";
  const qrImageUrl = "/upiscanner.jpg"; // Replace with live QR from Cloud Storage or CDN

  // ✅ Handle Copy Function
  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard ✅`);
  };

  // ✅ Handle QR Download
  const handleDownloadQR = () => {
    fetch(qrImageUrl)
      .then((response) => response.blob())
      .then((blob) => FileDownload(blob, "UPI_QR_Code.jpg"));
  };

  // ✅ Handle Pay Now (Deep Link)
  const handlePayNow = () => {
    const upiLink = `upi://pay?pa=${encodeURIComponent(
      upiId
    )}&pn=Your%20Business%20Name&am=${encodeURIComponent(
      total.toFixed(2)
    )}&cu=INR&tn=Payment%20for%20Order`;
    window.location.href = upiLink;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <Card
        sx={{
          mt: 3,
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            p: 3,
            color: "white",
            textAlign: "center",
          }}
        >
          <Payment sx={{ fontSize: 32, mb: 1 }} />
          <Typography variant="h6" fontWeight="bold">
            Quick UPI Payment
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Pay ₹{total.toFixed(2)} securely via UPI
          </Typography>
        </Box>

        {/* Body */}
        <Box
          sx={{
            p: 3,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* QR Code */}
          <Box
            component="img"
            src={qrImageUrl}
            alt="UPI Scanner"
            sx={{
              width: 230,
              height: 230,
              borderRadius: 3,
              mb: 2,
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              objectFit: "cover",
              cursor: "pointer",
              transition: "0.3s",
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
            onClick={handleDownloadQR}
          />

          {/* QR Actions */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Tooltip title="Download QR Code">
              <IconButton color="primary" onClick={handleDownloadQR}>
                <Download />
              </IconButton>
            </Tooltip>
          </Box>

          {/* UPI ID */}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {upiId}
          </Typography>
          <Chip
            label={phoneNumber}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: "bold" }}
          />

          {/* Copy Buttons */}
          <Box sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<ContentCopy />}
              onClick={() => handleCopy(upiId, "UPI ID")}
            >
              Copy UPI ID
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<ContentCopy />}
              onClick={() => handleCopy(phoneNumber, "Phone Number")}
            >
              Copy Number
            </Button>
          </Box>

          {/* Pay Now */}
          <Button
            variant="contained"
            color="info"
            sx={{
              mt: 3,
              borderRadius: 3,
              px: 4,
              py: 1,
              fontWeight: "bold",
              textTransform: "none",
              boxShadow: "0 8px 20px rgba(79, 172, 254, 0.3)",
              "&:hover": {
                boxShadow: "0 10px 30px rgba(79,172,254,0.45)",
              },
            }}
            onClick={handlePayNow}
          >
            💸 Pay Now
          </Button>

          <Typography
            variant="caption"
            display="block"
            sx={{ mt: 2, color: "text.secondary" }}
          >
            After payment, please upload your screenshot below.
          </Typography>
        </Box>
      </Card>
    </motion.div>
  );
};

export default UpiPaymentSection;
