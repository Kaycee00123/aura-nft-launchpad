
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NetworkDisplayProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
}

const NetworkDisplay: React.FC<NetworkDisplayProps> = ({ 
  className = "", 
  variant = "outline" 
}) => {
  const { wallet, isConnected, switchToChain, supportedChains } = useWallet();
  
  if (!isConnected) {
    return null;
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="sm" className={`${className || ""} flex items-center`}>
          {wallet.chain?.name || "Unknown Network"}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Select Network</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {supportedChains.map((chain) => (
          <DropdownMenuItem 
            key={chain.id}
            className={wallet.chainId === chain.id ? "bg-accent" : ""}
            onClick={() => switchToChain(chain.id)}
          >
            {chain.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NetworkDisplay;
