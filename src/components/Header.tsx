
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Plus } from "lucide-react";
import WalletButton from "@/components/wallet/WalletButton";
import NetworkDisplay from "@/components/wallet/NetworkDisplay";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-aura-purple to-aura-purple-dark bg-clip-text text-transparent">
              AURA
            </span>
            <span className="ml-2 text-xl font-semibold">NFT</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="font-medium hover:text-aura-purple transition-colors">
              Home
            </Link>
            <Link to="/explore" className="font-medium hover:text-aura-purple transition-colors">
              Explore
            </Link>
            <Link to="/dashboard/create" className="font-medium hover:text-aura-purple transition-colors">
              Create
            </Link>
            <Link to="/dashboard/drops" className="font-medium hover:text-aura-purple transition-colors">
              My Drops
            </Link>
          </div>

          {/* Wallet Connect Button and Network Display */}
          <div className="flex items-center space-x-4">
            <NetworkDisplay className="hidden md:flex" />
            <WalletButton />
            
            <Link to="/dashboard/create">
              <Button className="hidden md:flex items-center bg-aura-purple hover:bg-aura-purple-dark text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Drop
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                className="p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link
              to="/"
              className="block px-4 py-2 font-medium hover:bg-aura-purple-light hover:text-aura-purple rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/explore"
              className="block px-4 py-2 font-medium hover:bg-aura-purple-light hover:text-aura-purple rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore
            </Link>
            <Link
              to="/dashboard/create"
              className="block px-4 py-2 font-medium hover:bg-aura-purple-light hover:text-aura-purple rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Create
            </Link>
            <Link
              to="/dashboard/drops"
              className="block px-4 py-2 font-medium hover:bg-aura-purple-light hover:text-aura-purple rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              My Drops
            </Link>
            <div className="px-4 py-2">
              <NetworkDisplay />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
