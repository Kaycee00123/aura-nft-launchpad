
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  useAccount, 
  useConnect,
  useDisconnect, 
  useBalance, 
  useChainId,
  useSwitchChain,
  useWalletClient
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
  walletDetected: boolean;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<string>("0");
  const [walletDetected, setWalletDetected] = useState<boolean>(false);
  
  // Wagmi hooks
  const { address, isConnected, status: accountStatus } = useAccount();
  const { connectAsync, connectors, isPending: isConnectPending, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { data: walletClient } = useWalletClient();
  
  // Get balance using wagmi hook
  const balanceQuery = useBalance({
    address,
  });

  // More robust wallet detection logic
  useEffect(() => {
    const checkWalletAvailability = async () => {
      // Check multiple wallet indicators
      const hasInjectedEthereum = typeof window !== 'undefined' && 
                                window.ethereum !== undefined;
      
      // Check if any connectors are available and ready
      const hasReadyConnector = connectors.some(connector => connector.ready);
      
      // Additional browser wallet detection methods
      const hasEthereumRequest = typeof window !== 'undefined' && 
                               typeof window.ethereum?.request === 'function';
      
      const walletIsDetected = hasInjectedEthereum || hasReadyConnector || hasEthereumRequest;
      
      console.log("Wallet detection results:", { 
        hasInjectedEthereum, 
        hasReadyConnector,
        hasEthereumRequest,
        walletIsDetected,
        availableConnectors: connectors.map(c => ({ id: c.id, name: c.name, ready: c.ready }))
      });
      
      setWalletDetected(walletIsDetected);
    };
    
    checkWalletAvailability();
    
    // Re-check when window is focused (in case wallet was installed/enabled)
    const handleFocus = () => checkWalletAvailability();
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [connectors]);

  // Handle connection errors
  useEffect(() => {
    if (connectError) {
      console.error("Wallet connection error:", connectError);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: connectError.message || "Failed to connect wallet. Please try again.",
      });
    }
  }, [connectError, toast]);

  // Update balance when it changes
  useEffect(() => {
    if (balanceQuery.data) {
      setBalance(balanceQuery.data.formatted);
    }
  }, [balanceQuery.data]);

  // Find the current chain from supportedChains
  const currentChain = supportedChains.find(chain => chain.id === chainId);

  // Connect wallet function that leverages Rainbow Kit's connection flow
  const connectWallet = async () => {
    try {
      setIsLoading(true);
      
      // Let RainbowKit handle the connection flow
      // This is a simpler implementation as RainbowKit handles most of the complexity
      const readyConnector = connectors.find(c => c.ready);
      
      if (readyConnector) {
        await connectAsync({ connector: readyConnector });
        toast({
          title: "Wallet Connected",
          description: "Your wallet has been connected successfully.",
        });
      } else {
        console.error("No available connectors found");
        toast({
          variant: "destructive",
          title: "Connection Failed",
          description: "No available wallet connectors found. Please install a wallet extension like MetaMask.",
        });
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet. Please try refreshing the page.",
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
  const switchToChain = async (targetChainId: number): Promise<boolean> => {
    if (!switchChainAsync) {
      toast({
        variant: "destructive",
        title: "Network Switch Unavailable",
        description: "Cannot switch networks in the current context.",
      });
      return false;
    }

    try {
      setIsLoading(true);
      await switchChainAsync({ chainId: targetChainId });
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
    chainId,
    balance,
    chain: currentChain,
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
        walletDetected,
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

// Declare ethereum property on window object for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
