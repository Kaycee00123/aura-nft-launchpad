
import React from 'react';
import { useWallet } from '@/context/WalletContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from '@/components/icons/Check';
import { Wallet, AlertCircle, Download } from 'lucide-react';

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
  const { isConnected, connectWallet, walletDetected } = useWallet();

  const handleWalletClick = () => {
    if (walletDetected) {
      connectWallet();
    } else {
      // Open MetaMask download page in a new tab
      window.open('https://metamask.io/download/', '_blank');
    }
  };

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
                To {requiredAction.toLowerCase()}, you need to {walletDetected ? 'connect' : 'install'} a wallet first.
              </div>
            </div>
          </div>
        )}
        
        {!isConnected && !walletDetected && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
            <p className="text-sm mb-2">No wallet detected. You need a Web3 wallet like MetaMask to interact with this platform.</p>
            <ol className="list-decimal list-inside text-sm space-y-1 text-gray-700">
              <li>Install MetaMask or another wallet extension</li>
              <li>Create or import a wallet</li>
              <li>Return to this page and connect</li>
            </ol>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center">
        {!isConnected && (
          <Button 
            onClick={handleWalletClick}
            className="w-full bg-aura-purple hover:bg-aura-purple-dark flex items-center justify-center gap-2"
          >
            {walletDetected ? (
              <>
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Install Wallet
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ConnectWalletPrompt;
