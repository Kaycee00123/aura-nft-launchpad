
import { useState } from "react";
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
import { Loader } from "lucide-react";

type DropFormData = {
  title: string;
  description: string;
  blockchain: string;
  supply: number;
  price: string;
  currency: string;
  mintStart: string;
  mintEnd: string;
  bannerImage: string;
  images: string[];
};

const CreateDrop = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<DropFormData>({
    title: "",
    description: "",
    blockchain: "Ethereum",
    supply: 1000,
    price: "0.05",
    currency: "ETH",
    mintStart: "",
    mintEnd: "",
    bannerImage: "",
    images: ["", "", ""],
  });

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

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    
    setFormData(prev => ({
      ...prev,
      images: newImages,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.description || !formData.bannerImage) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
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
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your NFT collection..."
                    rows={5}
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
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="bannerImage" className="block text-sm font-medium text-gray-700 mb-1">
                    Banner Image URL *
                  </label>
                  <Input
                    id="bannerImage"
                    name="bannerImage"
                    placeholder="https://example.com/image.jpg"
                    value={formData.bannerImage}
                    onChange={handleInputChange}
                    required
                  />
                  {formData.bannerImage && (
                    <div className="mt-2 rounded-md overflow-hidden h-40">
                      <img
                        src={formData.bannerImage}
                        alt="Banner preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x150?text=Invalid+Image+URL";
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gallery Images (Up to 3)
                  </label>
                  <div className="space-y-3">
                    {formData.images.map((image, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder={`Image URL ${index + 1}`}
                          value={image}
                          onChange={(e) => handleImageChange(index, e.target.value)}
                        />
                        {image && (
                          <div className="w-12 h-12 flex-shrink-0 rounded-md overflow-hidden">
                            <img
                              src={image}
                              alt={`Gallery preview ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/100?text=Error";
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Traits</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Traits will be available in the full version. This is currently a simplified form.
                </p>
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
