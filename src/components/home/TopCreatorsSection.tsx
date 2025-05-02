
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockCreators } from "@/lib/mock-data";
import { ArrowRight } from "lucide-react";

const TopCreatorsSection = () => {
  // Sort creators by total sales (descending)
  const sortedCreators = [...mockCreators].sort((a, b) => b.totalSales - a.totalSales);
  
  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Top Creators</h2>
            <p className="text-gray-600 max-w-lg">
              Meet the artists and creators who are pushing the boundaries of digital art
            </p>
          </div>
          <Link to="/creators" className="mt-4 md:mt-0">
            <Button variant="outline" className="border-aura-purple text-aura-purple">
              View All Creators
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {sortedCreators.map((creator) => (
            <Link 
              to={`/creator/${creator.id}`} 
              key={creator.id}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 flex flex-col items-center text-center"
            >
              <Avatar className="w-20 h-20 mb-3">
                <AvatarImage src={creator.avatar} alt={creator.name} />
                <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex items-center space-x-1 mb-1">
                <h3 className="font-semibold text-lg">{creator.name}</h3>
                {creator.verified && (
                  <svg
                    className="w-4 h-4 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                )}
              </div>
              <p className="text-sm text-gray-500">{creator.totalSales} sales</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCreatorsSection;
