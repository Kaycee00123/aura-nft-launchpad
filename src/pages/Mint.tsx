
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { mockNFTDrops, NFTDrop } from "@/lib/mock-data";
import { Loader, Wallet, Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Mint = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, connectUserWallet } = useAuth();
  const { toast } = useToast();
  const [drop, setDrop] = useState<NFTDrop | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [mintStatus, setMintStatus] = useState<"idle" | "minting" | "success" | "error">("idle");

  useEffect(() => {
    // Fetch drop data
    const foundDrop = mockNFTDrops.find((d) => d.slug === slug);
    if (foundDrop) {
      setDrop(foundDrop);
    } else {
      navigate("/explore");
      toast({
        title: "Drop Not Found",
        description: "We couldn't find the drop you're looking for.",
        variant: "destructive",
      });
    }
  }, [slug, navigate, toast]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0 && value <= 10) {
      setQuantity(value);
    }
  };

  const handleMint = async () => {
    if (!user?.wallet?.isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to mint NFTs.",
        variant: "destructive",
      });
      return;
    }

    if (!drop) return;
    
    setMintStatus("minting");
    
    try {
      // Simulate blockchain interaction delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Mock successful mint
      setMintStatus("success");
      
      // Update minted count
      const updatedDrop = { ...drop, minted: drop.minted + quantity };
      setDrop(updatedDrop);
      
      toast({
        title: "Mint Successful!",
        description: `You have successfully minted ${quantity} NFT${quantity > 1 ? 's' : ''}.`,
      });
      
      // In a real app, we would update Supabase here
    } catch (error) {
      console.error("Mint error:", error);
      setMintStatus("error");
      toast({
        title: "Mint Failed",
        description: "There was an error minting your NFT. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!drop) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-aura-purple" />
        </main>
        <Footer />
      </div>
    );
  }

  const totalCost = parseFloat((quantity * parseFloat(drop.price)).toFixed(4));
  const isActive = drop.status === "active";
  const remainingSupply = drop.supply - drop.minted;
  const availableSupply = Math.min(10, remainingSupply);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 container mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(`/drop/${drop.slug}`)}
            className="hover:text-aura-purple"
          >
            &larr; Back to Drop
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column - NFT Image */}
          <div>
            <Card className="overflow-hidden">
              <div className="aspect-square w-full">
                <img
                  src={drop.bannerImage}
                  alt={drop.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
          </div>
          
          {/* Right column - Mint interface */}
          <div>
            <h1 className="text-2xl font-bold mb-2">{drop.title}</h1>
            <div className="flex items-center mb-6">
              <img
                src={drop.creator.avatar}
                alt={drop.creator.name}
                className="w-6 h-6 rounded-full mr-2"
              />
              <span>by {drop.creator.name}</span>
            </div>
            
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Price</span>
                    <span className="font-semibold">{drop.price} {drop.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Remaining</span>
                    <span className="font-semibold">{remainingSupply} / {drop.supply}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Blockchain</span>
                    <span className="font-semibold">{drop.blockchain}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Mint UI */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">Mint NFT</h2>
                
                {!user?.wallet?.isConnected ? (
                  <Button 
                    onClick={connectUserWallet}
                    className="w-full bg-aura-purple hover:bg-aura-purple-dark text-white py-6 text-lg"
                  >
                    <Wallet className="mr-2 h-5 w-5" />
                    Connect Wallet
                  </Button>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <div className="flex items-center">
                        <Button
                          type="button"
                          variant="outline"
                          disabled={quantity <= 1}
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="h-10 px-3"
                        >
                          -
                        </Button>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          max={availableSupply}
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value))}
                          className="max-w-28"
                        />
                        <p className="text-sm text-muted-foreground">
                          {(parseFloat(drop.price) * quantity).toFixed(4)} {drop.currency}
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={quantity >= 10 || quantity >= remainingSupply}
                          onClick={() => setQuantity(Math.min(10, remainingSupply, quantity + 1))}
                          className="h-10 px-3"
                        >
                          +
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Max 10 per transaction</p>
                    </div>
                    
                    <div className="flex justify-between py-4 border-t border-gray-200">
                      <span>Total Cost</span>
                      <span className="font-semibold">{totalCost.toFixed(4)} {drop.currency}</span>
                    </div>
                    
                    <Button
                      onClick={handleMint}
                      disabled={!isActive || mintStatus === "minting" || remainingSupply === 0}
                      className="w-full bg-aura-purple hover:bg-aura-purple-dark text-white py-6 text-lg"
                    >
                      {mintStatus === "idle" && "Mint Now"}
                      {mintStatus === "minting" && (
                        <>
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                          Minting...
                        </>
                      )}
                      {mintStatus === "success" && (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Mint Successful
                        </>
                      )}
                      {mintStatus === "error" && (
                        <>
                          <X className="mr-2 h-4 w-4" />
                          Mint Failed
                        </>
                      )}
                    </Button>
                    
                    {!isActive && (
                      <p className="text-sm text-red-500 mt-2 text-center">
                        {drop.status === "upcoming" ? "Drop is not live yet" : "Drop has ended"}
                      </p>
                    )}
                    
                    {remainingSupply === 0 && (
                      <p className="text-sm text-red-500 mt-2 text-center">
                        Sold out!
                      </p>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Mint;
