"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createCategory, fetchCategories } from "../../redux/slice/CategoryFileMakeSlice";

const AddCategoryModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.categoryReducer);
  const [categoryName, setCategoryName] = useState("");
  const [images, setImages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      alert("Enter category name");
      return;
    }

    const formData = new FormData();
    formData.append("category_name", categoryName);
    images.forEach((image) => formData.append("category_images", image));

    await dispatch(createCategory(formData));
    await dispatch(fetchCategories());
    setCategoryName("");
    setImages([]);
    onClose(); // Close modal after submit
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: 3, p: 2, bgcolor: "#fff" },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
        Create New Category
      </DialogTitle>

      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 1 }}
          encType="multipart/form-data"
        >
          <TextField
            label="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            fullWidth
            required
            sx={{ mb: 3 }}
          />

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages([...e.target.files])}
            style={{ marginBottom: 20 }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          onClick={onClose}
          color="inherit"
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 2, px: 3 }}
        >
          {status === "loading" ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Save"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCategoryModal;
