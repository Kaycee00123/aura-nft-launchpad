
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/context/WalletContext';
import { Loader, Plus, Minus } from 'lucide-react';
import { ethers } from 'ethers';

interface MintFormProps {
  dropName: string;
  price: string;
  maxPerTx?: number;
  maxPerWallet?: number;
  availableSupply: number;
  contractAddress?: string;
  image?: string;
}

const MintForm: React.FC<MintFormProps> = ({
  dropName,
  price,
  maxPerTx = 10,
  maxPerWallet = 0, // 0 means no limit
  availableSupply,
  contractAddress,
  image
}) => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const { isConnected, wallet, connectWallet } = useWallet();
  
  const [quantity, setQuantity] = useState(1);
  const [isMinting, setIsMinting] = useState(false);
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const incrementQuantity = () => {
    if (quantity < maxPerTx && quantity < availableSupply) {
      setQuantity(quantity + 1);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    if (isNaN(newValue) || newValue < 1) {
      setQuantity(1);
    } else if (newValue > maxPerTx) {
      setQuantity(maxPerTx);
    } else if (newValue > availableSupply) {
      setQuantity(availableSupply);
    } else {
      setQuantity(newValue);
    }
  };

  const handleMint = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to mint",
        variant: "destructive",
      });
      return;
    }
    
    if (!contractAddress) {
      toast({
        title: "Contract not found",
        description: "The NFT contract address is not available",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsMinting(true);
      
      // In a real implementation, this would use the NFT contract to mint
      // Using ethers.js to interact with the smart contract
      const totalPrice = (parseFloat(price) * quantity).toString();
      
      // Simulate minting transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      toast({
        title: "Success!",
        description: `Successfully minted ${quantity} NFT${quantity > 1 ? 's' : ''}!`,
        variant: "default",
      });
      
      // Reset quantity after successful mint
      setQuantity(1);
    } catch (error: any) {
      console.error("Minting error:", error);
      toast({
        title: "Minting failed",
        description: error.message || "There was an error while minting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <Card className="w-full shadow-md border border-gray-200">
      <CardHeader>
        <CardTitle>{dropName}</CardTitle>
        <CardDescription>
          Mint your NFT from this amazing collection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Price per NFT:</span>
          <span className="text-lg">{price} ETH</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-semibold">Available:</span>
          <span>{availableSupply} / 1000</span>
        </div>
        
        {image && (
          <div className="my-4">
            <img 
              src={image} 
              alt={dropName} 
              className="w-full h-48 object-cover rounded-md"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <div className="flex items-center">
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <Input
              id="quantity"
              type="number"
              min={1}
              max={Math.min(maxPerTx, availableSupply)}
              className="mx-2 text-center"
              value={quantity}
              onChange={handleQuantityChange}
            />
            
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
              onClick={incrementQuantity}
              disabled={quantity >= Math.min(maxPerTx, availableSupply)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Max {maxPerTx} per transaction
            {maxPerWallet > 0 && ` / ${maxPerWallet} per wallet`}
          </p>
        </div>
        
        <div className="pt-2">
          <div className="flex justify-between items-center font-medium">
            <span>Total:</span>
            <span className="text-xl">{(parseFloat(price) * quantity).toFixed(4)} ETH</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        {!isConnected ? (
          <Button 
            onClick={connectWallet}
            className="w-full bg-aura-purple hover:bg-aura-purple-dark"
          >
            Connect Wallet to Mint
          </Button>
        ) : (
          <Button 
            onClick={handleMint} 
            disabled={isMinting || availableSupply === 0}
            className="w-full bg-aura-purple hover:bg-aura-purple-dark"
          >
            {isMinting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Minting...
              </>
            ) : availableSupply === 0 ? (
              "Sold Out"
            ) : (
              `Mint ${quantity > 1 ? quantity : ''} NFT${quantity > 1 ? 's' : ''}`
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MintForm;
