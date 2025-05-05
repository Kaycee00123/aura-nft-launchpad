import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/context/WalletContext";
import { NFTDropInterface } from "@/lib/contracts/interfaces";
import { getDropContract } from "@/lib/contracts/contract-utils";
import { ipfsToHttpURL } from "@/lib/ipfs/ipfs-service";
import { Copy, Share, ExternalLink, Loader, CheckCircle } from "lucide-react";
import { ethers } from "ethers";
import Check from "@/components/icons/Check";

const DropSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { wallet, isConnected } = useWallet();

  const [dropAddress, setDropAddress] = useState<string>("");
  const [dropDetails, setDropDetails] = useState<{
    name: string;
    symbol: string;
    logoURI: string;
    creator: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Extract drop address from URL query params
    const params = new URLSearchParams(location.search);
    const address = params.get("address");

    if (address && ethers.utils.isAddress(address)) {
      setDropAddress(address);
      fetchDropDetails(address);
    } else {
      setLoading(false);
    }
  }, [location]);

  const fetchDropDetails = async (address: string) => {
    try {
      if (!isConnected || !wallet.address) {
        setLoading(false);
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const dropContract: NFTDropInterface = getDropContract(address, signer);
      
      const [name, symbol, logoURI, creator] = await Promise.all([
        dropContract.name(),
        dropContract.symbol(),
        dropContract.logoURI(),
        dropContract.creator(),
      ]);
      
      setDropDetails({
        name,
        symbol,
        logoURI: ipfsToHttpURL(logoURI),
        creator
      });
    } catch (error) {
      console.error("Error fetching drop details:", error);
      toast({
        title: "Error",
        description: "Failed to load drop details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyDropLink = () => {
    const url = `${window.location.origin}/drop/${dropAddress}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied",
      description: "Drop link copied to clipboard"
    });
  };

  const copyContractAddress = () => {
    navigator.clipboard.writeText(dropAddress);
    toast({
      title: "Address Copied",
      description: "Contract address copied to clipboard"
    });
  };

  const shareOnTwitter = () => {
    const url = `${window.location.origin}/drop/${dropAddress}`;
    const text = `Check out my new NFT drop: ${dropDetails?.name || "NFT Drop"} on NFT Launchpad!`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!dropAddress || !dropDetails) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Drop Not Found</h2>
        <p className="text-gray-500 mt-2">Could not find details for the created drop</p>
        <Button onClick={() => navigate("/dashboard/create")} className="mt-6">
          Create New Drop
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Card className="border-green-100 bg-green-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <Check className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">Drop Created Successfully!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-8">
            Your NFT drop has been created and is now ready for minting.
          </p>
          
          <div className="flex items-center justify-center mb-8">
            {dropDetails.logoURI ? (
              <img 
                src={dropDetails.logoURI} 
                alt={dropDetails.name} 
                className="w-32 h-32 object-contain rounded-lg border border-gray-200"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No Logo</span>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">{dropDetails.name} ({dropDetails.symbol})</h3>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Contract Address</span>
                <div className="flex items-center">
                  <span className="font-mono text-sm mr-2 truncate max-w-[200px]">
                    {dropAddress}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={copyContractAddress}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Drop Link</span>
                <div className="flex items-center">
                  <span className="font-mono text-sm mr-2 truncate max-w-[200px]">
                    {`${window.location.origin}/drop/${dropAddress}`}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={copyDropLink}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => navigate(`/drop/${dropAddress}`)} 
              className="flex-1"
            >
              View Drop Page
            </Button>
            
            <Button 
              onClick={() => navigate(`/mint/${dropAddress}`)} 
              className="flex-1"
            >
              Go To Mint Page
            </Button>
          </div>
          
          <div className="mt-4 flex gap-4">
            <Button 
              variant="outline" 
              onClick={shareOnTwitter} 
              className="flex-1"
            >
              <Share className="mr-2 h-4 w-4" />
              Share on Twitter
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => {
                const explorerUrl = wallet.chain?.blockExplorers?.default.url;
                if (explorerUrl) {
                  window.open(`${explorerUrl}/address/${dropAddress}`, "_blank");
                }
              }} 
              className="flex-1"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View on Explorer
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center mt-8">
        <Button variant="ghost" onClick={() => navigate("/dashboard/drops")}>
          Back to My Drops
        </Button>
      </div>
    </div>
  );
};

export default DropSuccessPage;
