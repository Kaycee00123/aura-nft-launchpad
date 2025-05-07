
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/context/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wallet, 
  Link as LinkIcon,
  Users,
  Lock,
  Unlock,
  Coins,
  Calendar,
  Loader
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ethers } from "ethers";
import { ipfsToHttpURL } from "@/lib/ipfs/ipfs-service";
import { getDropContract } from "@/lib/contracts/contract-utils";

const shortenAddress = (address: string | undefined): string => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Function to format ETH values consistently
const formatEth = (value: string): string => {
  return parseFloat(value).toFixed(4);
};

// Create a proper type for the drop data from contract
interface NFTDrop {
  name: string;
  symbol: string;
  totalSupply: number;
  maxSupply: number;
  price: string;
  mintStart: Date;
  mintEnd: Date;
  isSoulbound: boolean;
  isWhitelistEnabled: boolean;
  creator: string;
  logoURI: string;
  bannerURI: string;
  contractAddress: string;
  isLoaded: boolean;
}

const initialDropState: NFTDrop = {
  name: "",
  symbol: "",
  totalSupply: 0,
  maxSupply: 0,
  price: "0",
  mintStart: new Date(),
  mintEnd: new Date(),
  isSoulbound: false,
  isWhitelistEnabled: false,
  creator: "",
  logoURI: "",
  bannerURI: "",
  contractAddress: "",
  isLoaded: false
};

const DropDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const { wallet, isConnected, connectWallet } = useWallet();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [drop, setDrop] = useState<NFTDrop>(initialDropState);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  useEffect(() => {
    fetchDropDetails();
  }, [slug, isConnected, wallet?.address]);

  const fetchDropDetails = async () => {
    if (!slug || !ethers.utils.isAddress(slug)) {
      toast({
        title: "Invalid Address",
        description: "The provided contract address is not valid",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Since we've removed wallet connection, use a simple provider
      let provider = new ethers.providers.JsonRpcProvider();
      let signer = provider.getSigner();

      // Get drop contract
      const dropContract = getDropContract(slug, signer);

      // Fetch basic info
      const [
        name,
        symbol,
        totalSupply,
        maxSupply,
        mintPrice,
        mintStart,
        mintEnd,
        isSoulbound,
        isWhitelistEnabled,
        creator,
        logoURI,
        bannerURI
      ] = await Promise.all([
        dropContract.name(),
        dropContract.symbol(),
        dropContract.totalSupply(),
        dropContract.maxSupply(),
        dropContract.mintPrice(),
        dropContract.mintStart(),
        dropContract.mintEnd(),
        dropContract.isSoulbound(),
        dropContract.isWhitelistEnabled(),
        dropContract.creator(),
        dropContract.logoURI(),
        dropContract.bannerURI()
      ]);

      // Format the IPFS URIs to HTTP URLs
      const logoHttpUrl = ipfsToHttpURL(logoURI);
      const bannerHttpUrl = ipfsToHttpURL(bannerURI);

      // Check if user is creator
      setIsCreator(
        wallet.address?.toLowerCase() === creator.toLowerCase()
      );

      // Update drop state
      const dropData: NFTDrop = {
        name,
        symbol,
        totalSupply,
        maxSupply,
        price: ethers.utils.formatEther(mintPrice),
        mintStart: new Date(mintStart),
        mintEnd: new Date(mintEnd),
        isSoulbound,
        isWhitelistEnabled,
        creator,
        logoURI: logoHttpUrl,
        bannerURI: bannerHttpUrl,
        contractAddress: slug,
        isLoaded: true
      };
      
      setDrop(dropData);
      setSelectedImage(dropData.logoURI || dropData.bannerURI);

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
    // Calculate time left for upcoming drops
    if (!drop || !drop.isLoaded) return;
    
    const now = new Date().getTime();
    const mintStart = drop.mintStart.getTime();
    
    if (mintStart > now) {
      const timer = setInterval(() => {
        const currentTime = new Date().getTime();
        const distance = mintStart - currentTime;
        
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
    }
  }, [drop]);

  const handleMint = () => {
    navigate(`/mint/${slug}`);
  };

  const handleManageWhitelist = async () => {
    if (!isConnected || !wallet.address || !isCreator) return;
    
    try {
      setActionInProgress('whitelist');
      
      // Since wallet connection is removed, these are now just placeholder functions
      const provider = new ethers.providers.JsonRpcProvider();
      const signer = provider.getSigner();
      const dropContract = getDropContract(slug || "", signer);
      
      // Toggle whitelist state
      const tx = await dropContract.setWhitelistEnabled(!drop.isWhitelistEnabled);
      await tx.wait();
      
      toast({
        title: "Whitelist Updated",
        description: `Whitelist has been ${drop.isWhitelistEnabled ? 'disabled' : 'enabled'}.`,
      });
      
      // Refresh drop details
      fetchDropDetails();
    } catch (error: any) {
      console.error("Error managing whitelist:", error);
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to update whitelist status",
        variant: "destructive",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleToggleSoulbound = async () => {
    if (!isConnected || !wallet.address || !isCreator) return;
    
    try {
      setActionInProgress('soulbound');
      
      // Since wallet connection is removed, these are now just placeholder functions
      const provider = new ethers.providers.JsonRpcProvider();
      const signer = provider.getSigner();
      const dropContract = getDropContract(slug || "", signer);
      
      // Toggle soulbound state
      const tx = await dropContract.setSoulbound(!drop.isSoulbound);
      await tx.wait();
      
      toast({
        title: "Soulbound Status Updated",
        description: `Tokens are now ${!drop.isSoulbound ? 'soulbound' : 'transferable'}.`,
      });
      
      // Refresh drop details
      fetchDropDetails();
    } catch (error: any) {
      console.error("Error toggling soulbound:", error);
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to update soulbound status",
        variant: "destructive",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleWithdraw = async () => {
    if (!isConnected || !wallet.address || !isCreator) return;
    
    try {
      setActionInProgress('withdraw');
      
      // Since wallet connection is removed, these are now just placeholder functions
      const provider = new ethers.providers.JsonRpcProvider();
      const signer = provider.getSigner();
      const dropContract = getDropContract(slug || "", signer);
      
      // Withdraw funds
      const tx = await dropContract.withdraw();
      await tx.wait();
      
      toast({
        title: "Withdrawal Successful",
        description: "Funds have been withdrawn to your wallet.",
      });
    } catch (error: any) {
      console.error("Error withdrawing funds:", error);
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to withdraw funds",
        variant: "destructive",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  // Status calculation for drop
  const getDropStatus = () => {
    if (!drop.isLoaded) return "loading";
    
    const now = new Date();
    const mintStart = drop.mintStart;
    const mintEnd = drop.mintEnd;
    
    if (now < mintStart) {
      return "upcoming";
    } else if (now <= mintEnd) {
      return "active";
    } else {
      return "ended";
    }
  };

  // Utils
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-gray-500" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!drop.isLoaded) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-600">Drop not found</h1>
            <p className="mt-2 text-gray-500">The contract address may be invalid or the drop does not exist.</p>
            <Button onClick={() => navigate("/explore")} className="mt-4">
              Explore Drops
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const dropStatus = getDropStatus();
  const isActive = dropStatus === "active";
  const isMintable = isActive && isConnected;
  const mintProgress = (drop.totalSupply / drop.maxSupply) * 100;
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      {/* Banner */}
      <div className="relative w-full h-64 md:h-96 overflow-hidden bg-gray-100">
        {drop.bannerURI ? (
          <img 
            src={drop.bannerURI} 
            alt={`${drop.name} banner`} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-400">No banner image</p>
          </div>
        )}
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
              {selectedImage ? (
                <img 
                  src={selectedImage} 
                  alt={drop.name} 
                  className="w-full h-auto object-contain"
                />
              ) : (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-400">No image available</p>
                </div>
              )}
            </div>
            
            {/* Image Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-4">
              {drop.logoURI && (
                <div
                  className={`min-w-24 h-24 cursor-pointer rounded-md overflow-hidden ${
                    selectedImage === drop.logoURI ? "ring-2 ring-aura-purple" : ""
                  }`}
                  onClick={() => setSelectedImage(drop.logoURI)}
                >
                  <img 
                    src={drop.logoURI} 
                    alt={`${drop.name} logo`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {drop.bannerURI && (
                <div
                  className={`min-w-24 h-24 cursor-pointer rounded-md overflow-hidden ${
                    selectedImage === drop.bannerURI ? "ring-2 ring-aura-purple" : ""
                  }`}
                  onClick={() => setSelectedImage(drop.bannerURI)}
                >
                  <img 
                    src={drop.bannerURI} 
                    alt={`${drop.name} banner`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            
            {/* Tabs */}
            <div className="mt-8">
              <Tabs defaultValue="description">
                <TabsList className="bg-gray-100">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="details">Contract Details</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="mt-4 text-gray-700">
                  <p>
                    {drop.name} ({drop.symbol}) is a unique NFT collection{wallet.chain?.name ? ` on the ${wallet.chain.name}` : ""}.
                    {drop.isSoulbound && " This is a soulbound collection, meaning the NFTs cannot be transferred once minted."}
                    {drop.isWhitelistEnabled && " This collection has a whitelist requirement for minting."}
                  </p>
                </TabsContent>
                
                <TabsContent value="details" className="mt-4 text-gray-700">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Contract Address</p>
                        <p className="font-mono text-sm overflow-hidden overflow-ellipsis">{drop.contractAddress}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Symbol</p>
                        <p className="font-medium">{drop.symbol}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Blockchain</p>
                        <p className="font-medium">{wallet.chain?.name || "Unknown"}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Creator</p>
                        <p className="font-mono text-sm overflow-hidden overflow-ellipsis">{shortenAddress(drop.creator)}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-2">
                        <p className="text-sm text-gray-500">Soulbound</p>
                        <Badge variant={drop.isSoulbound ? "default" : "outline"}>
                          {drop.isSoulbound ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-2">
                        <p className="text-sm text-gray-500">Whitelist</p>
                        <Badge variant={drop.isWhitelistEnabled ? "default" : "outline"}>
                          {drop.isWhitelistEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Right Column: Details & Mint */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
              {/* Status Badge */}
              <Badge variant="outline" className={`${getStatusColor(dropStatus)} border-none mb-4`}>
                {dropStatus.charAt(0).toUpperCase() + dropStatus.slice(1)}
              </Badge>
              
              {/* Title & Creator */}
              <h1 className="text-2xl font-bold mb-2">{drop.name}</h1>
              <div className="flex items-center space-x-2 mb-6">
                <span className="text-gray-700">by {shortenAddress(drop.creator)}</span>
              </div>
              
              {/* Collection Details */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Coins className="h-4 w-4" />
                        <span>Price</span>
                      </div>
                      <span className="font-semibold">{formatEth(drop.price)} {wallet.chain?.nativeCurrency?.symbol || "ETH"}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Mint Period</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">{drop.mintStart.toLocaleDateString()}</div>
                        <div className="text-sm text-gray-500">to {drop.mintEnd.toLocaleDateString()}</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-gray-600">
                        {drop.isSoulbound ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                        <span>Transferable</span>
                      </div>
                      <span>{drop.isSoulbound ? "No" : "Yes"}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>Whitelist</span>
                      </div>
                      <span>{drop.isWhitelistEnabled ? "Required" : "Public"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Mint Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span>{drop.totalSupply} minted</span>
                  <span>{drop.maxSupply} total</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-aura-purple h-2.5 rounded-full"
                    style={{ width: `${mintProgress}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Countdown Timer */}
              {dropStatus === "upcoming" && timeLeft && (
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
              {!isConnected ? (
                <Button 
                  onClick={connectWallet}
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
                  {isMinting ? "Redirecting..." : "Mint Now"}
                </Button>
              ) : dropStatus === "upcoming" ? (
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
              
              {/* Creator Controls */}
              {isCreator && (
                <div className="space-y-3 mt-6 pt-6 border-t border-gray-100">
                  <h3 className="font-semibold">Creator Controls</h3>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <Button 
                      variant="outline" 
                      onClick={handleManageWhitelist}
                      disabled={actionInProgress === 'whitelist'}
                      className="w-full"
                    >
                      {actionInProgress === 'whitelist' ? (
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Users className="mr-2 h-4 w-4" />
                      )}
                      {drop.isWhitelistEnabled ? "Disable Whitelist" : "Enable Whitelist"}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={handleToggleSoulbound}
                      disabled={actionInProgress === 'soulbound'}
                      className="w-full"
                    >
                      {actionInProgress === 'soulbound' ? (
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                      ) : drop.isSoulbound ? (
                        <Unlock className="mr-2 h-4 w-4" />
                      ) : (
                        <Lock className="mr-2 h-4 w-4" />
                      )}
                      {drop.isSoulbound ? "Make Transferable" : "Make Soulbound"}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={handleWithdraw}
                      disabled={actionInProgress === 'withdraw'}
                      className="w-full"
                    >
                      {actionInProgress === 'withdraw' ? (
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Coins className="mr-2 h-4 w-4" />
                      )}
                      Withdraw Funds
                    </Button>
                  </div>
                </div>
              )}
              
              {/* External Links */}
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    const explorerUrl = wallet.chain?.blockExplorers?.default?.url;
                    if (explorerUrl && drop.contractAddress) {
                      window.open(`${explorerUrl}/address/${drop.contractAddress}`, "_blank");
                    }
                  }}
                >
                  <LinkIcon className="mr-2 h-4 w-4" />
                  View Contract
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
