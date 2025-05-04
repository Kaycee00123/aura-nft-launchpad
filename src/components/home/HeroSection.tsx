
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="py-20 md:py-28 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-aura-purple-light/20 via-white to-white -z-10" 
        aria-hidden="true"
      ></div>
      
      {/* Abstract shapes */}
      <div className="absolute top-32 right-10 w-64 h-64 bg-aura-purple/5 rounded-full blur-3xl -z-10" aria-hidden="true"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-aura-purple/10 rounded-full blur-3xl -z-10" aria-hidden="true"></div>
      
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Launch your NFT Collection with <span className="bg-gradient-to-r from-aura-purple to-aura-purple-dark bg-clip-text text-transparent">Aura</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Create, mint, and sell your digital collectibles on the most user-friendly NFT launchpad platform. No coding required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/dashboard/create">
                <Button size="lg" className="bg-aura-purple hover:bg-aura-purple-dark text-white px-6 py-6 text-lg">
                  Launch a Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/explore">
                <Button size="lg" variant="outline" className="border-aura-purple text-aura-purple hover:bg-aura-purple-light hover:text-aura-purple px-6 py-6 text-lg">
                  Explore Drops
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Main NFT image */}
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop"
                alt="Featured NFT"
                className="rounded-lg shadow-xl z-10 relative animate-float"
              />
              
              {/* Decorative NFT images */}
              <img
                src="https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?q=80&w=300&auto=format&fit=crop"
                alt="Decorative NFT"
                className="absolute -left-10 -bottom-10 w-40 h-40 rounded-lg shadow-lg rotate-[-10deg] z-20"
              />
              <img
                src="https://images.unsplash.com/photo-1635321593217-40050ad13c74?q=80&w=300&auto=format&fit=crop"
                alt="Decorative NFT"
                className="absolute -right-5 -top-5 w-32 h-32 rounded-lg shadow-lg rotate-[10deg] z-0"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
