import PoojaBanner from "@/components/adverticebanner";
import HeroBanner from "@/components/herobanner";
import ProductCard from "@/components/productCard";
import ProductsCarousel from "@/components/productsroundscroll";
import RotatingOffers from "@/components/rotatingtext";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FeaturesSection from "@/components/featuresContact";

export default function Home() {
  return (
    <>
    <Navbar/>
    <HeroBanner/>
    <RotatingOffers/>
    <PoojaBanner/>
    <ProductsCarousel/>
    <ProductCard/>
    <FeaturesSection/>
    <Footer/>
    </>
   
  );
}
