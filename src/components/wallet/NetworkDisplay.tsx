
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface NetworkDisplayProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
}

const NetworkDisplay: React.FC<NetworkDisplayProps> = ({ 
  className = "", 
  variant = "outline" 
}) => {
  // Network display is now just a placeholder
  return null;
};

export default NetworkDisplay;
