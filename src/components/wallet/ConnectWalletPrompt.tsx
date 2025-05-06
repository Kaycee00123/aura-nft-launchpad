
import React from 'react';
import { useWallet } from '@/context/WalletContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from '@/components/icons/Check';
import { Wallet, AlertCircle } from 'lucide-react';

interface ConnectWalletPromptProps {
  title?: string;
  description?: string;
  requiredAction?: string;
}

const ConnectWalletPrompt: React.FC<ConnectWalletPromptProps> = ({
  title = "Connect Your Wallet",
  description = "You need to connect your wallet to continue",
  requiredAction = "Continue"
}) => {
  const { isConnected, connectWallet } = useWallet();

  return (
    <Card className="w-full max-w-md mx-auto border shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Check className="h-5 w-5 text-green-500" />
              <span>Wallet Connected</span>
            </>
          ) : (
            <>
              <Wallet className="h-5 w-5 text-aura-purple" />
              <span>{title}</span>
            </>
          )}
        </CardTitle>
        <CardDescription>
          {isConnected 
            ? "Your wallet is connected successfully!" 
            : description
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isConnected && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
              <div className="text-sm text-amber-800">
                To {requiredAction.toLowerCase()}, you need to connect your wallet first.
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center">
        {!isConnected && (
          <Button 
            onClick={connectWallet}
            className="w-full bg-aura-purple hover:bg-aura-purple-dark flex items-center justify-center gap-2"
          >
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ConnectWalletPrompt;
