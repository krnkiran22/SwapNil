
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Brain, Shield, Network } from "lucide-react";
import Navbar from "./components/Navbar";

export default function Home() {
  const features = [
    {
      icon: Zap,
      title: "AI-Powered Swaps",
      desc: "Optimize your trades with intelligent routing across multiple DEXs for the best rates.",
      color: "text-teal-300",
    },
    {
      icon: Brain,
      title: "Smart Trading Assistant",
      desc: "Get real-time market insights and personalized strategies via our AI chat interface.",
      color: "text-fuchsia-300",
    },
    {
      icon: Shield,
      title: "Secure Wallet Integration",
      desc: "Seamlessly connect with Leather wallet for safe and efficient DeFi operations.",
      color: "text-orange-300",
    },
    {
      icon: Network,
      title: "Cross-Chain Trading",
      desc: "Trade across multiple blockchains with minimal fees and maximum efficiency.",
      color: "text-emerald-300",
    },
  ];

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen flex flex-col"
        style={{
          background:
            "radial-gradient(1200px 800px at 10% -10%, #0EA5E922, transparent), radial-gradient(900px 700px at 90% 110%, #22C55E22, transparent), linear-gradient(180deg,#0B0F19 0%, #0A0E17 100%)",
        }}
      >
        {/* Hero Section */}
        <motion.section
          className="flex flex-col items-center justify-center pt-24 pb-16 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-3xl w-full text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-2 mb-6 shadow-[0_0_20px_rgba(0,255,209,0.15)]">
              <Zap className="w-4 h-4 text-teal-300" />
              <span className="text-teal-200 text-sm font-medium">
                Next-Gen DeFi Trading
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-teal-100 to-fuchsia-200 bg-clip-text text-transparent mb-4">
              Trade Smarter with ViratKholi swap
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
              Unlock the power of AI-driven DeFi with seamless token swaps, real-time market insights, and secure wallet operations. Start your journey today.
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <Link
                href="/SwapPage"
                className="flex-1 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold px-8 py-6 rounded-2xl shadow-lg text-center text-xl transition-all border border-white/30 hover:scale-[1.02]"
              >
                Swap Tokens
              </Link>
              <Link
                href="/intent"
                className="flex-1 bg-gradient-to-r from-fuchsia-600 to-purple-500 hover:from-fuchsia-500 hover:to-purple-400 text-white font-bold px-8 py-6 rounded-2xl shadow-lg text-center text-xl transition-all border border-white/30 hover:scale-[1.02]"
              >
                AI Intent Chat
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <section className="max-w-4xl w-full mx-auto px-4 py-16">
          <motion.h2
            className="text-3xl font-bold text-white text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Why ViratKholi swap Stands Out
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 border border-white/20 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-white/70">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <motion.section
          className="max-w-3xl w-full mx-auto px-4 py-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your DeFi Experience?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Join thousands of traders using Virat Kholi AI-powered tools for smarter, faster, and safer DeFi transactions.
          </p>
          <Link
            href="/SwapPage"
            className="inline-block bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold px-8 py-4 rounded-2xl shadow-lg text-lg transition-all border border-white/30 hover:scale-[1.02]"
          >
            Get Started Now -
          </Link>
        </motion.section>

        {/* Footer */}
        <footer className="w-full py-8 border-t border-white/10 bg-white/5 text-center">
          <p className="text-white/70 text-sm mb-4">
            virat kholi &copy; 2025 | Powered by UnifiedSwapService & AI Technology
          </p>
          <div className="flex justify-center gap-6">
            <Link
              href="#"
              className="text-white/70 hover:text-teal-300 text-sm transition"
            >
              About
            </Link>
            <Link
              href="#"
              className="text-white/70 hover:text-teal-300 text-sm transition"
            >
              Documentation
            </Link>
            <Link
              href="#"
              className="text-white/70 hover:text-teal-300 text-sm transition"
            >
              Support
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
}