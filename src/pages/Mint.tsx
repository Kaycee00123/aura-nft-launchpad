
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/context/WalletContext";
import { Loader } from "lucide-react";

interface NFTDrop {
  name: string;
  symbol: string;
  totalSupply: number;
  maxSupply: number;
  price: number;
  mintStart: string;
  mintEnd: string;
  isSoulbound: boolean;
  isWhitelistEnabled: boolean;
  creator: string;
  contractAddress: string;
}

const Mint = () => {
  const { address } = useParams<{ address: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { wallet, isConnected, connectWallet } = useWallet();
  
  const [drop, setDrop] = useState<NFTDrop | null>(null);
  const [loading, setLoading] = useState(true);
  const [minting, setMinting] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  const fetchDropDetails = async () => {
    try {
      // Mock API call
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockDrop: NFTDrop = {
        name: "Sample NFT Collection",
        symbol: "SAMPLE",
        totalSupply: 123,
        maxSupply: 1000,
        price: 0.05,
        mintStart: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        mintEnd: new Date(Date.now() + 604800000).toISOString(), // 7 days from now
        isSoulbound: false,
        isWhitelistEnabled: false,
        creator: "0x1234567890abcdef1234567890abcdef12345678",
        contractAddress: address || "0x"
      };
      
      setDrop(mockDrop);
    } catch (error) {
      console.error("Error fetching drop:", error);
      toast({
        title: "Error",
        description: "Failed to load drop details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDropDetails();
  }, [address]);
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      // Ensure we don't exceed available supply
      if (drop && drop.maxSupply - drop.totalSupply >= value) {
        setQuantity(value);
      } else if (drop) {
        setQuantity(drop.maxSupply - drop.totalSupply);
      }
    } else {
      setQuantity(1);
    }
  };
  
  const mintNFTs = async () => {
    if (!isConnected || !wallet.address || !drop) return;
    
    try {
      setMinting(true);
      // Calculate total price
      const totalPrice = drop.price * quantity;
      
      // Mock mint transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Success!",
        description: `Minted ${quantity} NFT${quantity > 1 ? 's' : ''}!`,
      });
      
      // Refresh drop details to reflect updated supply
      fetchDropDetails();
    } catch (error) {
      console.error("Error minting:", error);
      toast({
        title: "Mint Failed",
        description: "Transaction was not successful",
        variant: "destructive",
      });
    } finally {
      setMinting(false);
    }
  };
  
  const isMintActive = () => {
    if (!drop) return false;
    
    const now = new Date();
    const mintStart = new Date(drop.mintStart);
    const mintEnd = new Date(drop.mintEnd);
    
    return now >= mintStart && now <= mintEnd;
  };
  
  const formatETH = (value: number) => {
    return `${value} ETH`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <Loader className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }
  
  if (!drop) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Drop Not Found</h2>
        <p className="text-gray-500 mt-2">The NFT drop you're looking for doesn't exist</p>
        <Button 
          onClick={() => navigate("/explore")}
          className="mt-6"
        >
          Explore Other Drops
        </Button>
      </div>
    );
  }
  
  const remainingSupply = drop.maxSupply - drop.totalSupply;
  
  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate(`/drop/${drop.contractAddress}`)}>
          ← Back to Drop Details
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left column - NFT preview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{drop.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                {/* Replace with actual NFT preview image */}
                <div className="text-gray-400 text-center p-8">
                  <div className="text-6xl mb-4">🖼️</div>
                  <p>NFT Preview</p>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Collection:</span>
                  <span className="font-medium">{drop.name} ({drop.symbol})</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Price:</span>
                  <span className="font-medium">{formatETH(drop.price)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - Mint controls */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Mint NFT</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-500">Price per NFT:</span>
                  <span className="font-medium">{formatETH(drop.price)}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-500">Available:</span>
                  <span className="font-medium">{remainingSupply} / {drop.maxSupply}</span>
                </div>
              </div>
              
              {drop.isWhitelistEnabled && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-yellow-800 text-sm">
                    This drop requires whitelist access to mint.
                  </p>
                </div>
              )}
              
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={remainingSupply.toString()}
                  value={quantity}
                  onChange={handleQuantityChange}
                  disabled={!isConnected || !isMintActive() || remainingSupply === 0}
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between font-medium">
                  <span>Total Price:</span>
                  <span>{formatETH(drop.price * quantity)}</span>
                </div>
              </div>
              
              {!isConnected ? (
                <Button 
                  onClick={connectWallet}
                  className="w-full bg-aura-purple hover:bg-aura-purple-dark"
                >
                  Connect Wallet
                </Button>
              ) : !isMintActive() ? (
                <Button disabled className="w-full">
                  {new Date(drop.mintStart) > new Date() 
                    ? "Mint Not Started Yet" 
                    : "Mint Ended"}
                </Button>
              ) : remainingSupply === 0 ? (
                <Button disabled className="w-full">
                  Sold Out
                </Button>
              ) : (
                <Button 
                  onClick={mintNFTs} 
                  disabled={minting || quantity > remainingSupply || quantity === 0}
                  className="w-full bg-aura-purple hover:bg-aura-purple-dark"
                >
                  {minting ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Minting...
                    </>
                  ) : (
                    `Mint ${quantity} NFT${quantity !== 1 ? 's' : ''}`
                  )}
                </Button>
              )}
              
              {drop.isSoulbound && (
                <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-200">
                  This is a Soulbound token that cannot be transferred after minting.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Mint;
