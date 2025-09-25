"use client";

import { Box, Tooltip, IconButton, useTheme, useMediaQuery } from "@mui/material";
import Link from "next/link";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";

export default function SocialIcons() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const iconData = [
    { name: "Facebook", icon: <FacebookIcon fontSize="large" />, color: "#1877f2", link: "https://www.facebook.com/anburad75?mibextid=wwXIfr&rdid=qDvJ2TWqShmaIos1&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1EcxMC9dur%2F%3Fmibextid%3DwwXIfr#" },
    { name: "YouTube", icon: <YouTubeIcon fontSize="large" />, color: "#ff0000", link: "https://youtube.com/@rrtraders-s9k?si=AT9jewoWPTEUAei_" },
    { name: "Instagram", icon: <InstagramIcon fontSize="large" />, color: "#E4405F", link: "https://www.instagram.com/anbarasan.r746/?igsh=djZub2p6bHp3NjJv&utm_source=qr#" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 3,
        py: { xs: 2, md: 4 },
        flexWrap: "wrap",
      }}
    >
      {iconData.map((item, index) => (
        <Tooltip key={index} title={item.name} arrow>
          <Link href={item.link} target="_blank" rel="noopener noreferrer">
            <IconButton
              size={isMobile ? "medium" : "large"}
              sx={{
                bgcolor: "#fff",
                color: item.color,
                borderRadius: "50%",
                boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: item.color,
                  color: "#fff",
                  transform: "translateY(-4px) scale(1.1)",
                  boxShadow: `0 10px 20px ${item.color}55`,
                },
              }}
            >
              {item.icon}
            </IconButton>
          </Link>
        </Tooltip>
      ))}
    </Box>
  );
}
