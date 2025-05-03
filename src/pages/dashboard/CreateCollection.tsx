
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
import { Loader, Upload, ImageIcon, FolderIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(3, { message: "Collection name must be at least 3 characters" }),
  symbol: z.string().min(1, { message: "Symbol is required" }).max(8, { message: "Symbol must be 8 characters or less" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  ipfsAddress: z.string().min(1, { message: "IPFS address is required" }),
  royaltyPercentage: z.number().min(0).max(15),
  blockchain: z.string(),
  displayImage: z.any().optional(),
  bannerImage: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateCollection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const displayImageInputRef = useRef<HTMLInputElement>(null);
  
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [displayImagePreview, setDisplayImagePreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      symbol: "",
      description: "",
      ipfsAddress: "",
      royaltyPercentage: 5,
      blockchain: "Ethereum",
      displayImage: undefined,
      bannerImage: undefined,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'bannerImage' | 'displayImage') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Update form data with the file
    form.setValue(fileType, file);
    
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

  const onSubmit = async (values: FormValues) => {
    if (!values.displayImage || !values.bannerImage) {
      toast({
        title: "Missing Images",
        description: "Please upload both a banner and display image",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would create a smart contract with the collection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Collection Created!",
        description: "Your NFT collection has been successfully created on the blockchain.",
      });
      
      navigate("/dashboard/drops");
    } catch (error) {
      console.error("Error creating collection:", error);
      toast({
        title: "Error",
        description: "Failed to create collection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Collection</h1>
        <p className="text-gray-500">Deploy a new NFT collection to the blockchain</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Collection Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="My Amazing NFT Collection" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="symbol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Symbol *</FormLabel>
                        <FormControl>
                          <Input placeholder="NFTC" maxLength={8} {...field} />
                        </FormControl>
                        <FormDescription>
                          Symbol used for your token (e.g. BAYC, AZUKI)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your NFT collection..." 
                            className="resize-none" 
                            rows={4} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="blockchain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blockchain</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select blockchain" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Ethereum">Ethereum</SelectItem>
                            <SelectItem value="Polygon">Polygon</SelectItem>
                            <SelectItem value="Solana">Solana</SelectItem>
                            <SelectItem value="Binance">Binance Smart Chain</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>IPFS Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="ipfsAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IPFS Metadata URI *</FormLabel>
                        <FormControl>
                          <Input placeholder="ipfs://Qm..." {...field} />
                        </FormControl>
                        <FormDescription>
                          The IPFS URI where your collection metadata is stored
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="royaltyPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Royalty Percentage</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            max="15"
                            step="0.5"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Percentage of secondary sales you'll receive (0-15%)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                    <Label htmlFor="bannerImage" className="block text-sm font-medium text-gray-700 mb-1">
                      Banner Image *
                    </Label>
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
                    <Label htmlFor="displayImage" className="block text-sm font-medium text-gray-700 mb-1">
                      Display Image *
                    </Label>
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
                          <p className="text-xs text-gray-400">This is the main image shown for your collection</p>
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
                      Creating Collection...
                    </>
                  ) : (
                    "Deploy Collection"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateCollection;
