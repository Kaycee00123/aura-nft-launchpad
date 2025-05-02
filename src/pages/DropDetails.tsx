
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockNFTDrops, NFTDrop } from "@/lib/mock-data";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, ArrowRight, Link as LinkIcon } from "lucide-react";

const DropDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, connectUserWallet } = useAuth();
  const { toast } = useToast();
  const [drop, setDrop] = useState<NFTDrop | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [isMinting, setIsMinting] = useState(false);

  useEffect(() => {
    // Find drop by slug
    const foundDrop = mockNFTDrops.find((d) => d.slug === slug);
    if (foundDrop) {
      setDrop(foundDrop);
      setSelectedImage(foundDrop.bannerImage);
    }
  }, [slug]);

  useEffect(() => {
    // Calculate time left for upcoming drops
    if (!drop || drop.status !== "upcoming") return;
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const mintStartTime = new Date(drop.mintStart).getTime();
      const distance = mintStartTime - now;
      
      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft(null);
        return;
      }
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [drop]);

  const handleMint = async () => {
    if (!user || !user.wallet?.isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to mint this NFT",
        variant: "destructive",
      });
      return;
    }
    
    setIsMinting(true);
    
    try {
      // Simulate minting process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "NFT Minted!",
        description: "Your transaction has been submitted successfully",
      });
    } catch (error) {
      console.error("Minting error:", error);
      toast({
        title: "Minting failed",
        description: "There was an error during the minting process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  if (!drop) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <h1 className="text-2xl font-semibold text-gray-600">Drop not found</h1>
        </main>
        <Footer />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ended":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isActive = drop.status === "active";
  const isMintable = isActive && user?.wallet?.isConnected;
  const mintProgress = (drop.minted / drop.supply) * 100;
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      {/* Banner */}
      <div className="relative w-full h-64 md:h-96 overflow-hidden bg-gray-100">
        <img 
          src={drop.bannerImage} 
          alt={`${drop.title} banner`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>
      
      <main className="container mx-auto max-w-6xl px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/explore" 
            className="inline-flex items-center text-aura-purple hover:underline"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Explore
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left Column: Images */}
          <div className="md:col-span-2">
            {/* Main Image */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md mb-6">
              <img 
                src={selectedImage} 
                alt={drop.title} 
                className="w-full h-auto object-contain"
              />
            </div>
            
            {/* Image Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-4">
              <div
                className={`min-w-24 h-24 cursor-pointer rounded-md overflow-hidden ${
                  selectedImage === drop.bannerImage ? "ring-2 ring-aura-purple" : ""
                }`}
                onClick={() => setSelectedImage(drop.bannerImage)}
              >
                <img 
                  src={drop.bannerImage} 
                  alt={`${drop.title} thumbnail`} 
                  className="w-full h-full object-cover"
                />
              </div>
              {drop.gallery.map((image, index) => (
                <div
                  key={index}
                  className={`min-w-24 h-24 cursor-pointer rounded-md overflow-hidden ${
                    selectedImage === image ? "ring-2 ring-aura-purple" : ""
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img 
                    src={image} 
                    alt={`${drop.title} thumbnail ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            
            {/* Tabs */}
            <div className="mt-8">
              <Tabs defaultValue="description">
                <TabsList className="bg-gray-100">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="traits">Traits</TabsTrigger>
                  <TabsTrigger value="utility">Utility</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-4 text-gray-700">
                  <p>{drop.description}</p>
                </TabsContent>
                <TabsContent value="traits" className="mt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {drop.traits.map((trait, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">{trait.name}</p>
                        <p className="font-medium">{trait.value}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="utility" className="mt-4 text-gray-700">
                  <p>This NFT collection includes the following utility:</p>
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                    <li>Access to exclusive community events</li>
                    <li>Voting rights for future collection developments</li>
                    <li>Eligibility for airdrops and future rewards</li>
                    <li>Premium content access</li>
                  </ul>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Right Column: Details & Mint */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
              {/* Status Badge */}
              <Badge variant="outline" className={`${getStatusColor(drop.status)} border-none mb-4`}>
                {drop.status.charAt(0).toUpperCase() + drop.status.slice(1)}
              </Badge>
              
              {/* Title & Creator */}
              <h1 className="text-2xl font-bold mb-2">{drop.title}</h1>
              <div className="flex items-center space-x-2 mb-6">
                <img 
                  src={drop.creator.avatar} 
                  alt={drop.creator.name} 
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-gray-700">by {drop.creator.name}</span>
                {drop.creator.verified && (
                  <svg
                    className="w-4 h-4 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              
              {/* Price & Blockchain */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Price</p>
                  <p className="text-xl font-bold">{drop.price} {drop.currency}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Blockchain</p>
                  <p className="font-medium">{drop.blockchain}</p>
                </div>
              </div>
              
              {/* Mint Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span>{drop.minted} minted</span>
                  <span>{drop.supply} total</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-aura-purple h-2.5 rounded-full"
                    style={{ width: `${mintProgress}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Countdown Timer */}
              {drop.status === "upcoming" && timeLeft && (
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-2">Mint starts in</p>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="bg-gray-100 rounded-lg p-2 text-center">
                      <p className="text-xl font-bold">{timeLeft.days}</p>
                      <p className="text-xs text-gray-500">Days</p>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-2 text-center">
                      <p className="text-xl font-bold">{timeLeft.hours}</p>
                      <p className="text-xs text-gray-500">Hours</p>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-2 text-center">
                      <p className="text-xl font-bold">{timeLeft.minutes}</p>
                      <p className="text-xs text-gray-500">Min</p>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-2 text-center">
                      <p className="text-xl font-bold">{timeLeft.seconds}</p>
                      <p className="text-xs text-gray-500">Sec</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Mint Button */}
              {!user?.wallet?.isConnected ? (
                <Button 
                  onClick={connectUserWallet}
                  className="w-full bg-aura-purple hover:bg-aura-purple-dark text-white py-6 text-lg mb-4"
                >
                  <Wallet className="mr-2 h-5 w-5" />
                  Connect Wallet
                </Button>
              ) : isActive ? (
                <Button 
                  onClick={handleMint} 
                  disabled={isMinting}
                  className="w-full bg-aura-purple hover:bg-aura-purple-dark text-white py-6 text-lg mb-4"
                >
                  {isMinting ? "Minting..." : "Mint Now"}
                </Button>
              ) : drop.status === "upcoming" ? (
                <Button 
                  disabled
                  className="w-full bg-gray-300 text-gray-700 py-6 text-lg mb-4 cursor-not-allowed"
                >
                  Not Live Yet
                </Button>
              ) : (
                <Button 
                  disabled
                  className="w-full bg-gray-300 text-gray-700 py-6 text-lg mb-4 cursor-not-allowed"
                >
                  Mint Ended
                </Button>
              )}
              
              {/* External Links */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  <LinkIcon className="mr-2 h-4 w-4" />
                  View Contract
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  View on OpenSea
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DropDetails;
