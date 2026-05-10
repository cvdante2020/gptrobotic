import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import EarningsSection from "@/components/landing/EarningsSection";
import CalculatorSection from "@/components/landing/CalculatorSection";
import StepsSection from "@/components/landing/StepsSection";
import RegisterSection from "@/components/landing/RegisterSection";
import OtherSolutions from "@/components/landing/OtherSolutions";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
      <Navbar />
      <HeroSection />
      <EarningsSection />
      <CalculatorSection />
      <StepsSection />
      <RegisterSection />
      <OtherSolutions />
      <Footer />
    </main>
  );
}
