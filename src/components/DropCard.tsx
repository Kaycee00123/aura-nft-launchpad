
import { Link } from "react-router-dom";
import { NFTDrop } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";

type DropCardProps = {
  drop: NFTDrop;
};

const DropCard = ({ drop }: DropCardProps) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "upcoming":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "ended":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const formatDropStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const calculateMintProgress = (minted: number, supply: number) => {
    return (minted / supply) * 100;
  };

  const getMintProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 50) return "bg-orange-500";
    return "bg-aura-purple";
  };

  return (
    <Link to={`/drop/${drop.slug}`}>
      <div className="aura-card overflow-hidden transition-all duration-300 hover:translate-y-[-5px]">
        {/* Image Container */}
        <div className="relative">
          <AspectRatio ratio={16/9}>
            <img
              src={drop.thumbnailImage}
              alt={drop.title}
              className="w-full h-full object-cover rounded-t-lg"
            />
          </AspectRatio>
          <div className="absolute top-2 left-2 flex gap-2">
            <Badge
              variant="outline"
              className={`${getStatusBadgeVariant(drop.status)} border-none`}
            >
              {formatDropStatus(drop.status)}
            </Badge>
            <Badge
              variant="outline"
              className="bg-white/80 backdrop-blur-sm border-none text-gray-800"
            >
              {drop.blockchain}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg truncate">{drop.title}</h3>
            <span className="text-aura-purple font-medium">
              {drop.price} {drop.currency}
            </span>
          </div>

          <div className="flex items-center space-x-2 mb-3">
            <img
              src={drop.creator.avatar}
              alt={drop.creator.name}
              className="w-5 h-5 rounded-full"
            />
            <span className="text-sm text-gray-600">{drop.creator.name}</span>
            {drop.creator.verified && (
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

          {/* Mint Progress */}
          {drop.status !== "upcoming" && (
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>{drop.minted} minted</span>
                <span>{drop.supply} total</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${getMintProgressColor(
                    calculateMintProgress(drop.minted, drop.supply)
                  )} h-2 rounded-full`}
                  style={{
                    width: `${calculateMintProgress(drop.minted, drop.supply)}%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          {drop.status === "upcoming" && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                Mint starts in{" "}
                <span className="font-medium">
                  {new Date(drop.mintStart).toLocaleDateString()}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default DropCard;
