
import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader, Upload, ImageIcon, Info } from "lucide-react";

// Define form schema with validation
const dropFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  symbol: z.string().min(1, "Symbol is required").max(8, "Symbol must be 8 characters or less"),
  dropType: z.enum(["single", "collection"]),
  baseUri: z.string().optional(),
  maxSupply: z.number().min(1, "Max supply must be at least 1"),
  price: z.number().min(0, "Price must be a positive number"),
  mintStart: z.string().min(1, "Mint start time is required"),
  mintEnd: z.string().min(1, "Mint end time is required"),
  enableWhitelist: z.boolean().default(false),
  enableSoulbound: z.boolean().default(false),
  enableBurn: z.boolean().default(false),
  singleDropImage: z.instanceof(File).optional(),
})
.refine((data) => {
  // If dropType is "single", singleDropImage is required
  if (data.dropType === "single") {
    return !!data.singleDropImage;
  }
  return true;
}, {
  message: "Image is required for Single Drop type",
  path: ["singleDropImage"],
})
.refine((data) => {
  // If dropType is "collection", baseUri is required
  if (data.dropType === "collection") {
    return !!data.baseUri && data.baseUri.trim() !== "";
  }
  return true;
}, {
  message: "Base URI is required for Full Collection type",
  path: ["baseUri"],
});

type DropFormValues = z.infer<typeof dropFormSchema>;

const CreateDrop = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const singleDropImageRef = useRef<HTMLInputElement>(null);
  const [singleImagePreview, setSingleImagePreview] = useState<string | null>(null);

  // Initialize form
  const form = useForm<DropFormValues>({
    resolver: zodResolver(dropFormSchema),
    defaultValues: {
      name: "",
      symbol: "",
      dropType: "single",
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

  // Watch the dropType to conditionally render form fields
  const dropType = form.watch("dropType");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create and set preview URL
    const previewUrl = URL.createObjectURL(file);
    setSingleImagePreview(previewUrl);
    form.setValue("singleDropImage", file);
  };

  const triggerFileInput = useCallback(() => {
    singleDropImageRef.current?.click();
  }, []);

  const uploadToIPFS = async (file: File): Promise<string> => {
    // Simulate IPFS upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock IPFS CID response
    const mockCid = "Qm" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return `ipfs://${mockCid}`;
  };

  const generateMetadataForSingleDrop = async (image: string): Promise<string> => {
    // Simulate metadata creation and upload
    const metadata = {
      name: form.getValues("name"),
      image,
      description: `${form.getValues("name")} NFT`,
    };
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock IPFS CID for metadata
    const mockMetadataCid = "Qm" + Math.random().toString(36).substring(2, 15);
    return `ipfs://${mockMetadataCid}`;
  };

  const onSubmit = async (values: DropFormValues) => {
    setIsSubmitting(true);
    let baseUriToUse = "";

    try {
      if (values.dropType === "single") {
        if (!values.singleDropImage) {
          toast({
            title: "Missing Image",
            description: "Please upload an image for your Single Drop",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }

        // Upload image to IPFS
        toast({
          title: "Uploading image to IPFS...",
          description: "Please wait while we upload your image.",
        });
        
        const imageCid = await uploadToIPFS(values.singleDropImage);
        
        // Generate and upload metadata
        toast({
          title: "Creating metadata...",
          description: "Generating metadata for your collection.",
        });
        
        baseUriToUse = await generateMetadataForSingleDrop(imageCid);
      } else {
        // Collection type - use provided baseUri
        if (!values.baseUri) {
          toast({
            title: "Missing Base URI",
            description: "Please enter a Base URI for your collection",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        
        baseUriToUse = values.baseUri;
      }
      
      // Simulate blockchain interaction
      toast({
        title: "Deploying smart contract...",
        description: "Your NFT drop is being deployed to the blockchain.",
      });
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
                    name="dropType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Drop Type *</FormLabel>
                        <FormDescription className="mb-2">
                          Select the type of NFT drop you want to create
                        </FormDescription>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 gap-4 pt-2"
                          >
                            <div className="flex items-center space-x-2 rounded-md border p-4">
                              <RadioGroupItem value="single" id="single" />
                              <label htmlFor="single" className="flex flex-col cursor-pointer">
                                <span className="font-medium">Single Drop</span>
                                <span className="text-sm text-gray-500">
                                  Use one image for all NFTs (like an Open Edition)
                                </span>
                              </label>
                            </div>
                            <div className="flex items-center space-x-2 rounded-md border p-4">
                              <RadioGroupItem value="collection" id="collection" />
                              <label htmlFor="collection" className="flex flex-col cursor-pointer">
                                <span className="font-medium">Full Collection</span>
                                <span className="text-sm text-gray-500">
                                  Use multiple images and metadata stored in IPFS folder
                                </span>
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {dropType === "collection" && (
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
                            IPFS folder URI containing your collection metadata
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
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
              {dropType === "single" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Single Drop Image</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <FormLabel htmlFor="singleDropImage" className="block text-sm font-medium mb-1">
                        NFT Image *
                      </FormLabel>
                      <FormDescription className="mb-2">
                        This image will be used for all NFTs in this drop
                      </FormDescription>
                      <input
                        ref={singleDropImageRef}
                        type="file"
                        id="singleDropImage"
                        accept="image/jpeg,image/png,image/gif"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {singleImagePreview ? (
                        <div className="relative rounded-lg overflow-hidden border border-gray-200">
                          <img 
                            src={singleImagePreview} 
                            alt="NFT preview"
                            className="w-full h-64 object-cover"
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="absolute bottom-2 right-2"
                            onClick={triggerFileInput}
                          >
                            Change Image
                          </Button>
                        </div>
                      ) : (
                        <div 
                          className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={triggerFileInput}
                        >
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <Upload className="w-10 h-10 text-gray-400" />
                            <p className="text-sm text-gray-500">Click to upload NFT image</p>
                            <p className="text-xs text-gray-400">Supported formats: JPG, PNG, GIF</p>
                          </div>
                        </div>
                      )}
                      {form.formState.errors.singleDropImage && (
                        <p className="text-sm text-red-500 mt-1">
                          {form.formState.errors.singleDropImage.message}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Drop Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <div className="flex gap-2">
                      <Info className="h-5 w-5 text-blue-500" />
                      <div>
                        <h4 className="font-medium text-blue-700">About {dropType === "single" ? "Single Drop" : "Full Collection"}</h4>
                        {dropType === "single" ? (
                          <p className="text-sm text-blue-600 mt-1">
                            Single Drop uses the same artwork for every NFT. Perfect for open editions
                            where each NFT is identical. We'll handle uploading your image to IPFS and
                            creating the metadata automatically.
                          </p>
                        ) : (
                          <p className="text-sm text-blue-600 mt-1">
                            Full Collection requires pre-uploading your assets to IPFS. You'll need to
                            create metadata files for each NFT and provide the base URI to the folder.
                            This allows for unique artwork for each token ID in your collection.
                          </p>
                        )}
                      </div>
                    </div>
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
