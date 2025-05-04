
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  useAccount, 
  useConnect, 
  useDisconnect, 
  useBalance, 
  useNetwork, 
  useSwitchNetwork 
} from 'wagmi'
import { supportedChains } from "@/lib/wallet-config";
import { type Address } from 'viem'

type WalletContextType = {
  wallet: {
    isConnected: boolean;
    address: Address | undefined;
    chainId: number | undefined;
    balance: string;
    chain: any;
  };
  isLoading: boolean;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToChain: (chainId: number) => Promise<boolean>;
  supportedChains: typeof supportedChains;
  connectUserWallet: () => Promise<void>; 
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<string>("0");
  
  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  
  // Get balance using wagmi hook
  const balanceQuery = useBalance({
    address,
    enabled: !!address,
  });

  // Update balance when it changes
  useEffect(() => {
    if (balanceQuery.data) {
      setBalance(balanceQuery.data.formatted);
    }
  }, [balanceQuery.data]);

  // Connect wallet function
  const connectWallet = async () => {
    try {
      setIsLoading(true);
      
      // Find the first connector that's ready (usually injected or WalletConnect)
      const connector = connectors.find(c => c.ready);
      
      if (connector) {
        await connect({ connector });
        toast({
          title: "Wallet Connected",
          description: "Your wallet has been connected successfully.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Connection Failed",
          description: "No available wallet connectors found.",
        });
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add connectUserWallet as alias for connectWallet
  const connectUserWallet = connectWallet;

  // Disconnect wallet function
  const disconnectWallet = () => {
    try {
      disconnect();
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      });
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  // Switch network function
  const switchToChain = async (chainId: number): Promise<boolean> => {
    if (!switchNetwork) {
      toast({
        variant: "destructive",
        title: "Network Switch Unavailable",
        description: "Cannot switch networks in the current context.",
      });
      return false;
    }

    try {
      setIsLoading(true);
      await switchNetwork(chainId);
      return true;
    } catch (error: any) {
      console.error("Error switching network:", error);
      toast({
        variant: "destructive",
        title: "Network Switch Failed",
        description: error.message || "Failed to switch networks.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Current wallet state
  const walletState = {
    isConnected,
    address,
    chainId: chain?.id,
    balance,
    chain,
  };

  return (
    <WalletContext.Provider
      value={{
        wallet: walletState,
        isLoading,
        isConnected,
        connectWallet,
        disconnectWallet,
        switchToChain,
        supportedChains,
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
