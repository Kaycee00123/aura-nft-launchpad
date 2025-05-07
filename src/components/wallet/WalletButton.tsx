
import React from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface WalletButtonProps {
  variant?: "default" | "outline" | "ghost";
}

export const WalletButton: React.FC<WalletButtonProps> = ({ variant = "outline" }) => {
  return (
    <Button 
      variant={variant} 
      className="font-medium border-aura-purple text-aura-purple hover:bg-aura-purple/10"
      disabled={true}
    >
      <Wallet className="h-4 w-4 mr-2" />
      Connect Wallet
    </Button>
  );
};

export default WalletButton;
