
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { mockNFTDrops, Creator, NFTDrop } from "@/lib/mock-data";
import DropCard from "@/components/DropCard";

const CreatorProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [activeDrops, setActiveDrops] = useState<NFTDrop[]>([]);
  const [pastDrops, setPastDrops] = useState<NFTDrop[]>([]);
  
  useEffect(() => {
    // Find creator based on username
    const allCreators = mockNFTDrops.map(drop => drop.creator);
    const uniqueCreators = Array.from(
      new Map(allCreators.map(item => [item.id, item])).values()
    );
    
    const foundCreator = uniqueCreators.find(c => c.name.toLowerCase() === username?.toLowerCase());
    
    if (foundCreator) {
      setCreator(foundCreator);
      
      // Filter drops by creator
      const creatorDrops = mockNFTDrops.filter(drop => drop.creator.id === foundCreator.id);
      
      // Split into active and past drops
      setActiveDrops(creatorDrops.filter(drop => drop.status === "active" || drop.status === "upcoming"));
      setPastDrops(creatorDrops.filter(drop => drop.status === "ended"));
    }
  }, [username]);
  
  if (!creator) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <h1 className="text-2xl font-semibold text-gray-600">Creator not found</h1>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      {/* Banner */}
      <div className="relative w-full h-64 overflow-hidden bg-gray-100">
        {creator.bannerImage ? (
          <img 
            src={creator.bannerImage} 
            alt={creator.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-aura-purple/30 to-aura-purple/10" />
        )}
      </div>
      
      {/* Creator Info */}
      <div className="container mx-auto max-w-6xl px-4">
        <div className="relative -mt-16 pb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img 
                src={creator.avatar} 
                alt={creator.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
              />
            </div>
            
            {/* Creator Details */}
            <div className="flex-grow mt-4 md:mt-0">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{creator.name}</h1>
                {creator.verified && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-gray-500">@{creator.name.toLowerCase().replace(/\s+/g, '')}</p>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-2 mt-4 md:mt-0">
              {creator.twitter && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://twitter.com/${creator.twitter}`} target="_blank" rel="noopener noreferrer">
                    Twitter
                  </a>
                </Button>
              )}
              {creator.instagram && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://instagram.com/${creator.instagram}`} target="_blank" rel="noopener noreferrer">
                    Instagram
                  </a>
                </Button>
              )}
              {creator.website && (
                <Button variant="outline" size="sm" asChild>
                  <a href={creator.website} target="_blank" rel="noopener noreferrer">
                    Website
                  </a>
                </Button>
              )}
            </div>
          </div>
          
          {/* Bio */}
          {creator.bio && (
            <div className="mt-6 max-w-3xl">
              <p className="text-gray-700">{creator.bio}</p>
            </div>
          )}
        </div>
        
        {/* Drops */}
        <div className="py-8">
          <Tabs defaultValue="active" className="w-full">
            <TabsList>
              <TabsTrigger value="active">Active Drops ({activeDrops.length})</TabsTrigger>
              <TabsTrigger value="past">Past Drops ({pastDrops.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-6">
              {activeDrops.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeDrops.map((drop) => (
                    <DropCard key={drop.id} drop={drop} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500">
                    No active drops
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="past" className="mt-6">
              {pastDrops.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastDrops.map((drop) => (
                    <DropCard key={drop.id} drop={drop} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500">
                    No past drops
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CreatorProfile;
