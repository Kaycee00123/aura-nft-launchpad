
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
import { Wallet, Copy, ExternalLink, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WalletButtonProps {
  variant?: "default" | "outline" | "ghost";
}

const shortenAddress = (address: string | undefined): string => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const WalletButton: React.FC<WalletButtonProps> = ({ variant = "outline" }) => {
  const { wallet, isConnected, connectWallet, disconnectWallet } = useWallet();
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

  if (!isConnected) {
    return (
      <Button 
        variant={variant} 
        className="font-medium border-aura-purple text-aura-purple hover:bg-aura-purple/10"
        onClick={connectWallet}
      >
        <Wallet className="h-4 w-4 mr-2" />
        Connect Wallet
      </Button>
    );
  }

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
              {parseFloat(wallet.balance).toFixed(4)} {wallet.chain?.nativeCurrency?.symbol || "ETH"}
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
