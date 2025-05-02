// Mock data for NFT drops
export type Creator = {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  totalSales: number;
  bannerImage?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
  bio?: string;
};

export type NFTDrop = {
  id: string;
  slug: string;
  title: string;
  description: string;
  bannerImage: string;
  thumbnailImage: string;
  creatorId: string;
  creator: Creator;
  price: number;
  currency: string;
  supply: number;
  minted: number;
  blockchain: 'Ethereum' | 'Polygon' | 'Solana';
  status: 'upcoming' | 'active' | 'ended';
  mintStart: string; // ISO date string
  mintEnd: string; // ISO date string
  traits: Array<{ name: string; value: string }>;
  gallery: string[];
};

export const mockCreators: Creator[] = [
  {
    id: "1",
    name: "PixelMaster",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=PixelMaster",
    verified: true,
    totalSales: 1245,
    bannerImage: "https://images.unsplash.com/photo-1634926878768-2a5b3c42f139?q=80&w=1920&auto=format&fit=crop",
    twitter: "pixelmaster",
    instagram: "pixel_master",
    website: "https://pixelmaster.art",
    bio: "Creating digital art since 2010. Specializing in pixel art and retro game aesthetics.",
  },
  {
    id: "2",
    name: "CryptoArtist",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=CryptoArtist",
    verified: true,
    totalSales: 982,
    bannerImage: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=1920&auto=format&fit=crop",
    twitter: "cryptoartist",
    instagram: "crypto_artist",
    website: "https://cryptoartist.io",
    bio: "Blockchain art enthusiast and pioneer in the NFT space since 2018.",
  },
  {
    id: "3",
    name: "NFTWizard",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=NFTWizard",
    verified: false,
    totalSales: 657,
    bannerImage: "https://images.unsplash.com/photo-1629392554711-1b3481d1d8c0?q=80&w=1920&auto=format&fit=crop",
    twitter: "nftwizard",
    instagram: "nft_wizard",
    bio: "Creating magical digital collectibles inspired by fantasy and mythology.",
  },
  {
    id: "4",
    name: "DigitalDreamer",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=DigitalDreamer",
    verified: true,
    totalSales: 423,
    bannerImage: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=1920&auto=format&fit=crop",
    twitter: "digitaldreamer",
    website: "https://digitaldreamer.art",
    bio: "Dreams transformed into digital art. Exploring surrealism in the digital realm.",
  },
  {
    id: "5",
    name: "VirtualVanguard",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=VirtualVanguard",
    verified: false,
    totalSales: 312,
    bannerImage: "https://images.unsplash.com/photo-1655635949212-1d8f4f103ea1?q=80&w=1920&auto=format&fit=crop",
    instagram: "virtual_vanguard",
    bio: "Leading the way in virtual and augmented reality art experiences.",
  },
  {
    id: "6",
    name: "ArtificialArtisan",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=ArtificialArtisan",
    verified: true,
    totalSales: 254,
    bannerImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1920&auto=format&fit=crop",
    twitter: "aiartisan",
    website: "https://artificialartisan.com",
    bio: "Blending AI and human creativity to create unique digital masterpieces.",
  },
];

export const mockNFTDrops: NFTDrop[] = [
  {
    id: "1",
    slug: "cosmic-creatures",
    title: "Cosmic Creatures",
    description: "A collection of 5,000 unique cosmic creatures from another dimension. Each creature has its own unique traits and abilities.",
    bannerImage: "https://images.unsplash.com/photo-1634926878768-2a5b3c42f139?q=80&w=1920&auto=format&fit=crop",
    thumbnailImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop",
    creatorId: "1",
    creator: mockCreators[0],
    price: 0.08,
    currency: "ETH",
    supply: 5000,
    minted: 2348,
    blockchain: "Ethereum",
    status: "active",
    mintStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    mintEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    traits: [
      { name: "Background", value: "Space" },
      { name: "Skin", value: "Celestial" },
      { name: "Eyes", value: "Galactic" },
      { name: "Accessories", value: "Starmap" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1606041011872-596597976b25?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618172193763-c511deb635ca?q=80&w=600&auto=format&fit=crop",
    ],
  },
  {
    id: "2",
    slug: "neon-ninjas",
    title: "Neon Ninjas",
    description: "3,333 cyber ninjas living in the neon city of 2089. Each ninja has unique cybernetic enhancements and abilities.",
    bannerImage: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=1920&auto=format&fit=crop",
    thumbnailImage: "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?q=80&w=400&auto=format&fit=crop",
    creatorId: "2",
    creator: mockCreators[1],
    price: 0.1,
    currency: "ETH",
    supply: 3333,
    minted: 1500,
    blockchain: "Ethereum",
    status: "active",
    mintStart: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    mintEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    traits: [
      { name: "Weapon", value: "Plasma Blade" },
      { name: "Armor", value: "Cybernetic" },
      { name: "Background", value: "Neon City" },
      { name: "Ability", value: "Stealth" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1634193295627-1cdddf751ebf?q=80&w=600&auto=format&fit=crop",
    ],
  },
  {
    id: "3",
    slug: "meta-pets",
    title: "Meta Pets",
    description: "10,000 digital pets that live in the metaverse. Each pet has unique abilities and can be trained to earn rewards.",
    bannerImage: "https://images.unsplash.com/photo-1629392554711-1b3481d1d8c0?q=80&w=1920&auto=format&fit=crop",
    thumbnailImage: "https://images.unsplash.com/photo-1626544827763-d516dce335e2?q=80&w=400&auto=format&fit=crop",
    creatorId: "3",
    creator: mockCreators[2],
    price: 0.05,
    currency: "ETH",
    supply: 10000,
    minted: 8763,
    blockchain: "Polygon",
    status: "active",
    mintStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    mintEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    traits: [
      { name: "Type", value: "Dragon" },
      { name: "Element", value: "Fire" },
      { name: "Rarity", value: "Legendary" },
      { name: "Ability", value: "Flight" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1626544827763-d516dce335e2?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1612898008338-31303cd14c70?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=600&auto=format&fit=crop",
    ],
  },
  {
    id: "4",
    slug: "abstract-dimensions",
    title: "Abstract Dimensions",
    description: "An exploration of abstract art in the digital realm. Each piece is unique and generated algorithmically.",
    bannerImage: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=1920&auto=format&fit=crop",
    thumbnailImage: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=400&auto=format&fit=crop",
    creatorId: "4",
    creator: mockCreators[3],
    price: 0.15,
    currency: "ETH",
    supply: 2000,
    minted: 1846,
    blockchain: "Ethereum",
    status: "ended",
    mintStart: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
    mintEnd: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    traits: [
      { name: "Style", value: "Geometric" },
      { name: "Colors", value: "Vibrant" },
      { name: "Complexity", value: "High" },
      { name: "Technique", value: "Generative" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?q=80&w=600&auto=format&fit=crop",
    ],
  },
  {
    id: "5",
    slug: "future-fauna",
    title: "Future Fauna",
    description: "A collection of 8,888 animals evolved for the world of tomorrow. Each creature has adapted to future environments in unique ways.",
    bannerImage: "https://images.unsplash.com/photo-1655635949212-1d8f4f103ea1?q=80&w=1920&auto=format&fit=crop",
    thumbnailImage: "https://images.unsplash.com/photo-1597600159211-d6c104f408d1?q=80&w=400&auto=format&fit=crop",
    creatorId: "5",
    creator: mockCreators[4],
    price: 0.12,
    currency: "ETH",
    supply: 8888,
    minted: 0,
    blockchain: "Solana",
    status: "upcoming",
    mintStart: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days in future
    mintEnd: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString(), // 37 days in future
    traits: [
      { name: "Species", value: "Hybrid" },
      { name: "Habitat", value: "Aquatic" },
      { name: "Mutation", value: "Bioluminescence" },
      { name: "Diet", value: "Energy" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1597600159211-d6c104f408d1?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589656966895-2f33e7653819?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618336753974-aae8e04506a3?q=80&w=600&auto=format&fit=crop",
    ],
  },
  {
    id: "6",
    slug: "pixel-kingdoms",
    title: "Pixel Kingdoms",
    description: "6,000 unique pixel art kingdoms with different landscapes, castles, and inhabitants. Each kingdom can be expanded and developed.",
    bannerImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1920&auto=format&fit=crop",
    thumbnailImage: "https://images.unsplash.com/photo-1635321593217-40050ad13c74?q=80&w=400&auto=format&fit=crop",
    creatorId: "6",
    creator: mockCreators[5],
    price: 0.08,
    currency: "ETH",
    supply: 6000,
    minted: 2500,
    blockchain: "Polygon",
    status: "active",
    mintStart: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    mintEnd: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days from now
    traits: [
      { name: "Terrain", value: "Mountains" },
      { name: "Castle", value: "Fortress" },
      { name: "Population", value: "Large" },
      { name: "Resource", value: "Gold" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1635321593217-40050ad13c74?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1634193295627-1cdddf751ebf?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1642882874306-87396d960694?q=80&w=600&auto=format&fit=crop",
    ],
  },
];

// Community stats
export const communityStats = {
  totalUsers: "125K+",
  totalCreators: "15K+",
  totalVolume: "$240M+",
  totalNFTs: "1.5M+",
};
