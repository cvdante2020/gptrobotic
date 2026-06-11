import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import SolutionsSection from "@/components/landing/SolutionSection";
import TiendaGoPromo from "@/components/landing/TiendaGoPromo";
import ContactSection from "@/components/landing/ContactSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
      <Navbar />
      <HeroSection />
      <SolutionsSection />
      <TiendaGoPromo />
      <ContactSection />
      <Footer />
    </main>
  );
}
