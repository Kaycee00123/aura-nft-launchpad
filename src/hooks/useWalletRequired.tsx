
import { useState } from 'react';
import { useWallet } from '@/context/WalletContext';

export const useWalletRequired = (redirectIfNotConnected: boolean = false) => {
  const { isConnected, wallet, walletDetected } = useWallet();
  const [isCheckingWallet, setIsCheckingWallet] = useState(false);

  // Since wallet connection is removed, this hook now just returns the values
  // without doing any actual wallet checks
  return {
    isConnected: false,
    isCheckingWallet: false,
    wallet,
    walletDetected: false
  };
};
