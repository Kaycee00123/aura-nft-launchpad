
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/context/WalletContext";
import { Loader, AlertTriangle, Check } from "lucide-react";
import { NFTDropInterface } from "@/lib/contracts/interfaces";
import { getDropContract, formatEth } from "@/lib/contracts/contract-utils";
import { ipfsToHttpURL } from "@/lib/ipfs/ipfs-service";
import { ethers } from "ethers";

interface DropState {
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
  isLoaded: boolean;
}

const initialDropState: DropState = {
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
  isLoaded: false
};

const Mint = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { wallet, isConnected, connectWallet } = useWallet();
  
  const [drop, setDrop] = useState<DropState>(initialDropState);
  const [loading, setLoading] = useState(true);
  const [minting, setMinting] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [whitelistStatus, setWhitelistStatus] = useState<'checking' | 'eligible' | 'not-eligible' | null>(null);
  
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
      
      // Return early if wallet is not connected
      if (!isConnected || !wallet.address) {
        setLoading(false);
        return;
      }
      
      // Connect to provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Get drop contract
      const dropContract: NFTDropInterface = getDropContract(slug, signer);
      
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
      
      // Update drop state
      setDrop({
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
        logoURI: ipfsToHttpURL(logoURI),
        bannerURI: ipfsToHttpURL(bannerURI),
        isLoaded: true
      });
      
      // Check whitelist status if enabled
      if (isWhitelistEnabled) {
        checkWhitelistStatus(wallet.address);
      }
      
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
  
  // Connect to wallet and fetch drop details
  useEffect(() => {
    if (isConnected && wallet.address) {
      fetchDropDetails();
    }
  }, [slug, isConnected, wallet.address]);
  
  const checkWhitelistStatus = async (address: string | undefined) => {
    if (!address) return;
    
    try {
      setWhitelistStatus('checking');
      
      // In a real implementation, you would verify the whitelist status
      // by checking if the user's address is in the whitelist or
      // by verifying if they have a valid merkle proof
      
      // For now, we'll simulate this check with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Randomly determine if user is eligible (in real app, this would be actual verification)
      const isEligible = Math.random() > 0.5;
      setWhitelistStatus(isEligible ? 'eligible' : 'not-eligible');
      
    } catch (error) {
      console.error("Error checking whitelist status:", error);
      setWhitelistStatus('not-eligible');
    }
  };
  
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
    if (!isConnected || !wallet.address || !drop.isLoaded) return;
    
    try {
      setMinting(true);
      
      // Connect to provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Get drop contract
      const dropContract: NFTDropInterface = getDropContract(slug || "", signer);
      
      // Calculate total price
      const price = ethers.utils.parseEther(drop.price);
      const totalPrice = price.mul(quantity);
      
      // Execute mint transaction
      let tx;
      if (drop.isWhitelistEnabled && whitelistStatus === 'eligible') {
        // In a real implementation, you would fetch the merkle proof for the user
        // For now, we'll pass an empty array
        const merkleProof: string[] = [];
        tx = await dropContract.whitelistMint(quantity, merkleProof, { value: totalPrice });
      } else {
        tx = await dropContract.mint(quantity, { value: totalPrice });
      }
      
      // Wait for transaction to confirm
      await tx.wait();
      
      toast({
        title: "Success!",
        description: `Minted ${quantity} NFT${quantity > 1 ? 's' : ''}!`,
      });
      
      // Refresh drop details to reflect updated supply
      fetchDropDetails();
    } catch (error: any) {
      console.error("Error minting:", error);
      toast({
        title: "Mint Failed",
        description: error.message || "Transaction was not successful",
        variant: "destructive",
      });
    } finally {
      setMinting(false);
    }
  };
  
  const isMintActive = () => {
    if (!drop.isLoaded) return false;
    
    const now = new Date();
    return now >= drop.mintStart && now <= drop.mintEnd;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <Loader className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }
  
  if (!drop.isLoaded) {
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
        <Button variant="outline" size="sm" onClick={() => navigate(`/drop/${slug}`)}>
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
                {drop.logoURI ? (
                  <img 
                    src={drop.logoURI} 
                    alt={drop.name} 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-gray-400 text-center p-8">
                    <div className="text-6xl mb-4">🖼️</div>
                    <p>NFT Preview</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Collection:</span>
                  <span className="font-medium">{drop.name} ({drop.symbol})</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Price:</span>
                  <span className="font-medium">{formatEth(drop.price)} {wallet.chain?.nativeCurrency.symbol || "ETH"}</span>
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
                  <span className="font-medium">{formatEth(drop.price)} {wallet.chain?.nativeCurrency.symbol || "ETH"}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-500">Available:</span>
                  <span className="font-medium">{remainingSupply} / {drop.maxSupply}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-500">Mint Period:</span>
                  <span className="font-medium">{drop.mintStart.toLocaleDateString()} - {drop.mintEnd.toLocaleDateString()}</span>
                </div>
              </div>
              
              {drop.isWhitelistEnabled && (
                <div className={`p-3 rounded-md ${
                  whitelistStatus === 'eligible' ? 'bg-green-50 border border-green-200' :
                  whitelistStatus === 'not-eligible' ? 'bg-red-50 border border-red-200' :
                  'bg-yellow-50 border border-yellow-200'
                }`}>
                  <div className="flex items-center">
                    {whitelistStatus === 'checking' && <Loader className="h-4 w-4 mr-2 animate-spin text-yellow-500" />}
                    {whitelistStatus === 'eligible' && <Check className="h-4 w-4 mr-2 text-green-500" />}
                    {whitelistStatus === 'not-eligible' && <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />}
                    {whitelistStatus === null && <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />}
                    
                    <p className={`text-sm ${
                      whitelistStatus === 'eligible' ? 'text-green-800' :
                      whitelistStatus === 'not-eligible' ? 'text-red-800' :
                      'text-yellow-800'
                    }`}>
                      {whitelistStatus === 'checking' && "Checking whitelist status..."}
                      {whitelistStatus === 'eligible' && "You are on the whitelist!"}
                      {whitelistStatus === 'not-eligible' && "You are not on the whitelist"}
                      {whitelistStatus === null && "This drop requires whitelist access to mint"}
                    </p>
                  </div>
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
                  <span>{formatEth(Number(drop.price) * quantity)} {wallet.chain?.nativeCurrency.symbol || "ETH"}</span>
                </div>
              </div>
              
              {!isConnected ? (
                <Button 
                  onClick={connectWallet}
                  className="w-full"
                >
                  Connect Wallet
                </Button>
              ) : !isMintActive() ? (
                <Button disabled className="w-full">
                  {new Date() < drop.mintStart 
                    ? "Mint Not Started Yet" 
                    : "Mint Ended"}
                </Button>
              ) : remainingSupply === 0 ? (
                <Button disabled className="w-full">
                  Sold Out
                </Button>
              ) : drop.isWhitelistEnabled && whitelistStatus !== 'eligible' ? (
                <Button disabled className="w-full">
                  Not Whitelisted
                </Button>
              ) : (
                <Button 
                  onClick={mintNFTs} 
                  disabled={minting || quantity > remainingSupply || quantity === 0}
                  className="w-full"
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
