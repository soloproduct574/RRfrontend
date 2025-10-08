"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PoojaBanner from "@/components/adverticebanner";
import HeroBanner from "@/components/herobanner";
import ProductsCarousel from "@/components/productsroundscroll";
import RotatingOffers from "@/components/rotatingtext";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FeaturesSection from "@/components/featuresContact";
import ProductCard from "@/components/productCard";
import { fetchProducts } from "../redux/slice/productSlice";
import VideoCards from "@/components/YoutubeVideo";
import ValuesSection from "@/components/ValueSection";

export default function Home() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts()); 
  }, [dispatch]);


  return (
    <>
      <Navbar />
      <HeroBanner />
      <RotatingOffers />
      <PoojaBanner />
      <ProductsCarousel />
      
      {/* Show loading or error if needed */}
      {loading && <p>Loading products...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <ProductCard /> 
      <VideoCards/>
      <ValuesSection/>
      <FeaturesSection />
      <Footer />
    </>
  );
}
