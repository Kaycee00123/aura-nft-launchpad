
import { createConfig, http } from 'wagmi'
import { mainnet, base, arbitrum, sepolia } from 'wagmi/chains'
import { createWeb3Modal } from '@web3modal/wagmi/react'

// Define custom chains matching our previous structure
const abstractMainnet = {
  id: 11124,
  name: 'Abstract Mainnet',
  network: 'abstract',
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

const abstractTestnet = {
  id: 2741,
  name: 'Abstract Testnet',
  network: 'abstract-testnet',
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

const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  network: 'monad-testnet',
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

const core = {
  id: 1116,
  name: 'Core',
  network: 'core',
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
];

// This is a placeholder - replace with your actual project ID from WalletConnect Cloud
// Get one at https://cloud.walletconnect.com/
const projectId = '6f7da8ecb5707a7c8340093786426533';

// Create wagmi config
export const config = createConfig({
  chains: [mainnet, sepolia, base, arbitrum, abstractMainnet, abstractTestnet, monadTestnet, core],
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
});

// Create Web3Modal
export const web3Modal = createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to true
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#7C3AED', // Make theme match our purple color
  },
})
