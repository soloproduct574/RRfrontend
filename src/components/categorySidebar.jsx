"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Divider,
} from "@mui/material";

/**
 * Sidebar built from the products array.
 * No Redux call; categories come from product data.
 */
export default function CategorySidebar({ products = [], onSelectCategory }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // ✅ Extract unique categories from available products
  const allCategories = useMemo(() => {
    const categoryMap = new Map();

    products.forEach((prod) => {
      prod.categories?.forEach((cat) => {
        const id = typeof cat === "object" ? cat._id : cat;
        const name = typeof cat === "object" ? cat.name || cat.category_name : cat;
        if (id && name && !categoryMap.has(id)) {
          categoryMap.set(id, { _id: id, category_name: name });
        }
      });
    });

    return Array.from(categoryMap.values());
  }, [products]);

  // ✅ Category selection handler
  const handleChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    const selected =
      categoryId === "all"
        ? null
        : allCategories.find((c) => c._id === categoryId);
    if (onSelectCategory) onSelectCategory(selected);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 2,
        maxHeight: "90vh",
        overflowY: "auto",
        background: "linear-gradient(135deg, #fafafa, #ffffff)",
      }}
    >
      {/* Sidebar Title */}
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          textAlign: "center",
          fontWeight: 700,
          color: "#1976d2",
        }}
      >
        🛍 Categories
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Category Radio List */}
      {allCategories.length ? (
        <RadioGroup
          value={selectedCategory}
          onChange={handleChange}
          sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
        >
          {/* Always include "All" */}
          <FormControlLabel
            value="all"
            control={<Radio color="primary" />}
            label="All Categories"
            sx={{
              py: 0.3,
              borderRadius: 1,
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
          />

          {/* Generated category names */}
          {allCategories.map((cat) => (
            <FormControlLabel
              key={cat._id}
              value={cat._id}
              control={<Radio color="primary" />}
              label={cat.category_name}
              sx={{
                py: 0.3,
                borderRadius: 1,
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            />
          ))}
        </RadioGroup>
      ) : (
        <Typography align="center" color="text.secondary">
          No categories found
        </Typography>
      )}
    </Paper>
  );
}
