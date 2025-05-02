
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import DropCard from "@/components/DropCard";
import { mockNFTDrops } from "@/lib/mock-data";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const FeaturedDropsSection = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainer = useRef<HTMLDivElement>(null);

  const featuredDrops = mockNFTDrops.filter(drop => drop.status === 'active' || drop.status === 'upcoming');

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainer.current;
    if (!container) return;
    
    const cardWidth = 320; // approximate width of a card + gap
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
    
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    setScrollPosition(container.scrollLeft + scrollAmount);
  };

  return (
    <section className="py-16 md:py-24 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Drops</h2>
            <p className="text-gray-600">Explore the hottest NFT collections launching on Aura</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => scroll("left")}
              className="border-aura-purple text-aura-purple hover:bg-aura-purple-light"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => scroll("right")}
              className="border-aura-purple text-aura-purple hover:bg-aura-purple-light"
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Link to="/explore">
              <Button className="bg-white text-aura-purple border border-aura-purple hover:bg-aura-purple hover:text-white">
                View All
              </Button>
            </Link>
          </div>
        </div>

        {/* Scrollable container */}
        <div 
          ref={scrollContainer} 
          className="flex gap-6 overflow-x-auto pb-6 no-scrollbar"
          style={{ scrollBehavior: "smooth" }}
        >
          {featuredDrops.map((drop) => (
            <div key={drop.id} className="min-w-[300px] max-w-[300px]">
              <DropCard drop={drop} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDropsSection;
