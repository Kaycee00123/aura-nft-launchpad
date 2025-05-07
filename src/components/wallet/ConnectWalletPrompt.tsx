
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface ConnectWalletPromptProps {
  title?: string;
  description?: string;
  requiredAction?: string;
}

const ConnectWalletPrompt: React.FC<ConnectWalletPromptProps> = ({
  title = "Connect Your Wallet",
  description = "Wallet connection is currently disabled",
  requiredAction = "Continue"
}) => {
  return (
    <Card className="w-full max-w-md mx-auto border shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
            <div className="text-sm text-amber-800">
              Wallet connection has been disabled in this application.
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center">
        {/* Empty footer */}
      </CardFooter>
    </Card>
  );
};

export default ConnectWalletPrompt;
