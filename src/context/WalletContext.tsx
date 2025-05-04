
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { initialWalletState, WalletState, connectWallet } from "@/lib/wallet-utils";

type WalletContextType = {
  wallet: WalletState | null;
  isLoading: boolean;
  isConnected: boolean;
  connectUserWallet: () => Promise<void>;
  disconnectWallet: () => void;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Check for existing wallet connection
  useEffect(() => {
    const storedWallet = localStorage.getItem("wallet");
    if (storedWallet) {
      try {
        setWallet(JSON.parse(storedWallet));
      } catch (error) {
        console.error("Error parsing stored wallet:", error);
      }
    }
  }, []);

  const connectUserWallet = async () => {
    setIsLoading(true);
    try {
      const walletState = await connectWallet();
      setWallet(walletState);
      localStorage.setItem("wallet", JSON.stringify(walletState));
      toast({
        title: "Wallet Connected",
        description: `Connected to ${walletState.address.substring(0, 6)}...${walletState.address.substring(walletState.address.length - 4)}`,
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        variant: "destructive",
        title: "Wallet Connection Failed",
        description: "Could not connect to your wallet.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
    localStorage.removeItem("wallet");
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        isLoading,
        isConnected: !!wallet,
        connectUserWallet,
        disconnectWallet,
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
