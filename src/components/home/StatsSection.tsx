
import { communityStats } from "@/lib/mock-data";

const StatsSection = () => {
  return (
    <section className="py-16 md:py-20 px-4 bg-gradient-to-br from-aura-purple/10 to-white">
      <div className="container mx-auto max-w-6xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Aura NFT Community</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
          Join thousands of creators and collectors building the future of digital ownership
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-aura-purple to-aura-purple-dark bg-clip-text text-transparent mb-2">
              {communityStats.totalUsers}
            </div>
            <p className="text-gray-600">Users</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-aura-purple to-aura-purple-dark bg-clip-text text-transparent mb-2">
              {communityStats.totalCreators}
            </div>
            <p className="text-gray-600">Creators</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-aura-purple to-aura-purple-dark bg-clip-text text-transparent mb-2">
              {communityStats.totalNFTs}
            </div>
            <p className="text-gray-600">NFTs</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-aura-purple to-aura-purple-dark bg-clip-text text-transparent mb-2">
              {communityStats.totalVolume}
            </div>
            <p className="text-gray-600">Volume</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
