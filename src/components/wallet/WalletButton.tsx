
import React from "react";
import { Button } from "@/components/ui/button";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWallet } from "@/context/WalletContext";
import { Wallet } from "lucide-react";

interface WalletButtonProps {
  variant?: "default" | "outline" | "ghost";
}

export const WalletButton: React.FC<WalletButtonProps> = ({ variant = "outline" }) => {
  const { walletDetected } = useWallet();

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button 
                    variant={variant} 
                    className="font-medium border-aura-purple text-aura-purple hover:bg-aura-purple/10"
                    onClick={openConnectModal}
                    disabled={!walletDetected}
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    {!walletDetected ? "Install Wallet" : "Connect Wallet"}
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button 
                    variant="destructive"
                    onClick={openChainModal}
                  >
                    Wrong network
                  </Button>
                );
              }

              return (
                <div className="flex gap-2">
                  <Button
                    variant={variant}
                    className="hidden md:flex font-medium border-gray-300"
                    onClick={openChainModal}
                  >
                    {chain.name}
                  </Button>
                  <Button
                    variant={variant}
                    className="font-medium border-aura-purple text-aura-purple hover:bg-aura-purple/10"
                    onClick={openAccountModal}
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    {account.displayName}
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default WalletButton;
