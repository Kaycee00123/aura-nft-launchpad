
import React from "react";
import { useWalletRequired } from "@/hooks/useWalletRequired";
import ConnectWalletPrompt from "@/components/wallet/ConnectWalletPrompt";
import CreateDropForm from "@/components/drops/CreateDropForm";

const CreateDrop = () => {
  // Check if wallet is connected
  const { isConnected, isCheckingWallet } = useWalletRequired();

  // If wallet connection check is in progress, show loading
  if (isCheckingWallet) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Create New NFT Drop</h1>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aura-purple"></div>
        </div>
      </div>
    );
  }

  // If wallet is not connected, show the connect wallet prompt
  if (!isConnected) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Create New NFT Drop</h1>
        <div className="max-w-md mx-auto">
          <ConnectWalletPrompt 
            title="Connect Wallet to Create Drop" 
            description="You need to connect your wallet to create an NFT drop"
            requiredAction="create a drop"
          />
        </div>
      </div>
    );
  }
  
  // Main form render when wallet is connected
  return (
    <div className="container max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create New NFT Drop</h1>
      <CreateDropForm />
    </div>
  );
};

export default CreateDrop;
