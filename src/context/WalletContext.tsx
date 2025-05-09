
import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  createWeb3Modal,
  useWeb3Modal
} from '@web3modal/wagmi/react';
import { 
  useAccount, 
  useBalance, 
  useDisconnect,
  useChainId,
  useSwitchChain,
  createConfig,
} from 'wagmi';
import { Chain, SUPPORTED_CHAINS, getChainById } from "@/lib/wallet-utils";
import { useToast } from "@/hooks/use-toast";
import { mainnet, arbitrum, base, sepolia } from 'wagmi/chains';

// Project ID from WalletConnect - Replace with your actual Project ID
const projectId = 'YOUR_WALLET_CONNECT_PROJECT_ID';

// Convert our custom chains to wagmi chain format
const wagmiChains = [
  mainnet, base, arbitrum, sepolia,
  // Additional custom chains can go here
];

// Create wagmi config with compatible API
const wagmiConfig = createConfig({
  chains: wagmiChains,
  transports: {
    [mainnet.id]: { url: mainnet.rpcUrls.default.http[0] },
    [base.id]: { url: base.rpcUrls.default.http[0] },
    [arbitrum.id]: { url: arbitrum.rpcUrls.default.http[0] },
    [sepolia.id]: { url: sepolia.rpcUrls.default.http[0] },
  },
  connectors: [
    {
      id: 'walletConnect',
      type: 'walletConnect',
      init: (config) => ({
        projectId,
        metadata: {
          name: 'NFT Launchpad',
          description: 'On-chain NFT Launchpad platform',
          url: typeof window !== 'undefined' ? window.location.origin : '',
          icons: typeof window !== 'undefined' ? [`${window.location.origin}/favicon.ico`] : []
        },
        showQrModal: true,
      }),
    }
  ]
});

// Create Web3Modal instance
createWeb3Modal({
  wagmiConfig,
  projectId,
  enableAnalytics: false, // Optional
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#6d28d9', // Purple accent color
  },
});

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
  supportedChains: Chain[];
  connectUserWallet: () => Promise<void>;
  walletDetected: boolean;
};

// Create a default wallet context with empty functions
const defaultWalletContext: WalletContextType = {
  wallet: {
    isConnected: false,
    address: undefined,
    chainId: undefined,
    balance: "0",
    chain: null,
  },
  isLoading: false,
  isConnected: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  switchToChain: async () => false,
  supportedChains: SUPPORTED_CHAINS,
  connectUserWallet: async () => {},
  walletDetected: false,
};

const WalletContext = createContext<WalletContextType>(defaultWalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { address, isConnected, connector } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { disconnect } = useDisconnect();
  const [isLoading, setIsLoading] = useState(false);
  const [walletDetected, setWalletDetected] = useState(false);
  const { open } = useWeb3Modal();
  
  // Check for wallet providers on component mount
  useEffect(() => {
    const checkForWallets = async () => {
      const hasInjectedProvider = typeof window !== 'undefined' && 
        (window.ethereum || (window as any).coinbaseWalletExtension);
      setWalletDetected(hasInjectedProvider);
    };
    
    checkForWallets();
  }, []);
  
  // Get balance of connected account
  const { data: balanceData } = useBalance({
    address: address,
  });
  
  // Format balance for display
  const balance = balanceData ? balanceData.formatted.substring(0, 6) : "0";
  
  // Convert chain id to our Chain type
  const currentChain = chainId ? getChainById(chainId) : null;
  
  // Connect wallet using Web3Modal
  const connectWallet = async () => {
    try {
      setIsLoading(true);
      await open();
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: error.message || "Could not connect to wallet",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Disconnect wallet
  const disconnectWallet = () => {
    try {
      disconnect();
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };
  
  // Switch to a different chain
  const switchToChain = async (chainId: number): Promise<boolean> => {
    if (!isConnected) {
      return false;
    }
    
    try {
      setIsLoading(true);
      await switchChain({ chainId });
      return true;
    } catch (error: any) {
      console.error("Error switching chain:", error);
      toast({
        title: "Network Switch Failed",
        description: error.message || "Could not switch networks",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Legacy method for backward compatibility
  const connectUserWallet = async () => {
    await connectWallet();
  };
  
  // Prepare context value
  const walletContextValue: WalletContextType = {
    wallet: {
      isConnected,
      address,
      chainId,
      balance,
      chain: currentChain,
    },
    isLoading,
    isConnected,
    connectWallet,
    disconnectWallet,
    switchToChain,
    supportedChains: SUPPORTED_CHAINS,
    connectUserWallet,
    walletDetected,
  };
  
  return (
    <WalletContext.Provider value={walletContextValue}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  return useContext(WalletContext);
};
