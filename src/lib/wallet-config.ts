
import { createConfig, http } from 'wagmi'
import { mainnet, base, arbitrum, sepolia } from 'wagmi/chains'
import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import { 
  metaMaskWallet, 
  walletConnectWallet, 
  injectedWallet,
  coinbaseWallet, 
  rainbowWallet,
  braveWallet,
  trustWallet
} from '@rainbow-me/rainbowkit/wallets'
import { type Chain } from 'wagmi/chains'

// Define custom chains matching the Chain type structure
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
}

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
}

const monadTestnet: Chain = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MONAD',
  },
  rpcUrls: {
    public: { http: ['https://rpc.testnet.monad.xyz/'] },
    default: { http: ['https://rpc.testnet.monad.xyz/'] },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://testnet.monadexplorer.com/' },
  },
}

const core: Chain = {
  id: 1116,
  name: 'Core',
  nativeCurrency: {
    decimals: 18,
    name: 'Core',
    symbol: 'CORE',
  },
  rpcUrls: {
    public: { http: ['https://rpc.coredao.org'] },
    default: { http: ['https://rpc.coredao.org'] },
  },
  blockExplorers: {
    default: { name: 'Core Explorer', url: 'https://scan.coredao.org' },
  },
}

// All supported chains
export const supportedChains = [
  mainnet,
  sepolia,
  base,
  arbitrum,
  abstractMainnet,
  abstractTestnet,
  monadTestnet,
  core,
] as const;

// Project ID from WalletConnect Cloud
const projectId = '6f7da8ecb5707a7c8340093786426533';

// Set up connectors for Rainbow Kit
const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({ projectId, chains: supportedChains }),
      walletConnectWallet({ projectId, chains: supportedChains }),
      coinbaseWallet({ appName: 'AURA NFT', chains: supportedChains }),
    ],
  },
  {
    groupName: 'Other Wallets',
    wallets: [
      injectedWallet({ chains: supportedChains }),
      rainbowWallet({ projectId, chains: supportedChains }),
      braveWallet({ chains: supportedChains }),
      trustWallet({ projectId, chains: supportedChains })
    ],
  },
]);

// Create wagmi config with RainbowKit connectors
export const config = createConfig({
  chains: supportedChains,
  connectors: connectors,
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [arbitrum.id]: http(),
    [sepolia.id]: http(),
    [abstractMainnet.id]: http(),
    [abstractTestnet.id]: http(),
    [monadTestnet.id]: http(),
    [core.id]: http(),
  },
  // Adding ether.js-compatible options
  syncConnectedChain: true, // Keep chain in sync with wallet
  batch: {
    multicall: true,      // Use multicall for batch requests
  },
});

