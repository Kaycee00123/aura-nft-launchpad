
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { shortenAddress } from "@/lib/wallet-utils";
import { Wallet } from "lucide-react";

export default function Header() {
  const { user, isAuthenticated, logout, connectUserWallet, disconnectWallet } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleWalletConnect = () => {
    if (user?.wallet?.isConnected) {
      disconnectWallet();
    } else {
      connectUserWallet();
    }
  };

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
            <Link to="/create" className="font-medium hover:text-aura-purple transition-colors">
              Create
            </Link>
            <Link to="/about" className="font-medium hover:text-aura-purple transition-colors">
              About
            </Link>
          </div>

          {/* Auth Buttons & User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Wallet Button */}
                <Button 
                  variant="outline" 
                  className="font-medium border-aura-purple text-aura-purple hover:bg-aura-purple hover:text-white"
                  onClick={handleWalletConnect}
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  {user?.wallet?.isConnected 
                    ? shortenAddress(user.wallet.address)
                    : "Connect Wallet"}
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarImage src={`https://api.dicebear.com/7.x/personas/svg?seed=${user?.username}`} alt={user?.username} />
                      <AvatarFallback>{user?.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem className="font-medium">{user?.username}</DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/profile" className="w-full">Profile</Link>
                    </DropdownMenuItem>
                    {user?.isCreator && (
                      <DropdownMenuItem>
                        <Link to="/dashboard" className="w-full">Creator Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    {user?.isAdmin && (
                      <DropdownMenuItem>
                        <Link to="/admin" className="w-full">Admin Panel</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={logout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="font-medium hover:bg-aura-purple-light hover:text-aura-purple">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="font-medium bg-aura-purple hover:bg-aura-purple-dark text-white">
                    Sign up
                  </Button>
                </Link>
              </>
            )}

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
              to="/create"
              className="block px-4 py-2 font-medium hover:bg-aura-purple-light hover:text-aura-purple rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Create
            </Link>
            <Link
              to="/about"
              className="block px-4 py-2 font-medium hover:bg-aura-purple-light hover:text-aura-purple rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
