
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";
import { Loader, Upload, ImageIcon } from "lucide-react";

type DropFormData = {
  title: string;
  description: string;
  symbol: string;
  blockchain: string;
  supply: number;
  price: string;
  currency: string;
  mintStart: string;
  mintEnd: string;
  bannerImage: File | null;
  displayImage: File | null;
};

const CreateDrop = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const displayImageInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<DropFormData>({
    title: "",
    description: "",
    symbol: "",
    blockchain: "Ethereum",
    supply: 1000,
    price: "0.05",
    currency: "ETH",
    mintStart: "",
    mintEnd: "",
    bannerImage: null,
    displayImage: null,
  });

  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [displayImagePreview, setDisplayImagePreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value);
    
    if (!isNaN(numValue) && numValue > 0) {
      setFormData(prev => ({
        ...prev,
        [name]: numValue,
      }));
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Allow decimal numbers
    if (!isNaN(parseFloat(value)) || value === "" || value.endsWith(".")) {
      setFormData(prev => ({
        ...prev,
        price: value,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'bannerImage' | 'displayImage') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Update form data with the file
    setFormData(prev => ({
      ...prev,
      [fileType]: file,
    }));
    
    // Create and set preview URL
    const previewUrl = URL.createObjectURL(file);
    if (fileType === 'bannerImage') {
      setBannerPreview(previewUrl);
    } else {
      setDisplayImagePreview(previewUrl);
    }
  };

  const triggerFileInput = (inputRef: React.RefObject<HTMLInputElement>) => {
    inputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.description || !formData.displayImage || !formData.bannerImage || !formData.symbol) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields and upload required images",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would send data to Supabase
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Drop Created!",
        description: "Your NFT drop has been successfully created.",
      });
      
      navigate("/dashboard/drops");
    } catch (error) {
      console.error("Error creating drop:", error);
      toast({
        title: "Error",
        description: "Failed to create drop. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Drop</h1>
        <p className="text-gray-500">Set up your next NFT collection</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="My Amazing NFT Collection"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-1">
                    Symbol *
                  </label>
                  <Input
                    id="symbol"
                    name="symbol"
                    placeholder="NFTC"
                    value={formData.symbol}
                    onChange={handleInputChange}
                    maxLength={8}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Symbol used for the token (e.g. BAYC, AZUKI)</p>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your NFT collection..."
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="resize-none"
                  />
                </div>
                
                <div>
                  <label htmlFor="blockchain" className="block text-sm font-medium text-gray-700 mb-1">
                    Blockchain
                  </label>
                  <Select
                    value={formData.blockchain}
                    onValueChange={(value) => handleSelectChange("blockchain", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blockchain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ethereum">Ethereum</SelectItem>
                      <SelectItem value="Polygon">Polygon</SelectItem>
                      <SelectItem value="Solana">Solana</SelectItem>
                      <SelectItem value="Binance">Binance Smart Chain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sales Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="supply" className="block text-sm font-medium text-gray-700 mb-1">
                    Total Supply
                  </label>
                  <Input
                    id="supply"
                    name="supply"
                    type="number"
                    min="1"
                    value={formData.supply}
                    onChange={handleNumberChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <Input
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handlePriceChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => handleSelectChange("currency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ETH">ETH</SelectItem>
                        <SelectItem value="MATIC">MATIC</SelectItem>
                        <SelectItem value="SOL">SOL</SelectItem>
                        <SelectItem value="BNB">BNB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="mintStart" className="block text-sm font-medium text-gray-700 mb-1">
                      Mint Start Date
                    </label>
                    <Input
                      id="mintStart"
                      name="mintStart"
                      type="datetime-local"
                      value={formData.mintStart}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="mintEnd" className="block text-sm font-medium text-gray-700 mb-1">
                      Mint End Date
                    </label>
                    <Input
                      id="mintEnd"
                      name="mintEnd"
                      type="datetime-local"
                      value={formData.mintEnd}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Banner Image Upload */}
                <div>
                  <label htmlFor="bannerImage" className="block text-sm font-medium text-gray-700 mb-1">
                    Banner Image *
                  </label>
                  <input
                    ref={bannerInputRef}
                    type="file"
                    id="bannerImage"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'bannerImage')}
                    className="hidden"
                  />
                  {bannerPreview ? (
                    <div className="relative rounded-lg overflow-hidden border border-gray-200">
                      <img 
                        src={bannerPreview} 
                        alt="Banner preview"
                        className="w-full h-40 object-cover"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="absolute bottom-2 right-2"
                        onClick={() => triggerFileInput(bannerInputRef)}
                      >
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => triggerFileInput(bannerInputRef)}
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Upload className="w-10 h-10 text-gray-400" />
                        <p className="text-sm text-gray-500">Click to upload banner image</p>
                        <p className="text-xs text-gray-400">Recommended size: 1400 x 400px</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Display Image Upload */}
                <div>
                  <label htmlFor="displayImage" className="block text-sm font-medium text-gray-700 mb-1">
                    Display Image *
                  </label>
                  <input
                    ref={displayImageInputRef}
                    type="file"
                    id="displayImage"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'displayImage')}
                    className="hidden"
                  />
                  {displayImagePreview ? (
                    <div className="relative rounded-lg overflow-hidden border border-gray-200">
                      <img 
                        src={displayImagePreview} 
                        alt="Display image preview"
                        className="w-full h-64 object-cover"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="absolute bottom-2 right-2"
                        onClick={() => triggerFileInput(displayImageInputRef)}
                      >
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => triggerFileInput(displayImageInputRef)}
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <ImageIcon className="w-10 h-10 text-gray-400" />
                        <p className="text-sm text-gray-500">Click to upload display image</p>
                        <p className="text-xs text-gray-400">This is the main image shown during minting</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 flex gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/dashboard/drops")}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="bg-aura-purple hover:bg-aura-purple-dark text-white font-medium flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Drop"
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateDrop;
