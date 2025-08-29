"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Leather wallet types
interface LeatherAddress {
  symbol: string;
  address: string;
  publicKey?: string;
}

interface WalletContextType {
  account: string | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  getWalletInfo: () => { address: string | null; isConnected: boolean };
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check if user was previously connected
    const savedAccount = localStorage.getItem("leather_connected_account");
    if (savedAccount) {
      setAccount(savedAccount);
      setIsConnected(true);
    }
  }, []);

  const connectWallet = async () => {
    // Check if Leather is installed
    if (!window.LeatherProvider) {
      alert("❌ Please install Leather Wallet!");
      return;
    }

    try {
      // Correct Leather Wallet connection method
      const resp = await window.LeatherProvider.request("getAddresses");
      const addresses = resp?.result?.addresses;
      
      if (addresses && addresses.length > 0) {
        // Find the STX address
        const stxAddressObj = addresses.find((addr: LeatherAddress) => addr.symbol === "STX");
        if (stxAddressObj) {
          const address = stxAddressObj.address;
          setAccount(address);
          setIsConnected(true);
          localStorage.setItem("leather_connected_account", address);
          console.log("✅ Wallet Connected via Leather!");
        } else {
          alert("⚠️ No STX address found.");
        }
      } else {
        alert("⚠️ No addresses returned from Leather Wallet.");
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("❌ Failed to connect wallet. Please try again.");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    localStorage.removeItem("leather_connected_account");
    console.log("🔌 Wallet Disconnected");
  };

  const getWalletInfo = () => {
    return {
      address: account,
      isConnected: isConnected
    };
  };

  return (
    <WalletContext.Provider value={{
      account,
      isConnected,
      connectWallet,
      disconnectWallet,
      getWalletInfo
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
