
import { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { getFactoryContract, getDropContract, formatEth } from '@/lib/contracts/contract-utils';
import { useToast } from '@/hooks/use-toast';
import { ethers } from 'ethers';
import { uploadFileToIPFS, uploadJSONToIPFS } from '@/lib/ipfs/ipfs-service';

interface CreateDropParams {
  name: string;
  symbol: string;
  description: string;
  maxSupply: number;
  mintPrice: string;
  logoFile: File;
  bannerFile: File;
  mintStart: Date | null;
  mintEnd: Date | null;
  isSoulbound: boolean;
  canBurn: boolean;
  isWhitelistEnabled: boolean;
  whitelistAddresses: string[];
  traitOptions?: { name: string; values: string[] }[];
}

export function useNFTContract() {
  const { wallet, isConnected } = useWallet();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);

  const createNFTDrop = async (params: CreateDropParams) => {
    if (!isConnected || !wallet.address || !wallet.chainId) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create a drop",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsLoading(true);
      
      // Step 1: Upload logo to IPFS
      setCurrentStep("Uploading logo to IPFS...");
      const logoResult = await uploadFileToIPFS(params.logoFile);
      
      // Step 2: Upload banner to IPFS
      setCurrentStep("Uploading banner to IPFS...");
      const bannerResult = await uploadFileToIPFS(params.bannerFile);
      
      // Step 3: Generate metadata for the collection
      setCurrentStep("Preparing collection metadata...");
      let metadataBaseUrl = "";
      
      if (params.traitOptions && params.traitOptions.length > 0) {
        // For collections with traits, create sample metadata
        const sampleMetadata = {
          name: `${params.name} #1`,
          description: params.description,
          image: logoResult.url,
          attributes: params.traitOptions.map(trait => ({
            trait_type: trait.name,
            value: trait.values[0] || "Sample"
          }))
        };
        
        const metadataResult = await uploadJSONToIPFS(sampleMetadata);
        metadataBaseUrl = metadataResult.url.replace('1', '{id}');
      } else {
        // For simple drops without traits
        metadataBaseUrl = logoResult.url;
      }

      // Step 4: Generate whitelist merkle root if needed
      let merkleRoot = ethers.constants.HashZero;
      if (params.isWhitelistEnabled && params.whitelistAddresses.length > 0) {
        setCurrentStep("Generating whitelist merkle tree...");
        
        // Import and use the merkle generator from contract utils
        const { generateMerkleData } = require('@/lib/contracts/contract-utils');
        const merkleData = generateMerkleData(params.whitelistAddresses);
        merkleRoot = merkleData.root;
      }
      
      // Step 5: Deploy contract
      setCurrentStep("Deploying NFT drop contract...");
      
      // Get a provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Get factory contract
      const factoryContract = getFactoryContract(signer, wallet.chainId);
      
      // Get platform fee before creating drop
      const platformFee = await factoryContract.getPlatformFee();
      console.log("Platform fee:", platformFee, "ETH");
      
      // Create drop
      const { tx, address } = await factoryContract.createDrop(
        params.name,
        params.symbol,
        params.maxSupply,
        params.mintPrice,
        params.isSoulbound,
        params.canBurn,
        metadataBaseUrl,
        logoResult.url,
        bannerResult.url
      );
      
      // Wait for transaction to confirm
      setCurrentStep("Confirming transaction...");
      await tx.wait();
      
      // Configure additional settings if needed
      if (params.isWhitelistEnabled && merkleRoot !== ethers.constants.HashZero) {
        setCurrentStep("Configuring whitelist...");
        
        // Get drop contract and set whitelist
        const dropContract = getDropContract(address, signer);
        const enableTx = await dropContract.setWhitelistEnabled(true);
        await enableTx.wait();
        
        const rootTx = await dropContract.setMerkleRoot(merkleRoot);
        await rootTx.wait();
      }
      
      // Set mint dates if provided
      if (params.mintStart || params.mintEnd) {
        setCurrentStep("Setting mint dates...");
        
        const mintStartTime = params.mintStart ? Math.floor(params.mintStart.getTime() / 1000) : Math.floor(Date.now() / 1000);
        const mintEndTime = params.mintEnd ? Math.floor(params.mintEnd.getTime() / 1000) : Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days
        
        const dropContract = getDropContract(address, signer);
        const datesTx = await dropContract.setMintDates(mintStartTime, mintEndTime);
        await datesTx.wait();
      }
      
      toast({
        title: "Drop Created Successfully!",
        description: `Your NFT drop has been created at address: ${address.slice(0, 6)}...${address.slice(-4)}`,
      });
      
      return address;
    } catch (error: any) {
      console.error("Error creating NFT drop:", error);
      toast({
        title: "Failed to Create Drop",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
      setCurrentStep(null);
    }
  };
  
  return {
    createNFTDrop,
    isLoading,
    currentStep,
  };
}
