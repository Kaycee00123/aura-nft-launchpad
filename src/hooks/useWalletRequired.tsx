
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@/context/WalletContext';

export const useWalletRequired = (redirectIfNotConnected: boolean = false) => {
  const { isConnected, wallet, walletDetected, connectWallet } = useWallet();
  const [isCheckingWallet, setIsCheckingWallet] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkWalletConnection = async () => {
      setIsCheckingWallet(true);
      
      if (!isConnected && redirectIfNotConnected) {
        // Redirect to home page if wallet is not connected
        navigate('/');
      }
      
      setIsCheckingWallet(false);
    };
    
    checkWalletConnection();
  }, [isConnected, navigate, redirectIfNotConnected]);

  return {
    isConnected,
    isCheckingWallet,
    wallet,
    walletDetected,
    connectWallet
  };
};
