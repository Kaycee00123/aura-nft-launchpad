
import React from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

interface NetworkDisplayProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
}

const NetworkDisplay: React.FC<NetworkDisplayProps> = ({ 
  className = "", 
  variant = "outline" 
}) => {
  const { isConnected } = useWallet();
  
  // If not connected, don't render anything
  if (!isConnected) {
    return null;
  }

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openChainModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;
        
        if (!connected) return null;

        return (
          <Button 
            variant={variant} 
            className={className}
            onClick={openChainModal}
          >
            {chain?.name || "Unknown Network"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default NetworkDisplay;
