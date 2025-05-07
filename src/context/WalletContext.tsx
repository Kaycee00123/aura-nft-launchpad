
import React, { createContext, useContext } from "react";
import { Chain } from "@/lib/wallet-utils";

// Define proper types for our wallet context
type WalletContextType = {
  wallet: {
    isConnected: boolean;
    address: string | undefined;
    chainId: number | undefined;
    balance: string;
    chain: Chain | null;
  };
  isLoading: boolean;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToChain: (chainId: number) => Promise<boolean>;
  supportedChains: any[];
  connectUserWallet: () => Promise<void>;
  walletDetected: boolean;
};

// Create a mock wallet context with dummy functions
const mockWalletContext: WalletContextType = {
  wallet: {
    isConnected: false,
    address: undefined,
    chainId: undefined,
    balance: "0",
    chain: null,
  },
  isLoading: false,
  isConnected: false,
  connectWallet: async () => {
    console.log("Wallet connection removed");
  },
  disconnectWallet: () => {
    console.log("Wallet disconnection removed");
  },
  switchToChain: async () => {
    console.log("Chain switching removed");
    return false;
  },
  supportedChains: [],
  connectUserWallet: async () => {
    console.log("User wallet connection removed");
  },
  walletDetected: false,
};

const WalletContext = createContext<WalletContextType>(mockWalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <WalletContext.Provider value={mockWalletContext}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  return useContext(WalletContext);
};
