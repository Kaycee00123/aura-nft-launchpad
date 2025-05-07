
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { shortenAddress } from "@/lib/wallet-utils";

interface WalletButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

const WalletButton: React.FC<WalletButtonProps> = ({
  className = "",
  variant = "default",
  size = "default",
}) => {
  const { wallet, isConnected, isLoading, connectWallet, disconnectWallet } = useWallet();

  if (isLoading) {
    return (
      <Button variant={variant} size={size} className={`${className}`} disabled>
        <Loader className="h-4 w-4 mr-2 animate-spin" />
        Connecting...
      </Button>
    );
  }

  if (!isConnected) {
    return (
      <Button
        variant={variant}
        size={size}
        className={`${className}`}
        onClick={connectWallet}
      >
        Connect Wallet
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`${className}`}
        >
          {wallet.chain?.name && (
            <span className="mr-2 text-xs px-1.5 py-0.5 bg-green-100 text-green-800 rounded-md">
              {wallet.chain.name}
            </span>
          )}
          {shortenAddress(wallet.address)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Wallet</DropdownMenuLabel>
        <DropdownMenuItem className="font-mono text-xs">
          {wallet.address}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex justify-between">
          <span>Balance</span>
          <span className="font-medium">{wallet.balance} {wallet.chain?.currency || 'ETH'}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
          onClick={disconnectWallet}
        >
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WalletButton;
