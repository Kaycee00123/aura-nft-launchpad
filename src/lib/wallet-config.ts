
// This file is kept minimal after removing wallet connection functionality
import { Chain } from 'wagmi/chains';

// Define custom chains matching the Chain type structure
// These are kept for reference but won't be used for connections
const abstractMainnet: Chain = {
  id: 11124,
  name: 'Abstract Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Abstract',
    symbol: 'ABS',
  },
  rpcUrls: {
    public: { http: ['https://api.mainnet.abs.xyz'] },
    default: { http: ['https://api.mainnet.abs.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Abstract Explorer', url: 'https://abscan.org/' },
  },
};

const abstractTestnet: Chain = {
  id: 2741,
  name: 'Abstract Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Abstract',
    symbol: 'ABS',
  },
  rpcUrls: {
    public: { http: ['https://api.testnet.abs.xyz'] },
    default: { http: ['https://api.testnet.abs.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Abstract Testnet Explorer', url: 'https://sepolia.abscan.org/' },
  },
};

// All supported chains (kept for reference)
export const supportedChains = [
  { id: 1, name: 'Ethereum' },
  { id: 11124, name: 'Abstract Mainnet' },
  { id: 2741, name: 'Abstract Testnet' },
  { id: 10143, name: 'Monad Testnet' },
  { id: 8453, name: 'Base' },
  { id: 42161, name: 'Arbitrum' },
  { id: 1116, name: 'Core' },
];

// Empty config object since we're removing wallet connection
export const config = {};
