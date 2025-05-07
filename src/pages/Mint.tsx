import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { mockNFTDrops } from '@/lib/mock-data';
import MintForm from '@/components/mint/MintForm';
import { Loader } from 'lucide-react';

const Mint = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [dropData, setDropData] = useState<any>(null);

  useEffect(() => {
    // Simulating data fetching
    const fetchDrop = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would fetch the drop from the blockchain
        // For now, we'll use mock data
        const drop = mockNFTDrops.find((drop) => drop.slug === slug);
        
        if (drop) {
          // Simulate network delay
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setDropData(drop);
        }
      } catch (error) {
        console.error("Error fetching drop:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDrop();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center p-8">
          <Loader className="h-12 w-12 animate-spin text-aura-purple mb-4" />
          <h2 className="text-xl font-medium">Loading Drop...</h2>
        </div>
      </div>
    );
  }

  if (!dropData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-2">Drop Not Found</h2>
          <p className="text-gray-600">
            The NFT drop you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: NFT Preview */}
            <div>
              <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div className="aspect-square relative overflow-hidden rounded-md mb-4">
                  <img 
                    src={dropData.image} 
                    alt={dropData.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h1 className="text-2xl font-bold mb-2">{dropData.name}</h1>
                <p className="text-gray-600 mb-4">{dropData.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-500">Creator</p>
                    <p className="font-medium">{dropData.creator}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-500">Collection</p>
                    <p className="font-medium">{dropData.collection}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column: Mint Form */}
            <div>
              <MintForm 
                dropName={dropData.name}
                price={dropData.price.toString()}
                maxPerTx={5}
                availableSupply={dropData.totalSupply - dropData.mintedCount}
                contractAddress={dropData.contractAddress}
                image={dropData.image}
              />
              
              {/* Collection Info */}
              <div className="mt-6 bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-medium mb-2">Collection Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Supply:</span>
                    <span>{dropData.totalSupply}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Minted:</span>
                    <span>{dropData.mintedCount} / {dropData.totalSupply}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blockchain:</span>
                    <span>{dropData.blockchain}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mint;
