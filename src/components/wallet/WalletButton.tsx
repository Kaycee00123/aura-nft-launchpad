
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/WalletContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wallet, Copy, ExternalLink, LogOut, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WalletButtonProps {
  variant?: "default" | "outline" | "ghost";
}

const shortenAddress = (address: string | undefined): string => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const WalletButton: React.FC<WalletButtonProps> = ({ variant = "outline" }) => {
  const { wallet, isConnected, connectWallet, disconnectWallet, walletDetected } = useWallet();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const copyAddressToClipboard = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
      setIsOpen(false);
    }
  };

  const openBlockExplorer = () => {
    if (wallet.address && wallet.chain?.blockExplorers?.default?.url) {
      window.open(`${wallet.chain.blockExplorers.default.url}/address/${wallet.address}`, "_blank");
      setIsOpen(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setIsOpen(false);
  };
  
  const handleConnectClick = async () => {
    if (!walletDetected) {
      // If no wallet is detected, show instructions
      toast({
        variant: "warning",
        title: "No Wallet Detected",
        description: "Please install MetaMask or another Web3 wallet extension to continue.",
      });
    } else {
      // If wallet is detected, try to connect
      await connectWallet();
    }
  };

  if (!isConnected) {
    return (
      <Button 
        variant={variant} 
        className="font-medium border-aura-purple text-aura-purple hover:bg-aura-purple/10"
        onClick={handleConnectClick}
      >
        {!walletDetected ? (
          <>
            <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
            Install Wallet
          </>
        ) : (
          <>
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </>
        )}
      </Button>
    );
  }

  // Get the current chain symbol
  const chainSymbol = wallet.chain?.nativeCurrency?.symbol || "ETH";

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant}
          className="font-medium border-aura-purple text-aura-purple hover:bg-aura-purple/10"
        >
          <Wallet className="h-4 w-4 mr-2" />
          {shortenAddress(wallet.address)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <div className="px-2 py-2 text-sm">
          <p className="text-gray-500">Connected to</p>
          <p className="font-medium">{wallet.chain?.name || "Unknown Network"}</p>
          {wallet.balance && (
            <p className="mt-1 font-mono text-sm">
              {parseFloat(wallet.balance).toFixed(4)} {chainSymbol}
            </p>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyAddressToClipboard}>
          <Copy className="h-4 w-4 mr-2" /> Copy Address
        </DropdownMenuItem>
        {wallet.chain?.blockExplorers?.default?.url && (
          <DropdownMenuItem onClick={openBlockExplorer}>
            <ExternalLink className="h-4 w-4 mr-2" /> View on Explorer
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDisconnect}>
          <LogOut className="h-4 w-4 mr-2" /> Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WalletButton;
