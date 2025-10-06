"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/redux/slice/CategoryFileMakeSlice";
import { fetchProducts } from "@/redux/slice/productSlice";

export default function CategorySidebar() {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);

  // Redux state
  const categoriesState = useSelector((state) => state.categoryReducer) || {};
  const categories = categoriesState.items || [];
  const status = categoriesState.status || "idle";
  const error = categoriesState.error || null;

  const productsState = useSelector((state) => state.products) || {};
  const products = productsState.items || [];

  useEffect(() => {
    if (status === "idle") dispatch(fetchCategories());
    if (productsState.status === "idle") dispatch(fetchProducts());
  }, [dispatch, status, productsState.status]);

  const handleChange = (categoryId) => (event, isExpanded) => {
    setExpanded(isExpanded ? categoryId : false);
  };

  if (status === "loading") return <CircularProgress />;
  if (status === "failed") return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
        Categories
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {categories.map((category) => (
        <Accordion
          key={category._id}
          expanded={expanded === category._id}
          onChange={handleChange(category._id)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{category.category_name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {products
              .filter((p) => {
                // filter products by category
                return (
                  p.categories?.some(
                    (c) => c._id === category._id || c === category.category_name
                  )
                );
              })
              .map((product) => (
                <Typography key={product._id} sx={{ pl: 2, py: 0.5 }}>
                  {product.product_name}
                </Typography>
              ))}
          </AccordionDetails>
        </Accordion>
      ))}

      {categories.length === 0 && status === "succeeded" && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
          No categories available
        </Typography>
      )}
    </Box>
  );
}
