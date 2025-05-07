
export type Chain = {
  id: number;
  name: string;
  network: string;
  rpcUrl: string;
  currency: string;
  explorerUrl: string;
  blockExplorers?: {
    default: {
      name: string;
      url: string;
    };
  };
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
};

export const SUPPORTED_CHAINS: Chain[] = [
  {
    id: 11124,
    name: "Abstract Mainnet",
    network: "abstract",
    rpcUrl: "https://api.mainnet.abs.xyz",
    currency: "ABS",
    explorerUrl: "https://abscan.org/",
    blockExplorers: {
      default: { name: "Abstract Explorer", url: "https://abscan.org/" }
    },
    nativeCurrency: {
      name: "Abstract",
      symbol: "ABS",
      decimals: 18
    }
  },
  {
    id: 2741,
    name: "Abstract Testnet",
    network: "abstract-testnet",
    rpcUrl: "https://api.testnet.abs.xyz",
    currency: "ABS",
    explorerUrl: "https://sepolia.abscan.org/",
    blockExplorers: {
      default: { name: "Abstract Testnet Explorer", url: "https://sepolia.abscan.org/" }
    },
    nativeCurrency: {
      name: "Abstract",
      symbol: "ABS",
      decimals: 18
    }
  },
  {
    id: 10143,
    name: "Monad Testnet",
    network: "monad-testnet",
    rpcUrl: "https://rpc.testnet.monad.xyz/",
    currency: "MONAD",
    explorerUrl: "https://explorer.testnet.monad.xyz",
    blockExplorers: {
      default: { name: "Monad Testnet Explorer", url: "https://explorer.testnet.monad.xyz" }
    },
    nativeCurrency: {
      name: "Monad",
      symbol: "MONAD",
      decimals: 18
    }
  },
  {
    id: 8453,
    name: "Base",
    network: "base",
    rpcUrl: "https://mainnet.base.org",
    currency: "ETH",
    explorerUrl: "https://basescan.org",
    blockExplorers: {
      default: { name: "Base Explorer", url: "https://basescan.org" }
    },
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18
    }
  },
  {
    id: 42161,
    name: "Arbitrum",
    network: "arbitrum",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    currency: "ETH",
    explorerUrl: "https://arbiscan.io",
    blockExplorers: {
      default: { name: "Arbitrum Explorer", url: "https://arbiscan.io" }
    },
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18
    }
  },
  {
    id: 1116,
    name: "Core",
    network: "core",
    rpcUrl: "https://rpc.coredao.org",
    currency: "CORE",
    explorerUrl: "https://scan.coredao.org",
    blockExplorers: {
      default: { name: "Core Explorer", url: "https://scan.coredao.org" }
    },
    nativeCurrency: {
      name: "Core",
      symbol: "CORE",
      decimals: 18
    }
  },
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

export const shortenAddress = (address: string | null | undefined): string => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
