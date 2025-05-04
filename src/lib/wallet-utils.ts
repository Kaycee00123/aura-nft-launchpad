
import { ethers } from "ethers";

export type Chain = {
  id: number;
  name: string;
  network: string;
  rpcUrl: string;
  currency: string;
  explorerUrl: string;
};

export const SUPPORTED_CHAINS: Chain[] = [
  {
    id: 11124,
    name: "Abstract Mainnet",
    network: "abstract",
    rpcUrl: "https://api.mainnet.abs.xyz",
    currency: "ABS",
    explorerUrl: "https://abscan.org/",
  },
  {
    id: 2741,
    name: "Abstract Testnet",
    network: "abstract-testnet",
    rpcUrl: "https://api.testnet.abs.xyz",
    currency: "ABS",
    explorerUrl: "https://sepolia.abscan.org/",
  },
  {
    id: 10143,
    name: "Monad Testnet",
    network: "monad-testnet",
    rpcUrl: "https://rpc.testnet.monad.xyz/",
    currency: "MONAD",
    explorerUrl: "https://explorer.testnet.monad.xyz",
  },
  {
    id: 8453,
    name: "Base",
    network: "base",
    rpcUrl: "https://mainnet.base.org",
    currency: "ETH",
    explorerUrl: "https://basescan.org",
  },
  {
    id: 42161,
    name: "Arbitrum",
    network: "arbitrum",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    currency: "ETH",
    explorerUrl: "https://arbiscan.io",
  },
  {
    id: 1116,
    name: "Core",
    network: "core",
    rpcUrl: "https://rpc.coredao.org",
    currency: "CORE",
    explorerUrl: "https://scan.coredao.org",
  },
  // Add more chains as needed
];

export type WalletState = {
  isConnected: boolean;
  address: string | null;
  chainId: number | null; 
  balance: string | null;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  chain: Chain | null;
};

export const initialWalletState: WalletState = {
  isConnected: false,
  address: null,
  chainId: null,
  balance: null,
  provider: null,
  signer: null,
  chain: null,
};

export const getChainById = (chainId: number): Chain | undefined => {
  return SUPPORTED_CHAINS.find(chain => chain.id === chainId);
};

export const shortenAddress = (address: string | null): string => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Check if the user is on a supported chain
export const isSupportedChain = (chainId: number | null): boolean => {
  if (!chainId) return false;
  return SUPPORTED_CHAINS.some(chain => chain.id === chainId);
};

// Request chain switch
export const switchChain = async (provider: any, targetChainId: number): Promise<boolean> => {
  try {
    const targetChain = getChainById(targetChainId);
    if (!targetChain) return false;

    try {
      // Request switch to existing chain
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
      return true;
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${targetChainId.toString(16)}`,
                chainName: targetChain.name,
                nativeCurrency: {
                  name: targetChain.currency,
                  symbol: targetChain.currency,
                  decimals: 18,
                },
                rpcUrls: [targetChain.rpcUrl],
                blockExplorerUrls: [targetChain.explorerUrl],
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error('Error adding chain:', addError);
          return false;
        }
      }
      console.error('Error switching chain:', switchError);
      return false;
    }
  } catch (error) {
    console.error('Error in switchChain:', error);
    return false;
  }
};

// Get the user's ETH balance
export const getWalletBalance = async (provider: ethers.providers.Web3Provider, address: string): Promise<string> => {
  try {
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error('Error getting balance:', error);
    return '0';
  }
};

// Add the missing connectWallet function
export const connectWallet = async (): Promise<WalletState> => {
  try {
    // Check if ethereum is available
    if (typeof window !== 'undefined' && window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Request accounts
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length === 0) {
        throw new Error("No accounts returned");
      }
      
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const chainId = (await provider.getNetwork()).chainId;
      const balance = await getWalletBalance(provider, address);
      const chain = getChainById(chainId);

      return {
        isConnected: true,
        address,
        chainId,
        balance,
        provider,
        signer,
        chain: chain || null,
      };
    } else {
      throw new Error("No wallet detected");
    }
  } catch (error: any) {
    console.error("Error connecting wallet:", error);
    throw error;
  }
};

// Declare ethereum property on window object for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
