'use client';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpDown, Zap, TrendingUp, Shield, Clock, Settings, Info,
  CheckCircle2, Sparkles, Globe, Lock, BarChart3, Activity, Cpu, Server
} from "lucide-react";
import Navbar from "../components/Navbar";

const tokens = [
  { symbol: "AVAX", name: "Avalanche", price: 42.15, change: 5.2, logo: "🔺" },
  { symbol: "USDC", name: "USD Coin", price: 1.0, change: 0.1, logo: "💵" },
  { symbol: "ETH", name: "Ethereum", price: 3245.78, change: -2.1, logo: "⟐" },
  { symbol: "BTC", name: "Bitcoin", price: 68420.5, change: 3.8, logo: "₿" },
  { symbol: "LINK", name: "Chainlink", price: 18.65, change: 7.3, logo: "🔗" },
  { symbol: "UNI", name: "Uniswap", price: 12.34, change: -1.5, logo: "🦄" }
];

export default function SwapPage() {
  const [fromToken, setFromToken] = useState(tokens[0]);
  const [toToken, setToToken] = useState(tokens[1]);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [slippage, setSlippage] = useState("0.5");
  const [estimatedGas, setEstimatedGas] = useState<number | null>(null);
  const [flip, setFlip] = useState(false); // visual flip animation trigger


  // Mock quote calculation
  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      setShowQuote(true);
      const estimated = (parseFloat(amount) * fromToken.price) / toToken.price;
      setEstimatedGas(Math.random() * 50 + 10);
    } else {
      setShowQuote(false);
    }
  }, [amount, fromToken, toToken]);

  const handleSwap = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Mock successful swap
    }, 2000);
  };

  const swapTokens = () => {
    // visual flip
    setFlip(!flip);
    setTimeout(() => setFlip(false), 450);

    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const estimatedOutput =
    amount ? ((parseFloat(amount) * fromToken.price) / toToken.price).toFixed(6) : "0";

  // ---- extra derived insights (pure UI) ----
  const priceRatio = (fromToken.price / toToken.price) || 0;
  const tradeSizeUsd = (parseFloat(amount || "0") * fromToken.price) || 0;
  const priceImpact = tradeSizeUsd <= 0 ? 0 : Math.min(2.5, Math.sqrt(tradeSizeUsd) / 200); // mock %
  const liquidityTier = tradeSizeUsd < 1_000 ? "Retail" : tradeSizeUsd < 25_000 ? "Pro" : "Whale";
  const volatility = Math.abs(fromToken.change) + Math.abs(toToken.change); // mock composite

  return (
    <>
      <Navbar />
      <div className="min-h-screen relative overflow-hidden pt-20"
           style={{ background: "radial-gradient(1200px 800px at 10% -10%, #0EA5E922, transparent), radial-gradient(900px 700px at 90% 110%, #22C55E22, transparent), linear-gradient(180deg,#0B0F19 0%, #0A0E17 100%)" }}>

        {/* Neon Orbs / Glass Glow */}
        {/* <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -right-40 w-[28rem] h-[28rem] rounded-full blur-3xl bg-cyan-500/20 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-[28rem] h-[28rem] rounded-full blur-3xl bg-fuchsia-500/10 animate-pulse [animation-delay:1s]" />
        </div> */}

        <div className="relative z-10 px-4 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-2 mb-6 shadow-[0_0_40px_rgba(0,255,209,0.15)]">
                <Sparkles className="w-4 h-4 text-teal-300" />
                <span className="text-teal-200 text-sm font-medium">AI-Optimized Cross-DEX Routing</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-teal-100 to-fuchsia-200 bg-clip-text text-transparent mb-3">
                Token Swap
              </h1>
              <p className="text-lg text-white/70 max-w-3xl mx-auto">
                Premium, lightning-fast swaps with smart routing, MEV-aware protection, and concierge-grade UX.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left rail: Market + Stack */}
              <div className="lg:col-span-1 space-y-6">
                {/* Market Overview */}
                <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-teal-300" />
                    Market Overview
                  </h3>
                  <div className="space-y-4">
                    {tokens.slice(0, 4).map((token) => (
                      <div key={token.symbol} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{token.logo}</span>
                          <div>
                            <p className="text-white font-medium">{token.symbol}</p>
                            <p className="text-gray-400 text-xs">{token.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">${token.price.toLocaleString()}</p>
                          <p className={`text-xs ${token.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {token.change >= 0 ? '+' : ''}{token.change}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Blockchain Stack (generic, not Avalanche-specific) */}
                <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-300" />
                    Blockchain Stack
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-white/80">
                      <Cpu className="w-4 h-4 text-teal-300" /> EVM Compatible
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Activity className="w-4 h-4 text-fuchsia-300" /> ~1–2s Block Time
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Server className="w-4 h-4 text-cyan-300" /> PoS / Rollup
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Globe className="w-4 h-4 text-amber-300" /> Cross-DEX Routing
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
                    </span>
                    <span className="text-emerald-300 text-xs">Network healthy • Low fees</span>
                  </div>
                </div>
              </div>

              {/* Main Swap */}
              <div className="lg:col-span-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_80px_rgba(157,78,221,0.18)] overflow-hidden">
                  {/* Card header */}
                  <div className="bg-gradient-to-r from-white/5 via-fuchsia-500/10 to-teal-500/10 p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-2xl flex items-center justify-center">
                          <ArrowUpDown className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">Token Swap</h2>
                          <p className="text-teal-200 text-sm">Secure smart-order routing</p>
                        </div>
                      </div>
                      <div suppressHydrationWarning>
                      <button className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                        <Settings className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>

                    </div>
                  </div>

                  <div className="p-8">
                    {/* FROM */}
                    <div className={`mb-6 transition-transform duration-500 `}>
                      <label className="block text-white/80 text-sm font-medium mb-3">From</label>
                      <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-4 hover:border-teal-400/40 transition-all">
                        <div className="flex items-center justify-between mb-3">
                          <select
                            className="bg-transparent text-white text-lg font-semibold outline-none appearance-none cursor-pointer"
                            value={fromToken.symbol}
                            onChange={e => setFromToken(tokens.find(t => t.symbol === e.target.value) || tokens[0])}
                          >
                            {tokens.map(t => (
                              <option key={t.symbol} value={t.symbol} className="bg-slate-800">
                                {t.symbol}
                              </option>
                            ))}
                          </select>
                          <p className="text-white/60 text-xs">Balance: 1,234.56</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{fromToken.logo}</span>
                            <div>
                              <p className="text-white font-medium">{fromToken.name}</p>
                              <p className="text-gray-400 text-xs">${fromToken.price.toLocaleString()}</p>
                            </div>
                          </div>
                          <input
                            type="number"
                            className="bg-transparent text-white text-right text-xl font-bold outline-none placeholder-gray-500 w-32"
                            placeholder="0.0"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Swap Arrow */}
                    <div className="flex justify-center mb-6">
                      <button
                        onClick={swapTokens}
                        className="group w-12 h-12 pl-3 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl hover:scale-110 transition-all relative overflow-hidden"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/0 via-fuchsia-500/20 to-teal-400/0 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700" />
                        <ArrowUpDown className="w-5 h-5 text-teal-300 relative z-10" />
                      </button>
                    </div>

                    {/* TO */}
                    <div className={`mb-6 transition-transform duration-500 `}>
                      <label className="block text-white/80 text-sm font-medium mb-3">To</label>
                      <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-4 hover:border-fuchsia-400/40 transition-all">
                        <div className="flex items-center justify-between mb-3">
                          <select
                            className="bg-transparent text-white text-lg font-semibold outline-none appearance-none cursor-pointer"
                            value={toToken.symbol}
                            onChange={e => setToToken(tokens.find(t => t.symbol === e.target.value) || tokens[1])}
                          >
                            {tokens.map(t => (
                              <option key={t.symbol} value={t.symbol} className="bg-slate-800">
                                {t.symbol}
                              </option>
                            ))}
                          </select>
                          <p className="text-white/60 text-xs">Balance: 567.89</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{toToken.logo}</span>
                            <div>
                              <p className="text-white font-medium">{toToken.name}</p>
                              <p className="text-gray-400 text-xs">${toToken.price.toLocaleString()}</p>
                            </div>
                          </div>
                          <p className="text-white text-xl font-bold">{estimatedOutput}</p>
                        </div>
                      </div>
                    </div>

                    {/* Quote */}
                    {showQuote && (
                      <div className="mb-6 bg-white/5 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-inner">
                        <div className="flex items-center gap-2 mb-3">
                          <Info className="w-4 h-4 text-teal-300" />
                          <span className="text-teal-200 font-medium text-sm">Swap Details</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-white/60 text-xs">Rate</p>
                            <p className="text-white font-semibold">
                              1 {fromToken.symbol} = {priceRatio.toFixed(4)} {toToken.symbol}
                            </p>
                          </div>
                          <div>
                            <p className="text-white/60 text-xs">Slippage</p>
                            <p className="text-emerald-300 font-semibold">{slippage}%</p>
                          </div>
                          <div>
                            <p className="text-white/60 text-xs">Network Fee</p>
                            <p className="text-white font-semibold">
                              {estimatedGas ? `~$${estimatedGas.toFixed(2)}` : 'Calculating...'}
                            </p>
                          </div>
                          <div>
                            <p className="text-white/60 text-xs">Route</p>
                            <p className="text-teal-300 font-semibold">Smart, MEV-aware</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Execute */}
                    <button
                      onClick={handleSwap}
                      disabled={!amount || parseFloat(amount) <= 0 || isLoading}
                      className={`relative overflow-hidden w-full rounded-2xl font-semibold text-white py-4 px-8
                      bg-gradient-to-r from-blue-600 to-cyan-500
                      hover:from-blue-500 hover:to-cyan-400
                      disabled:from-slate-700 disabled:to-slate-700
                      transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed`}
                    >
                      {/* Glow sweep */}
                      <span className="pointer-events-none absolute inset-0 opacity-50">
                        <span className="absolute -inset-x-20 -inset-y-12 bg-white/20 blur-2xl animate-[pulse_3s_ease-in-out_infinite]" />
                      </span>

                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {isLoading ? (
                          <>
                            {/* progress line */}
                            <span className="relative w-5 h-5">
                              <span className="absolute inset-0 rounded-full border-2 border-white/30" />
                              <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-white animate-spin" />
                            </span>
                            Processing Swap...
                          </>
                        ) : (
                          <>
                            <Zap className="w-5 h-5" />
                            Execute Swap
                          </>
                        )}
                      </span>
                    </button>

                    {/* Animated loader bar (only while swapping) */}
                    {isLoading && (
                      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-fuchsia-400 to-teal-300 animate-[slide_1.2s_linear_infinite]" />
                      </div>
                    )}

                    {/* Pair Insights */}
                    <div className="mt-8 pt-6 border-t border-white/10">
                      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-teal-300" />
                        Pair Insights
                      </h3>
                      <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4 text-sm">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
                          <p className="text-white/60 text-xs mb-1">Liquidity Tier</p>
                          <p className="text-white font-semibold">{liquidityTier}</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
                          <p className="text-white/60 text-xs mb-1">Price Impact (est.)</p>
                          <p className={`font-semibold ${priceImpact < 0.5 ? 'text-emerald-300' : 'text-amber-300'}`}>
                            {priceImpact.toFixed(2)}%
                          </p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
                          <p className="text-white/60 text-xs mb-1">Volatility (24h)</p>
                          <p className={`${volatility < 6 ? 'text-emerald-300' : 'text-rose-300'} font-semibold`}>
                            {volatility.toFixed(1)}%
                          </p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
                          <p className="text-white/60 text-xs mb-1">Trade Size (USD)</p>
                          <p className="text-white font-semibold">${tradeSizeUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                        </div>
                      </div>

                      {/* Perks */}
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">Best Rates</p>
                            <p className="text-gray-400 text-xs">AI smart routing across DEXs</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <Clock className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">Fast Finality</p>
                            <p className="text-gray-400 text-xs">Sub-second confirmations*</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center">
                            <Lock className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">Secure</p>
                            <p className="text-gray-400 text-xs">MEV-aware + slippage guard</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">Non-custodial</p>
                            <p className="text-gray-400 text-xs">You control your keys</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>{/* /Main */}
            </div>
          </div>
        </div>
      </div>

      {/* Local keyframes for the loader sweep */}
      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </>
  );
}
