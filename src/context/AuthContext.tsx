
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useWallet } from "./WalletContext";

type User = {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  isCreator: boolean;
  walletAddress?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  connectUserWallet: () => Promise<void>;
  disconnectWallet: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { connectWallet, disconnectWallet, wallet } = useWallet();

  // Check for existing session on mount
  useEffect(() => {
    // Mock: Check localStorage for existing session
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    }
    setIsLoading(false);
  }, []);

  // Update user when wallet changes
  useEffect(() => {
    if (user && wallet.address) {
      const updatedUser = { ...user, walletAddress: wallet.address };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  }, [wallet.address, user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock: simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock validation
      if (email === "admin@aura.com" && password === "admin123") {
        const adminUser = {
          id: "admin1",
          username: "Admin",
          email: "admin@aura.com",
          isAdmin: true,
          isCreator: false,
          walletAddress: wallet.address
        };
        
        setUser(adminUser);
        localStorage.setItem("user", JSON.stringify(adminUser));
        toast({
          title: "Welcome back, Admin!",
          description: "You have successfully logged in.",
        });
      } else if (email === "creator@aura.com" && password === "creator123") {
        const creatorUser = {
          id: "creator1",
          username: "Creator",
          email: "creator@aura.com",
          isAdmin: false,
          isCreator: true,
          walletAddress: wallet.address
        };
        
        setUser(creatorUser);
        localStorage.setItem("user", JSON.stringify(creatorUser));
        toast({
          title: "Welcome back, Creator!",
          description: "You have successfully logged in.",
        });
      } else if (email === "user@aura.com" && password === "user123") {
        const regularUser = {
          id: "user1",
          username: "User",
          email: "user@aura.com",
          isAdmin: false,
          isCreator: false,
          walletAddress: wallet.address
        };
        
        setUser(regularUser);
        localStorage.setItem("user", JSON.stringify(regularUser));
        toast({
          title: "Welcome back, User!",
          description: "You have successfully logged in.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid credentials. Please try again.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "An error occurred during login.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const connectUserWallet = async () => {
    if (user) {
      setIsLoading(true);
      try {
        await connectWallet();
        // The wallet address will be updated via the useEffect that watches wallet.address
      } catch (error) {
        console.error("Error connecting wallet:", error);
        toast({
          variant: "destructive",
          title: "Wallet Connection Failed",
          description: "Could not connect to your wallet.",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in before connecting your wallet.",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        connectUserWallet,
        disconnectWallet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
