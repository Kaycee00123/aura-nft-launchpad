
import React, { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";

interface NetworkDisplayProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
}

const NetworkDisplay: React.FC<NetworkDisplayProps> = ({ 
  className = "", 
  variant = "outline" 
}) => {
  const { wallet, supportedChains, switchToChain } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [switching, setSwitching] = useState<number | null>(null);

  const handleNetworkSwitch = async (chainId: number) => {
    setSwitching(chainId);
    await switchToChain(chainId);
    setSwitching(null);
    setIsOpen(false);
  };

  // If not connected, don't render anything
  if (!wallet.isConnected) {
    return null;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} className={className}>
          {wallet.chain?.name || "Unknown Network"}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Select Network</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {supportedChains.map((chain) => (
          <DropdownMenuItem
            key={chain.id}
            disabled={switching !== null}
            onClick={() => handleNetworkSwitch(chain.id)}
            className={wallet.chainId === chain.id ? "bg-gray-100" : ""}
          >
            <div className="flex items-center justify-between w-full">
              <span>{chain.name}</span>
              {wallet.chainId === chain.id && <Check className="h-4 w-4 ml-2" />}
              {switching === chain.id && (
                <svg className="animate-spin h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NetworkDisplay;
