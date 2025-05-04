
import { createConfig, http } from 'wagmi'
import { mainnet, base, arbitrum, sepolia } from 'wagmi/chains'
import { createWeb3Modal } from '@web3modal/wagmi'
import { walletConnect } from '@web3modal/wagmi'

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
    public: { http: ['https://rpc.abstract.network'] },
    default: { http: ['https://rpc.abstract.network'] },
  },
  blockExplorers: {
    default: { name: 'Abstract Explorer', url: 'https://explorer.abstract.network' },
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
    public: { http: ['https://testnet-rpc.abstract.network'] },
    default: { http: ['https://testnet-rpc.abstract.network'] },
  },
  blockExplorers: {
    default: { name: 'Abstract Testnet Explorer', url: 'https://testnet.explorer.abstract.network' },
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
    default: { name: 'Monad Explorer', url: 'https://explorer.testnet.monad.xyz' },
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
  abstractMainnet,
  abstractTestnet,
  monadTestnet,
  base,
  arbitrum,
  core,
  mainnet, // Add mainnet for testing purposes
  sepolia, // Add testnet for testing purposes
];

// This is a placeholder - replace with your actual project ID from WalletConnect Cloud
// Get one at https://cloud.walletconnect.com/
const projectId = 'YOUR_WALLET_CONNECT_PROJECT_ID';

// Create wagmi config
export const config = createConfig({
  chains: supportedChains,
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
