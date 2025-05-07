
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Wallet } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';

interface ConnectWalletPromptProps {
  title?: string;
  description?: string;
  requiredAction?: string;
}

const ConnectWalletPrompt: React.FC<ConnectWalletPromptProps> = ({
  title = "Connect Your Wallet",
  description = "Connect your wallet to use this feature",
  requiredAction = "Connect"
}) => {
  const { connectWallet, walletDetected } = useWallet();

  return (
    <Card className="w-full max-w-md mx-auto border shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!walletDetected && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
              <div className="text-sm text-amber-800">
                No wallet detected. Please install MetaMask or another Web3 wallet to continue.
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <Button
          onClick={connectWallet}
          className="w-full"
          disabled={!walletDetected}
        >
          <Wallet className="mr-2 h-4 w-4" />
          {requiredAction}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConnectWalletPrompt;
