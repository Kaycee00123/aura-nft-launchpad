
import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import {
  initialWalletState,
  WalletState,
  Chain,
  SUPPORTED_CHAINS,
  isSupportedChain,
  switchChain,
  getChainById,
  getWalletBalance,
  shortenAddress
} from "@/lib/wallet-utils";

type WalletContextType = {
  wallet: WalletState;
  isLoading: boolean;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToChain: (chainId: number) => Promise<boolean>;
  supportedChains: Chain[];
  connectUserWallet: () => Promise<void>; // Add this function to match what's used in DropDetails
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState>(initialWalletState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Check for existing wallet connection
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        try {
          // Check if already connected
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            await handleAccountsChanged(accounts);
          }
        } catch (error) {
          console.error("Error checking existing connection:", error);
        }
      }
    };
    
    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      disconnectWallet();
      return;
    }

    setIsLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const chainId = (await provider.getNetwork()).chainId;
      const balance = await getWalletBalance(provider, address);
      const chain = getChainById(chainId);

      const walletState: WalletState = {
        isConnected: true,
        address,
        chainId,
        balance,
        provider,
        signer,
        chain: chain || null,
      };

      setWallet(walletState);
      localStorage.setItem("wallet_connected", "true");
      
      // Only show toast if this was an explicit connection, not a restoration
      if (accounts.length > 0 && !wallet.isConnected) {
        toast({
          title: "Wallet Connected",
          description: `Connected to ${shortenAddress(address)}`,
        });
      }
    } catch (error) {
      console.error("Error handling accounts changed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChainChanged = async (chainIdHex: string) => {
    const chainId = parseInt(chainIdHex, 16);
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = wallet.address || await signer.getAddress();
      const balance = address ? await getWalletBalance(provider, address) : null;
      const chain = getChainById(chainId);

      setWallet(prev => ({
        ...prev,
        chainId,
        provider,
        signer,
        balance,
        chain: chain || null,
      }));
      
      toast({
        title: "Network Changed",
        description: chain 
          ? `Connected to ${chain.name}`
          : `Connected to unsupported network (${chainId})`,
        variant: chain ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error handling chain changed:", error);
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    
    try {
      // Check if ethereum is available (MetaMask or other wallet)
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // Request accounts
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length === 0) {
          throw new Error("No accounts returned");
        }
        
        await handleAccountsChanged(accounts);
      } else {
        toast({
          variant: "destructive",
          title: "No wallet detected",
          description: "Please install MetaMask or another compatible wallet",
        });
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add connectUserWallet as alias for connectWallet to match DropDetails usage
  const connectUserWallet = connectWallet;

  const disconnectWallet = () => {
    setWallet(initialWalletState);
    localStorage.removeItem("wallet_connected");
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  const switchToChain = async (chainId: number): Promise<boolean> => {
    if (!wallet.isConnected || !window.ethereum) {
      toast({
        variant: "destructive",
        title: "Not connected",
        description: "Please connect your wallet first",
      });
      return false;
    }

    try {
      const success = await switchChain(window.ethereum, chainId);
      if (!success) {
        toast({
          variant: "destructive",
          title: "Failed to switch network",
          description: "Please try again or add the network manually",
        });
      }
      return success;
    } catch (error) {
      console.error("Error switching chain:", error);
      toast({
        variant: "destructive",
        title: "Network Switch Failed",
        description: "Could not switch to the requested network",
      });
      return false;
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        isLoading,
        isConnected: wallet.isConnected,
        connectWallet,
        disconnectWallet,
        switchToChain,
        supportedChains: SUPPORTED_CHAINS,
        connectUserWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
