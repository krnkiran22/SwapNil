"use client";
import Link from "next/link";
import { Zap, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Leather connection
// The Window interface is already declared in types/leather.d.ts, so no need to redeclare here.

interface LeatherAddress {
  symbol: string;
  address: string;
}

export default function Navbar() {
  const [account, setAccount] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if user was previously connected
    const savedAccount = localStorage.getItem("leather_connected_account");
    if (savedAccount) {
      setAccount(savedAccount);
    }
  }, []);

  if (!mounted) return null;

  const connectWallet = async () => {
    // Check if Leather is installed
    if (!window.LeatherProvider) {
      setAlertMessage("❌ Please install Leather Wallet!");
      setTimeout(() => setAlertMessage(null), 3000);
      // Removed opening the install page as per request
      return;
    }

    try {
      // Correct Leather Wallet connection method
      const resp = await window.LeatherProvider.request("getAddresses");
      // resp.result.addresses is the array of address objects
      const addresses = resp?.result?.addresses;
      if (addresses && addresses.length > 0) {
        // Find the STX address (assuming this is for Stacks/SwapZilla)
        const stxAddressObj = addresses.find((addr: LeatherAddress) => addr.symbol === "STX");
        if (stxAddressObj) {
          const address = stxAddressObj.address;
          setAccount(address);
          localStorage.setItem("leather_connected_account", address);
          setAlertMessage("✅ Wallet Connected via Leather!");
          setTimeout(() => setAlertMessage(null), 3000);
        } else {
          setAlertMessage("⚠️ No STX address found.");
          setTimeout(() => setAlertMessage(null), 3000);
        }
      } else {
        setAlertMessage("⚠️ No addresses returned from Leather Wallet.");
        setTimeout(() => setAlertMessage(null), 3000);
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
      setAlertMessage("⚠️ Wallet connection failed. Try again.");
      setTimeout(() => setAlertMessage(null), 3000);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    localStorage.removeItem("leather_connected_account");
    setAlertMessage("👋 Wallet Disconnected");
    setTimeout(() => setAlertMessage(null), 3000);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/5 backdrop-blur-2xl border-b border-white/10 shadow-[0_0_30px_rgba(0,255,209,0.1)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <Link
            href="/"
            className="text-lg text-white/80 hover:text-white px-4 py-2 rounded transition"
          >
            SwapZilla
          </Link>
</div>
        {/* Links + Wallet */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/SwapPage"
            className="text-lg text-white/80 hover:text-white px-4 py-2 rounded transition"
          >
            Swap
          </Link>
          <Link
            href="/intent"
            className="text-lg text-white/80 hover:text-white px-4 py-2 rounded transition"
          >
            Intent
          </Link>

          {!account ? (
            <button
              onClick={connectWallet}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="relative group">
              <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl cursor-pointer">
                <span className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center text-white font-bold">
                  {account.slice(2, 4).toUpperCase()}
                </span>
                <span className="text-white font-medium">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              </div>
              <div className="absolute right-0 mt-2 w-40 bg-slate-900/90 border border-white/10 rounded-xl p-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={disconnectWallet}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-white"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notifications */}
      <AnimatePresence>
        {alertMessage && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`absolute top-20 right-5 px-6 py-3 rounded-xl shadow-lg text-white ${
              alertMessage.startsWith("✅")
                ? "bg-emerald-500"
                : alertMessage.startsWith("❌")
                ? "bg-red-500"
                : "bg-yellow-500"
            }`}
          >
            {alertMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}