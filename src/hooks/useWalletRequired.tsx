
import { useState, useEffect } from 'react';
import { useWallet } from '@/context/WalletContext';
import { useToast } from '@/hooks/use-toast';

export const useWalletRequired = (redirectIfNotConnected: boolean = false) => {
  const { isConnected, wallet, walletDetected } = useWallet();
  const { toast } = useToast();
  const [isCheckingWallet, setIsCheckingWallet] = useState(true);

  useEffect(() => {
    // Check wallet connection status
    const checkWallet = async () => {
      setIsCheckingWallet(true);
      
      if (!isConnected) {
        if (!walletDetected) {
          toast({
            title: "No Wallet Detected",
            description: "Please install MetaMask or another Web3 wallet to continue",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Wallet Required",
            description: "Please connect your wallet to continue",
            variant: "destructive",
          });
        }
        
        if (redirectIfNotConnected) {
          // Could add redirect logic here if needed
        }
      }
      
      setIsCheckingWallet(false);
    };
    
    checkWallet();
  }, [isConnected, redirectIfNotConnected, toast, walletDetected]);

  return {
    isConnected,
    isCheckingWallet,
    wallet,
    walletDetected
  };
};
