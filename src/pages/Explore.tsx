
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DropCard from "@/components/DropCard";
import { mockNFTDrops } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Slider 
} from "@/components/ui/slider";

type FilterState = {
  status: string;
  blockchain: string;
  priceRange: [number, number];
  search: string;
  sort: string;
};

const Explore = () => {
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    blockchain: "all",
    priceRange: [0, 0.2],
    search: "",
    sort: "newest",
  });

  // Filter drops based on the current filters
  const filteredDrops = mockNFTDrops.filter((drop) => {
    // Status filter
    if (filters.status !== "all" && drop.status !== filters.status) {
      return false;
    }
    
    // Blockchain filter
    if (filters.blockchain !== "all" && drop.blockchain !== filters.blockchain) {
      return false;
    }
    
    // Price range filter
    if (drop.price < filters.priceRange[0] || drop.price > filters.priceRange[1]) {
      return false;
    }
    
    // Search by title or creator
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        drop.title.toLowerCase().includes(searchLower) ||
        drop.creator.name.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  // Sort the filtered drops
  const sortedDrops = [...filteredDrops].sort((a, b) => {
    switch (filters.sort) {
      case "newest":
        return new Date(b.mintStart).getTime() - new Date(a.mintStart).getTime();
      case "oldest":
        return new Date(a.mintStart).getTime() - new Date(b.mintStart).getTime();
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      default:
        return 0;
    }
  });

  // Update a specific filter
  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero */}
      <div className="bg-gradient-to-r from-aura-purple/10 to-white py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Explore Drops</h1>
          <p className="text-gray-600">
            Discover and collect unique NFTs from creators around the world
          </p>
        </div>
      </div>
      
      <main className="flex-grow container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className="hidden lg:block w-64 sticky top-24 self-start">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              
              {/* Status Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <Select 
                  value={filters.status} 
                  onValueChange={(value) => updateFilter("status", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ended">Ended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Blockchain Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blockchain
                </label>
                <Select 
                  value={filters.blockchain} 
                  onValueChange={(value) => updateFilter("blockchain", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Ethereum">Ethereum</SelectItem>
                    <SelectItem value="Polygon">Polygon</SelectItem>
                    <SelectItem value="Solana">Solana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Price Range (ETH)
                </label>
                <Slider
                  value={[filters.priceRange[0] * 100, filters.priceRange[1] * 100]}
                  min={0}
                  max={20}
                  step={1}
                  onValueChange={(value) => {
                    updateFilter("priceRange", [value[0] / 100, value[1] / 100]);
                  }}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{filters.priceRange[0].toFixed(2)} ETH</span>
                  <span>{filters.priceRange[1].toFixed(2)} ETH</span>
                </div>
              </div>
              
              {/* Reset Filters */}
              <Button
                variant="ghost"
                onClick={() => setFilters({
                  status: "all",
                  blockchain: "all",
                  priceRange: [0, 0.2],
                  search: "",
                  sort: "newest",
                })}
                className="w-full border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Reset Filters
              </Button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search drops or creators"
                  value={filters.search}
                  onChange={(e) => updateFilter("search", e.target.value)}
                  className="aura-input"
                />
              </div>
              <div className="w-full md:w-48">
                <Select 
                  value={filters.sort} 
                  onValueChange={(value) => updateFilter("sort", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Filters Button - Mobile */}
              <div className="block lg:hidden">
                <Button 
                  variant="outline"
                  className="w-full border-aura-purple text-aura-purple"
                >
                  Filters
                </Button>
              </div>
            </div>
            
            {/* Results Count */}
            <p className="text-gray-600 mb-6">
              Showing {sortedDrops.length} drops
            </p>
            
            {/* Drops Grid */}
            {sortedDrops.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedDrops.map((drop) => (
                  <DropCard key={drop.id} drop={drop} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No drops found</h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
            
            {/* Pagination */}
            {sortedDrops.length > 0 && (
              <div className="mt-12 flex justify-center">
                <div className="flex gap-2">
                  <Button variant="outline" className="border-gray-200">
                    Previous
                  </Button>
                  <Button variant="outline" className="border-gray-200 bg-aura-purple text-white">
                    1
                  </Button>
                  <Button variant="outline" className="border-gray-200">
                    2
                  </Button>
                  <Button variant="outline" className="border-gray-200">
                    3
                  </Button>
                  <Button variant="outline" className="border-gray-200">
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Explore;
