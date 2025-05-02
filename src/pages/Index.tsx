
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import FeaturedDropsSection from "@/components/home/FeaturedDropsSection";
import TopCreatorsSection from "@/components/home/TopCreatorsSection";
import StatsSection from "@/components/home/StatsSection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <HowItWorksSection />
        <FeaturedDropsSection />
        <TopCreatorsSection />
        <StatsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
