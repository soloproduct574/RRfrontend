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

export default function CategorySidebar({ products = [], onSelectCategory }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // ✅ Extract unique categories based on name (deduplicate even for Tamil or any text)
  const allCategories = useMemo(() => {
    const categoryMap = new Map();

    products.forEach((prod) => {
      prod.categories?.forEach((cat) => {
        const name = typeof cat === "object" ? cat.name || cat.category_name : cat;
        if (name && !categoryMap.has(name)) {
          categoryMap.set(name, { _id: cat._id, category_name: name });
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

      {allCategories.length ? (
        <RadioGroup
          value={selectedCategory}
          onChange={handleChange}
          sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
        >
          <FormControlLabel
            value="all"
            control={<Radio color="primary" />}
            label="All Categories"
          />
          {allCategories.map((cat) => (
            <FormControlLabel
              key={cat._id}
              value={cat._id}
              control={<Radio color="primary" />}
              label={cat.category_name}
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
