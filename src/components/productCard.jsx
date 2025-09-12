"use client";
import React, { useState, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  Chip,
  Skeleton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

const ProductCard = React.memo(({ 
  product,
  isLoading = false,
  onAddToCart,
  onBuyNow
}) => {
  console.log('🛍️ Rendering ProductCard:', product);

  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Early return for loading state
  if (isLoading) {
    return <ProductCardSkeleton />;
  }

  // Early return if no product data
  if (!product) {
    console.warn('⚠️ ProductCard: No product data provided');
    return null;
  }

  // ✅ Extract and validate product data based on your API structure
  const {
    _id: id,
    product_name: name,
    description,
    brands = [],
    categories = [],
    original_price,
    offer_price,
    percentage_discount: discount,
    product_images = [],
    product_videos = [],
    customerId,
    createdAt,
    updatedAt
  } = product;

  console.log('📦 Extracted product data:', {
    id, name, original_price, offer_price, discount, brands, categories
  });

  // ✅ Handle images from product_images array
  const productImages = useMemo(() => {
    if (product_images && product_images.length > 0) {
      return product_images;
    }
    return ["/logo.jpg", "/logo2.jpg", "/logo3.jpg"];
  }, [product_images]);

  // ✅ Handle brand display from brands array
  const brandName = useMemo(() => {
    if (Array.isArray(brands) && brands.length > 0) {
      const firstBrand = brands[0];
      return firstBrand.name || firstBrand.brand_name || firstBrand;
    }
    return "Divine Brand";
  }, [brands]);

  // ✅ Handle category display
  const categoryName = useMemo(() => {
    if (Array.isArray(categories) && categories.length > 0) {
      const firstCategory = categories[0];
      return firstCategory.name || firstCategory.category_name || firstCategory;
    }
    return "";
  }, [categories]);

  // ✅ Calculate prices - use offer_price if available, otherwise original_price
  const displayPrice = useMemo(() => {
    return offer_price || original_price || 0;
  }, [offer_price, original_price]);

  const originalPrice = useMemo(() => {
    return original_price || 0;
  }, [original_price]);

  // ✅ Format discount percentage
  const discountPercentage = useMemo(() => {
    return discount || 0;
  }, [discount]);

  // Memoized handlers
  const increaseQuantity = useCallback(() => {
    setQuantity(prev => prev + 1);
    console.log('➕ Quantity increased');
  }, []);

  const decreaseQuantity = useCallback(() => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
    console.log('➖ Quantity decreased');
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (productImages.length <= 1) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    let newIndex;
    if (x < width / 3) newIndex = 0;
    else if (x < (2 * width) / 3) newIndex = 1 % productImages.length;
    else newIndex = 2 % productImages.length;
    
    if (newIndex !== currentImageIndex) {
      console.log('🖼️ Image changed to index:', newIndex);
      setCurrentImageIndex(newIndex);
    }
  }, [productImages.length, currentImageIndex]);

  const handleMouseLeave = useCallback(() => {
    setCurrentImageIndex(0);
  }, []);

  const handleAddToCart = useCallback(() => {
    const cartData = { 
      id, 
      name, 
      quantity, 
      price: displayPrice,
      originalPrice,
      discount: discountPercentage,
      brand: brandName,
      category: categoryName,
      image: productImages[0]
    };
    
    if (onAddToCart) {
      onAddToCart(cartData);
    } else {
      console.log('🛒 Adding to cart:', cartData);
      alert(`${quantity} x ${name} added to cart 🛒`);
    }
  }, [id, name, quantity, displayPrice, originalPrice, discountPercentage, brandName, categoryName, productImages, onAddToCart]);

  const handleBuyNow = useCallback(() => {
    const purchaseData = { 
      id, 
      name, 
      quantity, 
      price: displayPrice,
      originalPrice,
      discount: discountPercentage,
      brand: brandName,
      category: categoryName,
      image: productImages[0]
    };
    
    if (onBuyNow) {
      onBuyNow(purchaseData);
    } else {
      console.log('💳 Proceeding to purchase:', purchaseData);
      alert(`Proceeding to buy ${quantity} x ${name} 💳`);
    }
  }, [id, name, quantity, displayPrice, originalPrice, discountPercentage, brandName, categoryName, productImages, onBuyNow]);

  const handleImageError = useCallback((e) => {
    console.warn('🖼️ Image failed to load:', e.target.src);
    e.target.src = "/logo.jpg";
  }, []);

  return (
    <Card
      sx={{
        width: 350,
        maxHeight: 650,
        borderRadius: "20px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        background: "white",
        position: "relative",
        overflow: "visible",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
        }
      }}
    >
      {/* Offer Tags */}
      {discountPercentage > 0 && (
        <Chip
          icon={<LocalOfferIcon />}
          label={`${Math.round(discountPercentage)}% OFF`}
          color="error"
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            fontWeight: "bold",
            borderRadius: "8px",
            zIndex: 2,
          }}
        />
      )}
      
      {offer_price && offer_price < original_price && (
        <Chip
          icon={<LocalOfferIcon />}
          label="Special Offer"
          size="small"
          sx={{
            position: "absolute",
            top: discountPercentage > 0 ? 50 : 12,
            left: 12,
            fontWeight: "bold",
            color: "white",
            borderRadius: "8px",
            zIndex: 2,
            backgroundColor: "#4caf50",
          }}
        />
      )}

      {/* Product Image */}
      <Box
        sx={{
          height: 350,
          width: "100%",
          overflow: "hidden",
          position: "relative",
          cursor: "pointer",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={productImages[currentImageIndex]}
          alt={name || "Product Image"}
          style={{ 
            maxWidth: "100%", 
            height: "100%", 
            objectFit: "cover",
            transition: "transform 0.3s ease",
          }}
          onError={handleImageError}
          loading="lazy"
        />
      </Box>

      {/* Product Details */}
      <CardContent sx={{ textAlign: "center", p: 2 }}>
        {/* Brand */}
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ 
            fontWeight: 600, 
            textTransform: "uppercase", 
            letterSpacing: "0.5px",
            display: "block",
            mb: 0.5
          }}
        >
          {brandName}
        </Typography>

        {/* Category */}
        {categoryName && (
          <Typography 
            variant="caption" 
            color="primary" 
            sx={{ 
              fontWeight: 500, 
              display: "block",
              mb: 0.5,
              fontSize: "0.7rem"
            }}
          >
            {categoryName}
          </Typography>
        )}

        {/* Product Name */}
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ 
            mb: 1, 
            color: "text.primary", 
            minHeight: "48px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
          title={name}
        >
          {name || "Product Name"}
        </Typography>

        {/* Description */}
        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ 
              mb: 2,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minHeight: "40px"
            }}
          >
            {description}
          </Typography>
        )}

        {/* Price Section */}
        <Box sx={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: 1, 
          alignItems: "baseline",
          mb: 2
        }}>
          {offer_price && offer_price < original_price && (
            <Typography 
              variant="body2" 
              sx={{ 
                textDecoration: "line-through", 
                color: "text.disabled"
              }}
            >
              ₹{originalPrice}
            </Typography>
          )}
          <Typography variant="h6" color="primary" fontWeight={700}>
            ₹{displayPrice}
          </Typography>
          {discountPercentage > 0 && (
            <Typography 
              variant="caption" 
              sx={{ 
                color: "success.main",
                fontWeight: 600,
                backgroundColor: "success.light",
                px: 0.5,
                py: 0.25,
                borderRadius: 0.5
              }}
            >
              Save {Math.round(discountPercentage)}%
            </Typography>
          )}
        </Box>

        {/* Quantity Selector */}
        <Box sx={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          gap: 2, 
          mb: 2
        }}>
          <IconButton 
            size="small" 
            onClick={decreaseQuantity} 
            sx={{ 
              border: "1px solid #ddd",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.04)",
                borderColor: "#bbb"
              }
            }}
            disabled={quantity <= 1}
          >
            <RemoveIcon />
          </IconButton>
          <Typography variant="h6" sx={{ minWidth: "24px", textAlign: "center" }}>
            {quantity}
          </Typography>
          <IconButton 
            size="small" 
            onClick={increaseQuantity} 
            sx={{ 
              border: "1px solid #ddd",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.04)",
                borderColor: "#bbb"
              }
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="contained"
            onClick={handleAddToCart}
            fullWidth
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              background: "linear-gradient(45deg,#ff9800,#f44336)",
              "&:hover": { 
                background: "linear-gradient(45deg,#f57c00,#d32f2f)",
                transform: "translateY(-1px)"
              },
              "&:active": {
                transform: "translateY(0px)"
              }
            }}
          >
            Add to Cart
          </Button>
          <Button
            variant="contained"
            onClick={handleBuyNow}
            fullWidth
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              background: "linear-gradient(45deg,#4caf50,#2e7d32)",
              "&:hover": { 
                background: "linear-gradient(45deg,#43a047,#1b5e20)",
                transform: "translateY(-1px)"
              },
              "&:active": {
                transform: "translateY(0px)"
              }
            }}
          >
            Buy Now
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
});

// Separate skeleton component for better performance
const ProductCardSkeleton = React.memo(() => (
  <Card sx={{ 
    maxWidth: 350, 
    borderRadius: "20px", 
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)" 
  }}>
    <Skeleton 
      variant="rectangular" 
      height={300} 
      sx={{ borderRadius: "20px 20px 0 0" }}
    />
    <CardContent sx={{ p: 2 }}>
      <Skeleton variant="text" width="60%" height={16} sx={{ mb: 0.5 }} />
      <Skeleton variant="text" width="40%" height={12} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="90%" height={24} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="100%" height={32} sx={{ mb: 2 }} />
      <Skeleton variant="text" width="50%" height={20} sx={{ mb: 2, mx: "auto" }} />
      <Skeleton variant="rectangular" width={120} height={40} sx={{ mx: "auto", mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Skeleton variant="rectangular" width="50%" height={40} />
        <Skeleton variant="rectangular" width="50%" height={40} />
      </Box>
    </CardContent>
  </Card>
));

ProductCard.displayName = 'ProductCard';
ProductCardSkeleton.displayName = 'ProductCardSkeleton';

export default ProductCard;
