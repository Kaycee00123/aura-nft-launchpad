
import { toast } from "@/components/ui/use-toast";

export type WalletState = {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  balance: string | null;
  isConnecting: boolean;
};

export const initialWalletState: WalletState = {
  isConnected: false,
  address: null,
  chainId: null,
  balance: null,
  isConnecting: false,
};

// Simplified mock function for wallet connection
export const connectWallet = async (): Promise<WalletState> => {
  try {
    // Check if ethereum is available (MetaMask)
    if (typeof window !== 'undefined' && window.ethereum) {
      // Request accounts
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const balance = await window.ethereum.request({ 
        method: 'eth_getBalance',
        params: [accounts[0], 'latest']
      });
      
      const formattedBalance = parseInt(balance, 16) / 10**18; // Convert wei to ETH

      toast({
        title: "Wallet Connected",
        description: `Connected to ${shortenAddress(accounts[0])}`,
      });

      return {
        isConnected: true,
        address: accounts[0],
        chainId: parseInt(chainId, 16),
        balance: formattedBalance.toFixed(4),
        isConnecting: false,
      };
    } else {
      toast({
        variant: "destructive",
        title: "MetaMask not found",
        description: "Please install MetaMask to connect your wallet",
      });
      return initialWalletState;
    }
  } catch (error) {
    console.error("Error connecting wallet:", error);
    toast({
      variant: "destructive",
      title: "Connection Failed",
      description: "Failed to connect wallet. Please try again.",
    });
    return initialWalletState;
  }
};

export const shortenAddress = (address: string | null): string => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Declare ethereum property on window object for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
