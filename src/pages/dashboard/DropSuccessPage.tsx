
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Check, Copy, ArrowRight, ArrowLeft, ExternalLink, ImageIcon } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface DropDetails {
  contractAddress: string;
  logoUri?: string;
  bannerUri?: string;
}

const DropSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [dropDetails, setDropDetails] = useState<DropDetails>({
    contractAddress: "",
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Get parameters from URL query params
    const params = new URLSearchParams(location.search);
    const address = params.get("address");
    const logoUri = params.get("logoUri") || "";
    const bannerUri = params.get("bannerUri") || "";
    
    if (!address) {
      navigate("/dashboard/create");
      return;
    }
    
    setDropDetails({
      contractAddress: address,
      logoUri: logoUri || undefined,
      bannerUri: bannerUri || undefined,
    });
  }, [location.search, navigate]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(dropDetails.contractAddress);
    setCopied(true);
    
    toast({
      title: "Address Copied",
      description: "Contract address copied to clipboard",
    });
    
    // Reset the copied state after 3 seconds
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const handleCreateAnother = () => {
    navigate("/dashboard/create");
  };

  const handleViewDrop = () => {
    // In a real app, we would navigate to the drop details page
    navigate(`/drop/new-drop-${dropDetails.contractAddress.substring(0, 6)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Drop Created Successfully!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-500">
            Your NFT drop has been successfully deployed to the blockchain.
          </p>
          
          {/* Display collection branding if available */}
          {(dropDetails.logoUri || dropDetails.bannerUri) && (
            <div className="space-y-4">
              {dropDetails.bannerUri && (
                <div className="rounded-lg overflow-hidden">
                  <AspectRatio ratio={3/1}>
                    <div className="w-full h-full bg-gray-100 relative">
                      {dropDetails.bannerUri.startsWith("ipfs://") ? (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-sm text-gray-500">Banner stored at: {dropDetails.bannerUri}</p>
                        </div>
                      ) : (
                        <img 
                          src={dropDetails.bannerUri} 
                          alt="Collection Banner"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </AspectRatio>
                </div>
              )}
              
              {dropDetails.logoUri && (
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md bg-white">
                    {dropDetails.logoUri.startsWith("ipfs://") ? (
                      <div className="flex items-center justify-center h-full bg-gray-100">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    ) : (
                      <img 
                        src={dropDetails.logoUri} 
                        alt="Collection Logo"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-2">Contract Address</p>
            <div className="flex items-center justify-between gap-2">
              <code className="bg-gray-100 px-3 py-2 rounded text-sm flex-1 text-left overflow-x-auto">
                {dropDetails.contractAddress}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyAddress}
                className="flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Display image URIs if available */}
          {(dropDetails.logoUri || dropDetails.bannerUri) && (
            <div className="bg-gray-50 p-4 rounded-lg text-left space-y-2">
              {dropDetails.logoUri && (
                <div>
                  <p className="text-sm text-gray-500">Logo URI</p>
                  <code className="bg-gray-100 px-3 py-1 rounded text-xs block overflow-x-auto">
                    {dropDetails.logoUri}
                  </code>
                </div>
              )}
              
              {dropDetails.bannerUri && (
                <div>
                  <p className="text-sm text-gray-500">Banner URI</p>
                  <code className="bg-gray-100 px-3 py-1 rounded text-xs block overflow-x-auto">
                    {dropDetails.bannerUri}
                  </code>
                </div>
              )}
            </div>
          )}
          
          <div className="flex flex-col gap-3 pt-2">
            <Button 
              onClick={handleViewDrop}
              className="bg-aura-purple hover:bg-aura-purple-dark w-full"
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              View Drop
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleCreateAnother}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Create Another Drop
            </Button>
            
            <a 
              href={`https://etherscan.io/address/${dropDetails.contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-aura-purple flex items-center justify-center gap-1 mt-2"
            >
              View on Etherscan
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DropSuccessPage;
