
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader, Upload, ImageIcon } from "lucide-react";

// Define form schema with validation
const dropFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  symbol: z.string().min(1, "Symbol is required").max(8, "Symbol must be 8 characters or less"),
  baseUri: z.string().min(1, "Base URI is required"),
  maxSupply: z.number().min(1, "Max supply must be at least 1"),
  price: z.number().min(0, "Price must be a positive number"),
  mintStart: z.string().min(1, "Mint start time is required"),
  mintEnd: z.string().min(1, "Mint end time is required"),
  enableWhitelist: z.boolean().default(false),
  enableSoulbound: z.boolean().default(false),
  enableBurn: z.boolean().default(false),
  bannerImage: z.instanceof(File).optional(),
  dropLogo: z.instanceof(File).optional(),
  mintDisplayImage: z.instanceof(File).optional(),
});

type DropFormValues = z.infer<typeof dropFormSchema>;

const CreateDrop = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const dropLogoInputRef = useRef<HTMLInputElement>(null);
  const mintDisplayImageInputRef = useRef<HTMLInputElement>(null);

  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [dropLogoPreview, setDropLogoPreview] = useState<string | null>(null);
  const [mintDisplayImagePreview, setMintDisplayImagePreview] = useState<string | null>(null);

  // Initialize form
  const form = useForm<DropFormValues>({
    resolver: zodResolver(dropFormSchema),
    defaultValues: {
      name: "",
      symbol: "",
      baseUri: "",
      maxSupply: 1000,
      price: 0.05,
      mintStart: "",
      mintEnd: "",
      enableWhitelist: false,
      enableSoulbound: false,
      enableBurn: false,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'bannerImage' | 'dropLogo' | 'mintDisplayImage') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create and set preview URL
    const previewUrl = URL.createObjectURL(file);
    
    if (fileType === 'bannerImage') {
      setBannerPreview(previewUrl);
      form.setValue("bannerImage", file);
    } else if (fileType === 'dropLogo') {
      setDropLogoPreview(previewUrl);
      form.setValue("dropLogo", file);
    } else if (fileType === 'mintDisplayImage') {
      setMintDisplayImagePreview(previewUrl);
      form.setValue("mintDisplayImage", file);
    }
  };

  const triggerFileInput = (inputRef: React.RefObject<HTMLInputElement>) => {
    inputRef.current?.click();
  };

  const onSubmit = async (values: DropFormValues) => {
    // Validate required images
    if (!values.bannerImage || !values.dropLogo || !values.mintDisplayImage) {
      toast({
        title: "Missing Images",
        description: "Please upload all required images",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Form values:", values);
      
      // Simulate blockchain interaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful contract deployment
      const contractAddress = "0x" + Math.random().toString(16).slice(2, 42);
      
      toast({
        title: "Drop Created Successfully!",
        description: "Your NFT drop has been deployed to the blockchain.",
      });
      
      // Navigate to success page with contract address
      navigate(`/dashboard/drops/success?address=${contractAddress}`);
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
        <p className="text-gray-500">Configure and deploy your NFT drop</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          Symbol used for the token (e.g. BAYC, AZUKI)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="baseUri"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base URI *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="ipfs://" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          IPFS URI for your collection metadata
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sales Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="maxSupply"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Supply *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value) && value > 0) {
                                field.onChange(value);
                              }
                            }}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (ETH) *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.001"
                            min="0"
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              if (!isNaN(value) && value >= 0) {
                                field.onChange(value);
                              }
                            }}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="mintStart"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mint Start Date *</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="mintEnd"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mint End Date *</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Feature Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="enableWhitelist"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Enable Whitelist</FormLabel>
                          <FormDescription>
                            Restrict minting to whitelisted addresses
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="enableSoulbound"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Enable Soulbound</FormLabel>
                          <FormDescription>
                            NFTs cannot be transferred after minting
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="enableBurn"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Enable Burn</FormLabel>
                          <FormDescription>
                            Allow NFT owners to burn their tokens
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
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
                    <FormLabel htmlFor="bannerImage" className="block text-sm font-medium mb-1">
                      Banner Image *
                    </FormLabel>
                    <FormDescription className="mb-2">
                      This wide image will appear at the top of your drop page
                    </FormDescription>
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
                    {form.formState.errors.bannerImage && (
                      <p className="text-sm text-red-500 mt-1">Banner image is required</p>
                    )}
                  </div>
                  
                  {/* Drop Logo Upload */}
                  <div>
                    <FormLabel htmlFor="dropLogo" className="block text-sm font-medium mb-1">
                      Drop Logo *
                    </FormLabel>
                    <FormDescription className="mb-2">
                      This is the main logo/icon representing your drop collection
                    </FormDescription>
                    <input
                      ref={dropLogoInputRef}
                      type="file"
                      id="dropLogo"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'dropLogo')}
                      className="hidden"
                    />
                    {dropLogoPreview ? (
                      <div className="relative rounded-lg overflow-hidden border border-gray-200">
                        <img 
                          src={dropLogoPreview} 
                          alt="Drop logo preview"
                          className="w-full h-64 object-cover"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="absolute bottom-2 right-2"
                          onClick={() => triggerFileInput(dropLogoInputRef)}
                        >
                          Change Image
                        </Button>
                      </div>
                    ) : (
                      <div 
                        className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => triggerFileInput(dropLogoInputRef)}
                      >
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <ImageIcon className="w-10 h-10 text-gray-400" />
                          <p className="text-sm text-gray-500">Click to upload drop logo</p>
                          <p className="text-xs text-gray-400">This will be shown in listings and cards</p>
                        </div>
                      </div>
                    )}
                    {form.formState.errors.dropLogo && (
                      <p className="text-sm text-red-500 mt-1">Drop logo is required</p>
                    )}
                  </div>
                  
                  {/* Mint Display Image Upload */}
                  <div>
                    <FormLabel htmlFor="mintDisplayImage" className="block text-sm font-medium mb-1">
                      Mint Display Image *
                    </FormLabel>
                    <FormDescription className="mb-2">
                      This image will be displayed during the minting process
                    </FormDescription>
                    <input
                      ref={mintDisplayImageInputRef}
                      type="file"
                      id="mintDisplayImage"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'mintDisplayImage')}
                      className="hidden"
                    />
                    {mintDisplayImagePreview ? (
                      <div className="relative rounded-lg overflow-hidden border border-gray-200">
                        <img 
                          src={mintDisplayImagePreview} 
                          alt="Mint display image preview"
                          className="w-full h-64 object-cover"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="absolute bottom-2 right-2"
                          onClick={() => triggerFileInput(mintDisplayImageInputRef)}
                        >
                          Change Image
                        </Button>
                      </div>
                    ) : (
                      <div 
                        className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => triggerFileInput(mintDisplayImageInputRef)}
                      >
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <ImageIcon className="w-10 h-10 text-gray-400" />
                          <p className="text-sm text-gray-500">Click to upload mint display image</p>
                          <p className="text-xs text-gray-400">Users will see this image when minting</p>
                        </div>
                      </div>
                    )}
                    {form.formState.errors.mintDisplayImage && (
                      <p className="text-sm text-red-500 mt-1">Mint display image is required</p>
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
                      Deploying...
                    </>
                  ) : (
                    "Deploy Drop"
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

export default CreateDrop;
