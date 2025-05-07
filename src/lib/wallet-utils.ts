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
  provider: any | null;
  signer: any | null;
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

// Simplified utility functions that no longer perform actual wallet operations
export const isSupportedChain = (): boolean => false;
export const switchChain = async (): Promise<boolean> => false;
export const getWalletBalance = async (): Promise<string> => '0';
export const connectWallet = async (): Promise<WalletState> => initialWalletState;
