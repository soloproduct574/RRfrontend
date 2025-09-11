
import React from "react";
import {
  Modal,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Divider,
  Button,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";

const ProductModal = ({ open, onClose, productId }) => {
  const { items, loading } = useSelector((state) => state.products);

  // Find product by id
  const product = items.find((p) => p._id === productId || p.id === productId);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          backgroundColor: "white",
          p: 3,
          borderRadius: 3,
          maxWidth: 700,
          mx: "auto",
          my: "5%",
          boxShadow: 24,
          position: "relative",
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : !product ? (
          <Typography textAlign="center" color="error">
            Product not found.
          </Typography>
        ) : (
          <>
            {/* Product Name */}
            <Typography variant="h5" fontWeight={700} textAlign="center">
              {product.product_name}
            </Typography>

            {/* Description */}
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ mt: 1 }}
            >
              {product.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Images Carousel */}
            {product.images?.length > 0 && (
              <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1 }}>
                {product.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={product.product_name}
                    style={{
                      maxHeight: 200,
                      borderRadius: "12px",
                      objectFit: "cover",
                    }}
                  />
                ))}
              </Box>
            )}

            {/* Categories & Brands */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
              {product.categories?.map((cat, i) => (
                <Chip key={i} label={cat.name} color="primary" size="small" />
              ))}
              {product.brands?.map((brand, i) => (
                <Chip key={i} label={brand.name} color="secondary" size="small" />
              ))}
            </Box>

            {/* Price Section */}
            <Typography
              variant="h6"
              color="primary"
              fontWeight={700}
              textAlign="center"
              sx={{ mt: 2 }}
            >
              ₹{product.offer_price}{" "}
              <span style={{ textDecoration: "line-through", color: "gray" }}>
                ₹{product.original_price}
              </span>
            </Typography>

            {/* Buttons */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button variant="contained" color="primary" sx={{ mr: 2 }}>
                Add to Cart
              </Button>
              <Button variant="contained" color="success">
                Buy Now
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default ProductModal;
