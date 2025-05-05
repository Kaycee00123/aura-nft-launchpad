
import { ethers } from "ethers";

// Factory contract interface - this creates new NFT collections
export interface NFTLaunchpadFactoryInterface {
  createDrop(
    name: string, 
    symbol: string, 
    maxSupply: number, 
    mintPrice: string, 
    isSoulbound: boolean, 
    canBurn: boolean,
    baseTokenURI: string,
    logoURI: string,
    bannerURI: string
  ): Promise<{tx: ethers.ContractTransaction, address: string}>;
  
  getCreatorDrops(creatorAddress: string): Promise<string[]>;
  
  getPlatformFee(): Promise<number>;
}

// NFT Drop contract interface - this is for managing individual drops
export interface NFTDropInterface {
  // Basic info
  name(): Promise<string>;
  symbol(): Promise<string>;
  creator(): Promise<string>;
  totalSupply(): Promise<number>;
  maxSupply(): Promise<number>;
  mintPrice(): Promise<ethers.BigNumber>;
  isSoulbound(): Promise<boolean>;
  canBurn(): Promise<boolean>;
  logoURI(): Promise<string>;
  bannerURI(): Promise<string>;
  
  // Mint settings
  mintStart(): Promise<number>;
  mintEnd(): Promise<number>;
  setMintDates(startTimestamp: number, endTimestamp: number): Promise<ethers.ContractTransaction>;
  
  // Whitelist
  isWhitelistEnabled(): Promise<boolean>;
  setWhitelistEnabled(enabled: boolean): Promise<ethers.ContractTransaction>;
  setMerkleRoot(merkleRoot: string): Promise<ethers.ContractTransaction>;
  
  // Mint functions
  mint(quantity: number, options: {value: ethers.BigNumber}): Promise<ethers.ContractTransaction>;
  whitelistMint(quantity: number, merkleProof: string[], options: {value: ethers.BigNumber}): Promise<ethers.ContractTransaction>;
  
  // Admin functions
  withdraw(): Promise<ethers.ContractTransaction>;
  setSoulbound(isSoulbound: boolean): Promise<ethers.ContractTransaction>;
  setBurn(canBurn: boolean): Promise<ethers.ContractTransaction>;
}
