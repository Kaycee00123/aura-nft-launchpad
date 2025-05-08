
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { useNFTContract } from "@/hooks/useNFTContract";
import { useWallet } from "@/context/WalletContext";
import { Loader, Upload, Plus, Trash } from "lucide-react";

// Form validation schema
const dropFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  symbol: z.string().min(1, "Symbol is required"),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  maxSupply: z.number().min(1, "Maximum supply must be at least 1"),
  isSoulbound: z.boolean().default(false),
  allowBurning: z.boolean().default(false),
  isWhitelistEnabled: z.boolean().default(false),
});

type DropFormValues = z.infer<typeof dropFormSchema>;

export default function CreateDropForm() {
  const navigate = useNavigate();
  const { isConnected } = useWallet();
  const { createNFTDrop, isLoading, currentStep } = useNFTContract();
  
  // Files state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  
  // Dates state
  const [mintStart, setMintStart] = useState<Date | null>(null);
  const [mintEnd, setMintEnd] = useState<Date | null>(null);
  
  // Whitelist state
  const [whitelistAddresses, setWhitelistAddresses] = useState("");
  
  // Traits state
  const [traitOptions, setTraitOptions] = useState<{ name: string; values: string[] }[]>([]);
  
  // Form definition using react-hook-form
  const form = useForm<DropFormValues>({
    resolver: zodResolver(dropFormSchema),
    defaultValues: {
      name: "",
      symbol: "",
      description: "",
      price: "0.01",
      maxSupply: 1000,
      isSoulbound: false,
      allowBurning: false,
      isWhitelistEnabled: false,
    },
  });
  
  // Form submission handler
  const onSubmit = async (values: DropFormValues) => {
    if (!logoFile || !bannerFile) {
      return;
    }
    
    // Process whitelist addresses
    const whitelist = values.isWhitelistEnabled 
      ? whitelistAddresses.split('\n').map(addr => addr.trim()).filter(Boolean) 
      : [];
    
    // Create the drop
    const dropAddress = await createNFTDrop({
      name: values.name,
      symbol: values.symbol,
      description: values.description || "",
      maxSupply: values.maxSupply,
      mintPrice: values.price,
      logoFile,
      bannerFile,
      mintStart,
      mintEnd,
      isSoulbound: values.isSoulbound,
      canBurn: values.allowBurning,
      isWhitelistEnabled: values.isWhitelistEnabled,
      whitelistAddresses: whitelist,
      traitOptions,
    });
    
    // Redirect to success page if drop was created
    if (dropAddress) {
      navigate(`/dashboard/drops/success?address=${dropAddress}`);
    }
  };
  
  // Handle file changes
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
  
  // Traits management
  const addTrait = () => {
    setTraitOptions([...traitOptions, { name: "", values: [""] }]);
  };
  
  const updateTraitName = (index: number, name: string) => {
    const updated = [...traitOptions];
    updated[index].name = name;
    setTraitOptions(updated);
  };
  
  const addTraitValue = (traitIndex: number) => {
    const updated = [...traitOptions];
    updated[traitIndex].values.push("");
    setTraitOptions(updated);
  };
  
  const updateTraitValue = (traitIndex: number, valueIndex: number, value: string) => {
    const updated = [...traitOptions];
    updated[traitIndex].values[valueIndex] = value;
    setTraitOptions(updated);
  };
  
  const removeTrait = (index: number) => {
    setTraitOptions(traitOptions.filter((_, i) => i !== index));
  };
  
  const removeTraitValue = (traitIndex: number, valueIndex: number) => {
    const updated = [...traitOptions];
    updated[traitIndex].values = updated[traitIndex].values.filter((_, i) => i !== valueIndex);
    setTraitOptions(updated);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New NFT Drop</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collection Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Awesome NFTs" {...field} />
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
                    <FormLabel>Symbol</FormLabel>
                    <FormControl>
                      <Input placeholder="AWESOME" {...field} />
                    </FormControl>
                    <FormDescription>
                      A short token symbol for your collection (e.g. ETH, BTC)
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your NFT collection..." 
                        {...field} 
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Media Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Collection Media</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FormLabel>Logo Image</FormLabel>
                  <div className="flex items-center">
                    <label className="cursor-pointer">
                      <div className={`w-32 h-32 rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground ${logoFile ? 'border-primary' : 'border-gray-300'}`}>
                        {logoFile ? (
                          <div className="relative w-full h-full">
                            <img 
                              src={URL.createObjectURL(logoFile)} 
                              alt="Logo Preview" 
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <Button 
                              type="button" 
                              variant="destructive" 
                              size="icon" 
                              className="absolute top-1 right-1 h-6 w-6"
                              onClick={(e) => {
                                e.preventDefault();
                                setLogoFile(null);
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 mb-1" />
                            <span className="text-xs">Upload Logo</span>
                          </>
                        )}
                      </div>
                      <Input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleLogoChange}
                        required={!logoFile}
                      />
                    </label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <FormLabel>Banner Image</FormLabel>
                  <div className="flex items-center">
                    <label className="cursor-pointer">
                      <div className={`w-full h-32 rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground ${bannerFile ? 'border-primary' : 'border-gray-300'}`}>
                        {bannerFile ? (
                          <div className="relative w-full h-full">
                            <img 
                              src={URL.createObjectURL(bannerFile)} 
                              alt="Banner Preview" 
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <Button 
                              type="button" 
                              variant="destructive" 
                              size="icon" 
                              className="absolute top-1 right-1 h-6 w-6"
                              onClick={(e) => {
                                e.preventDefault();
                                setBannerFile(null);
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 mb-1" />
                            <span className="text-xs">Upload Banner</span>
                          </>
                        )}
                      </div>
                      <Input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleBannerChange}
                        required={!bannerFile}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mint Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Mint Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mint Price (ETH)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="maxSupply"
                  render={({ field: { onChange, ...rest } }) => (
                    <FormItem>
                      <FormLabel>Maximum Supply</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          onChange={(e) => onChange(parseInt(e.target.value) || 0)} 
                          {...rest}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormLabel>Mint Start Date</FormLabel>
                  <Input
                    type="datetime-local"
                    onChange={(e) => setMintStart(new Date(e.target.value))}
                  />
                </div>
                <div>
                  <FormLabel>Mint End Date</FormLabel>
                  <Input
                    type="datetime-local"
                    onChange={(e) => setMintEnd(new Date(e.target.value))}
                  />
                </div>
              </div>
            </div>
            
            {/* Advanced Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Advanced Settings</h3>
              
              <FormField
                control={form.control}
                name="isSoulbound"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Soulbound NFTs</FormLabel>
                      <FormDescription>
                        Make NFTs non-transferable after minting
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
                name="allowBurning"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Allow Burning</FormLabel>
                      <FormDescription>
                        Allow collectors to burn their NFTs
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
                name="isWhitelistEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-col rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Enable Whitelist</FormLabel>
                        <FormDescription>
                          Restrict minting to a specific list of addresses
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                    
                    {field.value && (
                      <div className="mt-4">
                        <FormLabel>Whitelist Addresses (one per line)</FormLabel>
                        <Textarea
                          value={whitelistAddresses}
                          onChange={(e) => setWhitelistAddresses(e.target.value)}
                          rows={5}
                          placeholder="0x...\n0x...\n..."
                          className="mt-1"
                        />
                      </div>
                    )}
                  </FormItem>
                )}
              />
            </div>
            
            {/* Traits (Optional) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Traits (Optional)</h3>
                <Button type="button" onClick={addTrait} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" /> Add Trait
                </Button>
              </div>
              
              {traitOptions.map((trait, index) => (
                <div key={index} className="border rounded-md p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <FormLabel>Trait Name</FormLabel>
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => removeTrait(index)}
                    >
                      Remove
                    </Button>
                  </div>
                  
                  <Input
                    value={trait.name}
                    onChange={(e) => updateTraitName(index, e.target.value)}
                    placeholder="e.g. Background, Eyes, etc."
                  />
                  
                  <div className="space-y-2">
                    <FormLabel>Values</FormLabel>
                    {trait.values.map((value, valueIndex) => (
                      <div key={valueIndex} className="flex items-center space-x-2">
                        <Input
                          value={value}
                          onChange={(e) => updateTraitValue(index, valueIndex, e.target.value)}
                          placeholder="e.g. Red, Blue, etc."
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon" 
                          onClick={() => removeTraitValue(index, valueIndex)}
                          disabled={trait.values.length <= 1}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addTraitValue(index)}
                    >
                      Add Value
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isLoading || !isConnected}
                className="bg-aura-purple hover:bg-aura-purple-dark"
              >
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    {currentStep || "Creating..."}
                  </>
                ) : (
                  "Create NFT Drop"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
