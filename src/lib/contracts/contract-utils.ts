
import { ethers } from "ethers";
import { NFTLaunchpadFactoryInterface, NFTDropInterface } from "./interfaces";
import factoryAbi from "./abis/NFTLaunchpadFactory.json";
import dropAbi from "./abis/NFTDrop.json";
import { keccak256 } from "ethers/lib/utils";
import { MerkleTree } from "merkletreejs";

// Contract addresses - replace these with your actual deployed contract addresses
const CONTRACT_ADDRESSES: Record<number, string> = {
  1: "0x000000000000000000000000000000000000dEaD", // Mainnet placeholder
  8453: "0x000000000000000000000000000000000000dEaD", // Base placeholder
  42161: "0x000000000000000000000000000000000000dEaD", // Arbitrum placeholder
  11124: "0x000000000000000000000000000000000000dEaD", // Abstract Mainnet placeholder
  2741: "0x73fc84462b939bB6F8E2D66E3cc06707D25dA1F2", // Abstract Testnet - actual "placeholder"
  10143: "0x000000000000000000000000000000000000dEaD", // Monad Testnet placeholder
};

/**
 * Get the factory contract for the current chain
 */
export function getFactoryContract(signer: ethers.Signer, chainId: number): NFTLaunchpadFactoryInterface {
  const address = CONTRACT_ADDRESSES[chainId];
  
  if (!address) {
    throw new Error(`Contract not deployed on chain ${chainId}`);
  }
  
  const contract = new ethers.Contract(address, factoryAbi, signer);
  
  return {
    async createDrop(
      name: string,
      symbol: string,
      maxSupply: number,
      mintPrice: string,
      isSoulbound: boolean,
      canBurn: boolean,
      baseTokenURI: string,
      logoURI: string,
      bannerURI: string
    ) {
      // Convert ETH price to wei
      const mintPriceWei = ethers.utils.parseEther(mintPrice);
      
      // Get platform fee
      const platformFee = await contract.getPlatformFee();
      
      // Create the drop with platform fee
      const tx = await contract.createDrop(
        name,
        symbol,
        maxSupply,
        mintPriceWei,
        isSoulbound,
        canBurn,
        baseTokenURI,
        logoURI,
        bannerURI,
        { value: platformFee }
      );
      
      // Wait for transaction and get drop address from events
      const receipt = await tx.wait();
      const event = receipt.events?.find(e => e.event === "DropCreated");
      const dropAddress = event?.args?.dropAddress;
      
      return { tx, address: dropAddress };
    },
    
    async getCreatorDrops(creatorAddress: string) {
      return contract.getCreatorDrops(creatorAddress);
    },
    
    async getPlatformFee() {
      const fee = await contract.getPlatformFee();
      return Number(ethers.utils.formatEther(fee));
    }
  };
}

/**
 * Get a drop contract by address
 */
export function getDropContract(address: string, signer: ethers.Signer): NFTDropInterface {
  const contract = new ethers.Contract(address, dropAbi, signer);
  
  return {
    name: async () => contract.name(),
    symbol: async () => contract.symbol(),
    creator: async () => contract.creator(),
    totalSupply: async () => {
      const supply = await contract.totalSupply();
      return Number(supply);
    },
    maxSupply: async () => {
      const supply = await contract.maxSupply();
      return Number(supply);
    },
    mintPrice: async () => contract.mintPrice(),
    isSoulbound: async () => contract.isSoulbound(),
    canBurn: async () => contract.canBurn(),
    logoURI: async () => contract.logoURI(),
    bannerURI: async () => contract.bannerURI(),
    
    mintStart: async () => {
      const timestamp = await contract.mintStart();
      return Number(timestamp) * 1000; // Convert to JS timestamp
    },
    mintEnd: async () => {
      const timestamp = await contract.mintEnd();
      return Number(timestamp) * 1000; // Convert to JS timestamp
    },
    setMintDates: async (startTimestamp, endTimestamp) => {
      // Convert JS timestamps to Unix timestamps
      const startUnix = Math.floor(startTimestamp / 1000);
      const endUnix = Math.floor(endTimestamp / 1000);
      return contract.setMintDates(startUnix, endUnix);
    },
    
    isWhitelistEnabled: async () => contract.isWhitelistEnabled(),
    setWhitelistEnabled: async (enabled) => contract.setWhitelistEnabled(enabled),
    setMerkleRoot: async (merkleRoot) => contract.setMerkleRoot(merkleRoot),
    
    mint: async (quantity, options) => {
      const mintPriceWei = await contract.mintPrice();
      const totalCost = mintPriceWei.mul(quantity);
      
      return contract.mint(quantity, {
        value: totalCost,
        ...options
      });
    },
    whitelistMint: async (quantity, merkleProof, options) => {
      const mintPriceWei = await contract.mintPrice();
      const totalCost = mintPriceWei.mul(quantity);
      
      return contract.whitelistMint(quantity, merkleProof, {
        value: totalCost,
        ...options
      });
    },
    
    withdraw: async () => contract.withdraw(),
    setSoulbound: async (isSoulbound) => contract.setSoulbound(isSoulbound),
    setBurn: async (canBurn) => contract.setBurn(canBurn),
  };
}

/**
 * Generate Merkle tree and proofs for whitelisted addresses
 */
export function generateMerkleData(addresses: string[]) {
  // Clean and format addresses
  const cleanedAddresses = addresses
    .map(addr => addr.trim().toLowerCase())
    .filter(addr => ethers.utils.isAddress(addr));
  
  // Deduplicate addresses
  const uniqueAddresses = [...new Set(cleanedAddresses)];
  
  // Create leaf nodes
  const leafNodes = uniqueAddresses.map(addr => 
    keccak256(ethers.utils.defaultAbiCoder.encode(['address'], [addr]))
  );
  
  // Create Merkle Tree
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  
  // Get merkle root
  const merkleRoot = merkleTree.getHexRoot();
  
  // Generate proofs for each address
  const proofs = uniqueAddresses.map((addr, i) => {
    const hash = leafNodes[i];
    const proof = merkleTree.getHexProof(hash);
    return { address: addr, proof };
  });
  
  return {
    root: merkleRoot,
    tree: merkleTree,
    proofs,
    addresses: uniqueAddresses
  };
}

/**
 * Format ETH value with specified decimals
 */
export function formatEth(value: ethers.BigNumber | string | number, decimals = 4): string {
  if (typeof value === 'string' || typeof value === 'number') {
    return Number(value).toFixed(decimals);
  }
  return Number(ethers.utils.formatEther(value)).toFixed(decimals);
}
