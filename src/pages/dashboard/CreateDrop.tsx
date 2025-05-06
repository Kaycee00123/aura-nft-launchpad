import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/context/WalletContext";
import { uploadFileToIPFS, uploadJSONToIPFS, ipfsToHttpURL } from "@/lib/ipfs/ipfs-service";
import { getFactoryContract, generateMerkleData, getDropContract } from "@/lib/contracts/contract-utils";
import { ethers } from "ethers";
import { Loader } from "lucide-react";
import { useWalletRequired } from "@/hooks/useWalletRequired";
import ConnectWalletPrompt from "@/components/wallet/ConnectWalletPrompt";

const CreateDrop = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { wallet, isConnected } = useWallet();
  
  // Check if wallet is connected using our new hook
  const { isCheckingWallet } = useWalletRequired();

  // Form fields state
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0.01");
  const [maxSupply, setMaxSupply] = useState(1000);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [mintStart, setMintStart] = useState<Date | null>(null);
  const [mintEnd, setMintEnd] = useState<Date | null>(null);
  const [isSoulbound, setIsSoulbound] = useState(false);
  const [allowBurning, setAllowBurning] = useState(false);
  const [isWhitelistEnabled, setIsWhitelistEnabled] = useState(false);
  const [whitelistAddresses, setWhitelistAddresses] = useState("");
  const [traitOptions, setTraitOptions] = useState<{ name: string; values: string[] }[]>([]);

  // Add new state for contract creation
  const [creatingContract, setCreatingContract] = useState(false);
  const [uploadingToIPFS, setUploadingToIPFS] = useState(false);
  const [contractCreationStep, setContractCreationStep] = useState<string | null>(null);
  const [createdDropAddress, setCreatedDropAddress] = useState<string | null>(null);

  // Handle file selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setBannerFile(e.target.files[0]);
    }
  };

  // Handle trait options
  const handleAddTrait = () => {
    setTraitOptions([...traitOptions, { name: "", values: [""] }]);
  };

  const handleTraitNameChange = (index: number, value: string) => {
    const newTraits = [...traitOptions];
    newTraits[index].name = value;
    setTraitOptions(newTraits);
  };

  const handleTraitValueChange = (traitIndex: number, valueIndex: number, value: string) => {
    const newTraits = [...traitOptions];
    newTraits[traitIndex].values[valueIndex] = value;
    setTraitOptions(newTraits);
  };

  const handleAddTraitValue = (index: number) => {
    const newTraits = [...traitOptions];
    newTraits[index].values.push("");
    setTraitOptions(newTraits);
  };

  const handleRemoveTrait = (index: number) => {
    const newTraits = [...traitOptions];
    newTraits.splice(index, 1);
    setTraitOptions(newTraits);
  };

  const handleRemoveTraitValue = (traitIndex: number, valueIndex: number) => {
    const newTraits = [...traitOptions];
    newTraits[traitIndex].values.splice(valueIndex, 1);
    setTraitOptions(newTraits);
  };

  // Update the handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !wallet.address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create a drop",
        variant: "destructive",
      });
      return;
    }

    // Basic validation
    if (!name || !symbol || !price || !maxSupply || !logoFile || !bannerFile) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Check if on a supported network
    if (!wallet.chain) {
      toast({
        title: "Network Error",
        description: "Please connect to a supported network",
        variant: "destructive",
      });
      return;
    }

    try {
      setCreatingContract(true);
      
      // Step 1: Upload logo to IPFS
      setContractCreationStep("Uploading logo to IPFS...");
      setUploadingToIPFS(true);
      const logoResult = await uploadFileToIPFS(logoFile);
      
      // Step 2: Upload banner to IPFS
      setContractCreationStep("Uploading banner to IPFS...");
      const bannerResult = await uploadFileToIPFS(bannerFile);
      setUploadingToIPFS(false);
      
      // Step 3: Generate metadata for the collection
      setContractCreationStep("Preparing collection metadata...");
      let metadataBaseUrl = "";
      
      if (traitOptions.length > 0) {
        // For a full collection, create metadata for each NFT
        // This would be a more complex process in a real app,
        // generating JSON for each token and uploading to IPFS
        
        // For demo purposes, we'll create a placeholder metadata
        const sampleMetadata = {
          name: `${name} #1`,
          description: description,
          image: logoResult.url,
          attributes: traitOptions.map(trait => ({
            trait_type: trait.name,
            value: trait.values[0] || "Sample"
          }))
        };
        
        const metadataResult = await uploadJSONToIPFS(sampleMetadata);
        metadataBaseUrl = metadataResult.url.replace('1', '{id}');
      } else {
        // For a simple drop, just use the logo as the image
        metadataBaseUrl = logoResult.url;
      }
      
      // Step 4: Process whitelist if enabled
      let merkleRoot = ethers.constants.HashZero;
      if (isWhitelistEnabled && whitelistAddresses.trim() !== '') {
        setContractCreationStep("Generating whitelist merkle tree...");
        const addresses = whitelistAddresses
          .split('\n')
          .map(addr => addr.trim())
          .filter(addr => addr !== '');
          
        if (addresses.length > 0) {
          const merkleData = generateMerkleData(addresses);
          merkleRoot = merkleData.root;
        }
      }
      
      // Step 5: Deploy contract
      setContractCreationStep("Deploying contract...");
      
      // Get provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Get factory contract
      const factoryContract = getFactoryContract(signer, wallet.chainId || 1);
      
      // Calculate mint dates in Unix timestamp (seconds)
      const mintStartTime = mintStart ? new Date(mintStart).getTime() / 1000 : Math.floor(Date.now() / 1000);
      const mintEndTime = mintEnd ? new Date(mintEnd).getTime() / 1000 : Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days
      
      // Create drop
      const { tx, address } = await factoryContract.createDrop(
        name,
        symbol,
        maxSupply,
        price,
        isSoulbound,
        allowBurning,
        metadataBaseUrl,
        logoResult.url,
        bannerResult.url
      );
      
      // Wait for transaction to confirm
      await tx.wait();
      
      // Store created drop address
      setCreatedDropAddress(address);
      
      // If whitelist is enabled, set the merkle root and enable whitelist
      if (isWhitelistEnabled && merkleRoot !== ethers.constants.HashZero) {
        setContractCreationStep("Configuring whitelist...");
        
        // Get drop contract and set merkle root
        const dropContract = getDropContract(address, signer);
        const enableTx = await dropContract.setWhitelistEnabled(true);
        await enableTx.wait();
        
        const rootTx = await dropContract.setMerkleRoot(merkleRoot);
        await rootTx.wait();
      }
      
      // Set mint dates
      if (mintStart || mintEnd) {
        setContractCreationStep("Setting mint dates...");
        
        const dropContract = getDropContract(address, signer);
        const datesTx = await dropContract.setMintDates(
          mintStartTime * 1000, // Convert to JS timestamp
          mintEndTime * 1000 // Convert to JS timestamp
        );
        await datesTx.wait();
      }
      
      // Success!
      toast({
        title: "Drop Created Successfully!",
        description: "Your NFT drop has been created and is ready for minting.",
        variant: "default",
      });
      
      // Redirect to the success page or drop details
      navigate(`/dashboard/drops/success?address=${address}`);
      
    } catch (error: any) {
      console.error("Error creating drop:", error);
      toast({
        title: "Failed to Create Drop",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setCreatingContract(false);
      setContractCreationStep(null);
    }
  };

  // If wallet is not connected, show the connect wallet prompt
  if (!isConnected && !isCheckingWallet) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Create New NFT Drop</h1>
        <div className="max-w-md mx-auto">
          <ConnectWalletPrompt 
            title="Connect Wallet to Create Drop" 
            description="You need to connect your wallet to create an NFT drop"
            requiredAction="create a drop"
          />
        </div>
      </div>
    );
  }
  
  // Main form render when wallet is connected
  return (
    <div className="container max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create New NFT Drop</h1>
      <Card>
        <CardHeader>
          <CardTitle>Drop Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                type="text"
                id="symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (ETH)</Label>
                <Input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  step="0.001"
                  required
                />
              </div>
              <div>
                <Label htmlFor="maxSupply">Max Supply</Label>
                <Input
                  type="number"
                  id="maxSupply"
                  value={maxSupply}
                  onChange={(e) => setMaxSupply(Number(e.target.value))}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="logo">Logo Image</Label>
                <Input type="file" id="logo" onChange={handleLogoChange} required />
                {logoFile && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Selected File: {logoFile.name}</p>
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="banner">Banner Image</Label>
                <Input type="file" id="banner" onChange={handleBannerChange} required />
                {bannerFile && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Selected File: {bannerFile.name}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mintStart">Mint Start Date</Label>
                <Input
                  type="datetime-local"
                  id="mintStart"
                  onChange={(e) => setMintStart(new Date(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="mintEnd">Mint End Date</Label>
                <Input
                  type="datetime-local"
                  id="mintEnd"
                  onChange={(e) => setMintEnd(new Date(e.target.value))}
                />
              </div>
            </div>
            <div>
              <Label>Traits (Optional)</Label>
              {traitOptions.map((trait, index) => (
                <div key={index} className="mb-4 p-4 border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor={`traitName-${index}`}>Trait {index + 1}</Label>
                    <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveTrait(index)}>
                      Remove
                    </Button>
                  </div>
                  <Input
                    type="text"
                    id={`traitName-${index}`}
                    placeholder="Trait Name"
                    value={trait.name}
                    onChange={(e) => handleTraitNameChange(index, e.target.value)}
                    className="mb-2"
                  />
                  {trait.values.map((value, valueIndex) => (
                    <div key={valueIndex} className="flex items-center mb-2">
                      <Input
                        type="text"
                        placeholder="Trait Value"
                        value={value}
                        onChange={(e) => handleTraitValueChange(index, valueIndex, e.target.value)}
                        className="mr-2"
                      />
                      <Button type="button" variant="outline" size="icon" onClick={() => handleRemoveTraitValue(index, valueIndex)}>
                        -
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="secondary" size="sm" onClick={() => handleAddTraitValue(index)}>
                    Add Value
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={handleAddTrait}>
                Add Trait
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="isSoulbound">Soulbound (Non-Transferable)</Label>
              <Switch
                id="isSoulbound"
                checked={isSoulbound}
                onCheckedChange={(checked) => setIsSoulbound(checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="allowBurning">Allow Burning</Label>
              <Switch
                id="allowBurning"
                checked={allowBurning}
                onCheckedChange={(checked) => setAllowBurning(checked)}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="isWhitelistEnabled">Enable Whitelist</Label>
                <Switch
                  id="isWhitelistEnabled"
                  checked={isWhitelistEnabled}
                  onCheckedChange={(checked) => setIsWhitelistEnabled(checked)}
                />
              </div>
              {isWhitelistEnabled && (
                <div>
                  <Label htmlFor="whitelistAddresses">Whitelist Addresses (one per line)</Label>
                  <Textarea
                    id="whitelistAddresses"
                    value={whitelistAddresses}
                    onChange={(e) => setWhitelistAddresses(e.target.value)}
                    rows={5}
                    placeholder="0x...\n0x...\n..."
                  />
                </div>
              )}
            </div>

            {/* Create drop button */}
            <div className="flex justify-end mt-6">
              <Button 
                type="submit" 
                disabled={creatingContract}
                className="bg-aura-purple hover:bg-aura-purple-dark"
              >
                {creatingContract ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" /> 
                    {contractCreationStep || "Creating..."}
                  </>
                ) : (
                  "Create NFT Drop"
                )}
              </Button>
            </div>

            {/* Uploading indicator */}
            {uploadingToIPFS && (
              <div className="mt-4 p-4 rounded-md bg-blue-50 border border-blue-200">
                <div className="flex items-center text-blue-700">
                  <Loader className="mr-2 h-4 w-4 animate-spin" /> 
                  <span>Uploading files to IPFS... This may take a few moments.</span>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateDrop;
