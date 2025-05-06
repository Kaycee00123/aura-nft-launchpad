
import { createConfig, http } from 'wagmi'
import { mainnet, base, arbitrum, sepolia } from 'wagmi/chains'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { injected, walletConnect } from 'wagmi/connectors'
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

// All supported chains - explicitly cast as const array of Chain type
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

// Project ID from WalletConnect Cloud - making sure it's valid
const projectId = '6f7da8ecb5707a7c8340093786426533';

// Create explicit connectors with proper configuration
const connectors = [
  // Injected connector (MetaMask, etc) with configuration to improve detection
  injected({
    shimDisconnect: true,  // Improves disconnection handling
    target: 'both',        // Targets both MetaMask and other injected wallets
  }),
  walletConnect({
    projectId,
    showQrModal: true,     // Ensure QR modal displays properly
    qrModalOptions: {
      themeMode: 'light',
    }
  })
];

// Create wagmi config with proper timeouts
export const config = createConfig({
  chains: supportedChains,
  connectors,
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

// Create Web3Modal with improved configuration
export const web3Modal = createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#7C3AED', // Make theme match our purple color
    '--w3m-border-radius-master': '4px', // Match our UI style
  },
  includeWalletIds: [], // Include all available wallets
  featuredWalletIds: [], // Feature none specifically
  defaultChain: mainnet, // Set a default chain
});

