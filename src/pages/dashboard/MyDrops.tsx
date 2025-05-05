
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/context/WalletContext';
import { getFactoryContract, getDropContract } from '@/lib/contracts/contract-utils';
import { ipfsToHttpURL } from '@/lib/ipfs/ipfs-service';
import { ethers } from 'ethers';
import { Loader, Plus, ExternalLink } from 'lucide-react';

interface DropItem {
  address: string;
  name: string;
  symbol: string;
  totalSupply: number;
  maxSupply: number;
  logoURI: string;
  bannerURI: string;
}

const MyDrops = () => {
  const { toast } = useToast();
  const { wallet, isConnected, connectWallet } = useWallet();
  
  const [loading, setLoading] = useState(true);
  const [drops, setDrops] = useState<DropItem[]>([]);
  
  useEffect(() => {
    if (isConnected && wallet.address) {
      fetchUserDrops();
    } else {
      setLoading(false);
    }
  }, [isConnected, wallet.address, wallet.chainId]);
  
  const fetchUserDrops = async () => {
    try {
      setLoading(true);
      
      if (!wallet.address || !wallet.chainId) {
        setLoading(false);
        return;
      }
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Get factory contract
      const factoryContract = getFactoryContract(signer, wallet.chainId);
      
      // Get user's drops
      const userDropAddresses = await factoryContract.getCreatorDrops(wallet.address);
      
      if (userDropAddresses.length === 0) {
        setDrops([]);
        setLoading(false);
        return;
      }
      
      // Fetch details for each drop
      const dropsData = await Promise.all(
        userDropAddresses.map(async (address) => {
          try {
            const dropContract = getDropContract(address, signer);
            
            const [name, symbol, totalSupply, maxSupply, logoURI, bannerURI] = await Promise.all([
              dropContract.name(),
              dropContract.symbol(),
              dropContract.totalSupply(),
              dropContract.maxSupply(),
              dropContract.logoURI(),
              dropContract.bannerURI(),
            ]);
            
            return {
              address,
              name,
              symbol,
              totalSupply,
              maxSupply,
              logoURI: ipfsToHttpURL(logoURI),
              bannerURI: ipfsToHttpURL(bannerURI),
            };
          } catch (error) {
            console.error(`Error fetching drop ${address}:`, error);
            return null;
          }
        })
      );
      
      // Filter out any drops that failed to load
      setDrops(dropsData.filter((drop): drop is DropItem => drop !== null));
      
    } catch (error) {
      console.error('Error fetching user drops:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your NFT drops',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }
  
  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Connect Wallet</h2>
        <p className="text-gray-500 mb-6">Please connect your wallet to view your NFT drops</p>
        <Button onClick={connectWallet}>Connect Wallet</Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My NFT Drops</h1>
        <Link to="/dashboard/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Drop
          </Button>
        </Link>
      </div>
      
      {drops.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
          <div className="mb-4 text-gray-400">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">No NFT Drops Yet</h3>
          <p className="text-gray-500 mb-6">Create your first NFT drop to get started</p>
          <Link to="/dashboard/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Drop
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drops.map((drop) => (
            <Card key={drop.address} className="overflow-hidden">
              <div className="aspect-video bg-gray-100 overflow-hidden">
                {drop.bannerURI ? (
                  <img
                    src={drop.bannerURI}
                    alt={drop.name}
                    className="w-full h-full object-cover"
                  />
                ) : drop.logoURI ? (
                  <img
                    src={drop.logoURI}
                    alt={drop.name}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-1">{drop.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{drop.symbol}</p>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-xs text-gray-500">Minted</p>
                    <p className="font-medium">{drop.totalSupply} / {drop.maxSupply}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-xs text-gray-500">Completion</p>
                    <p className="font-medium">
                      {Math.round((drop.totalSupply / drop.maxSupply) * 100)}%
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Link to={`/drop/${drop.address}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      View Drop
                    </Button>
                  </Link>
                  <Link to={`/mint/${drop.address}`} className="flex-1">
                    <Button className="w-full">
                      Mint Page
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-gray-500 hover:text-gray-700"
                    onClick={() => {
                      const explorerUrl = wallet.chain?.blockExplorers?.default.url;
                      if (explorerUrl) {
                        window.open(`${explorerUrl}/address/${drop.address}`, "_blank");
                      }
                    }}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Contract
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDrops;
