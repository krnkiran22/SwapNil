"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Zap,
  TrendingUp,
  Shield,
  Coins,
  Activity,
  Globe,
  Brain,
  BarChart3,
  Cpu,
  Server,
  Sparkles,
  CheckCircle2,
  Settings,
  MessageCircle,
  Bot,
  User,
  Target,
  Layers,
  Network,
} from "lucide-react";

import Navbar from "../components/Navbar";

const aiCapabilities = [
  {
    icon: Brain,
    name: "Smart Analysis",
    desc: "Real-time market insights",
    color: "text-cyan-300",
  },
  {
    icon: Target,
    name: "Intent Recognition",
    desc: "Understands complex goals",
    color: "text-fuchsia-300",
  },
  {
    icon: Network,
    name: "Cross-Chain",
    desc: "Multi-blockchain routing",
    color: "text-emerald-300",
  },
  {
    icon: Layers,
    name: "Strategy Builder",
    desc: "Custom DeFi strategies",
    color: "text-amber-300",
  },
];

const marketMetrics = [
  { label: "Total Volume (24h)", value: "$847.2M", change: "+12.4%" },
  { label: "Active Protocols", value: "156", change: "+8" },
  { label: "Success Rate", value: "99.7%", change: "+0.2%" },
  { label: "Avg Response Time", value: "0.8s", change: "-15%" },
];

export default function IntentPage() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Welcome to SwapAI! I'm your intelligent DeFi assistant. I can help you with token swaps, liquidity analysis, yield farming opportunities, and market insights. What would you like to explore today?",
      timestamp: new Date().toLocaleTimeString(),
      suggestions: [
        "Find best STX to USDC route",
        "Analyze yield opportunities",
        "Check gas optimization",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const quickActions = [
    {
      icon: Coins,
      text: "Best Swap Routes",
      color: "from-cyan-500 to-blue-600",
      desc: "Find optimal trading paths",
    },
    {
      icon: TrendingUp,
      text: "Market Analysis",
      color: "from-green-500 to-emerald-600",
      desc: "Real-time price insights",
    },
    {
      icon: Shield,
      text: "Security Check",
      color: "from-orange-500 to-red-600",
      desc: "Risk assessment tools",
    },
    {
      icon: Activity,
      text: "Yield Opportunities",
      color: "from-cyan-500 to-blue-600",
      desc: "Maximize your returns",
    },
  ];

  // Replace with your actual Groq API key or move to backend
  const GROQ_API_KEY = "key";

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString(),
      suggestions: [],
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            ...messages.map((m) => ({
              role: m.sender === "user" ? "user" : "assistant",
              content: m.text,
            })),
            { role: "user", content: input },
          ],
          max_tokens: 1000, // Optional: Adjust based on desired response length
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const aiText =
        data.choices?.[0]?.message?.content ||
        "Sorry, I could not get a response.";
      
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: aiText,
          timestamp: new Date().toLocaleTimeString(),
          suggestions: [], // Add suggestions if needed
        },
      ]);
    } catch (error: any) {
      console.error("Error connecting to Groq API:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `Error: ${error.message || "Failed to connect to AI. Please try again."}`,
          timestamp: new Date().toLocaleTimeString(),
          suggestions: [],
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (actionText: string) => {
    setInput(actionText);
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen relative overflow-hidden pt-20"
        style={{
          background:
            "radial-gradient(1200px 800px at 10% -10%, #0EA5E922, transparent), radial-gradient(900px 700px at 90% 110%, #22C55E22, transparent), linear-gradient(180deg,#0B0F19 0%, #0A0E17 100%)",
        }}
      >
        <div className="relative z-10 px-4 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-2 mb-6 shadow-[0_0_40px_rgba(0,255,209,0.15)]">
                <Brain className="w-4 h-4 text-teal-300" />
                <span className="text-teal-200 text-sm font-medium">
                  AI-Powered DeFi Intelligence
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-teal-100 to-fuchsia-200 bg-clip-text text-transparent mb-3">
                Intelligent Trading Assistant
              </h1>
              <p className="text-lg text-white/70 max-w-3xl mx-auto">
                Experience next-generation DeFi with AI-driven insights, natural
                language trading, and personalized strategies.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left rail: Market Metrics + AI Capabilities */}
              <div className="lg:col-span-1 space-y-6">
                {/* Market Metrics */}
                <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-teal-300" />
                    Live Metrics
                  </h3>
                  <div className="space-y-4">
                    {marketMetrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="text-white font-medium text-sm">
                            {metric.label}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {metric.value}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-xs font-semibold ${
                              metric.change.startsWith("+")
                                ? "text-emerald-400"
                                : "text-amber-400"
                            }`}
                          >
                            {metric.change}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Capabilities */}
                <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-fuchsia-300" />
                    AI Capabilities
                  </h3>
                  <div className="space-y-4">
                    {aiCapabilities.map((capability, idx) => {
                      const IconComponent = capability.icon;
                      return (
                        <div key={idx} className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 bg-gradient-to-br from-white/10 to-white/5 rounded-xl flex items-center justify-center border border-white/20`}
                          >
                            <IconComponent
                              className={`w-4 h-4 ${capability.color}`}
                            />
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">
                              {capability.name}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {capability.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
                    </span>
                    <span className="text-emerald-300 text-xs">
                      AI online • Processing 847 requests/min
                    </span>
                  </div>
                </div>

                {/* System Status */}
                <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-300" />
                    System Status
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-white/80">
                      <Cpu className="w-4 h-4 text-teal-300" /> AI Models:
                      Online
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Server className="w-4 h-4 text-fuchsia-300" /> Latency:
                      0.8s
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Globe className="w-4 h-4 text-cyan-300" /> 156 Protocols
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />{" "}
                      99.7% Uptime
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Chat Interface */}
              <div className="lg:col-span-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_80px_rgba(157,78,221,0.18)] overflow-hidden">
                  <div className="bg-gradient-to-r from-white/5 via-fuchsia-500/10 to-teal-500/10 p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-2xl flex items-center justify-center">
                          <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">
                            AI Trading Assistant
                          </h2>
                          <p className="text-teal-200 text-sm">
                            Natural language DeFi interactions
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                          <span className="text-emerald-300 text-xs">Live</span>
                        </div>
                        <button className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                          <Settings className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    

                    {/* Chat Messages */}
                    <div className="mb-6">
                      <label className="block text-white/80 text-sm font-medium mb-3">
                        Conversation
                      </label>
                      <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl">
                        <div className="h-80 overflow-y-auto p-4 space-y-4">
                          <AnimatePresence>
                            {messages.map((msg, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                                className={`flex ${
                                  msg.sender === "user"
                                    ? "justify-end"
                                    : "justify-start"
                                }`}
                              >
                                <div
                                  className={`max-w-[50%] ${
                                    msg.sender === "user"
                                      ? "bg-gradient-to-r from-blue-600 to-teal-500 text-white"
                                      : "bg-white/10 backdrop-blur-xl border border-white/20 text-white"
                                  } rounded-2xl px-4 py-3 shadow-lg`}
                                >
                                 
                                  <p className="text-md leading-relaxed mb-2 ">
                                    {msg.text}
                                  </p>
                                  {msg.suggestions && (
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {msg.suggestions.map(
                                        (suggestion, sidx) => (
                                          <button
                                            key={sidx}
                                            onClick={() =>
                                              handleSuggestion(suggestion)
                                            }
                                            className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
                                          >
                                            {suggestion}
                                          </button>
                                        )
                                      )}
                                    </div>
                                  )}
                                  <p className="text-xs opacity-60 ">
                                    {msg.timestamp}
                                  </p>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>

                          {isTyping && (
                            <motion.div
                              className="flex justify-start"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <Bot className="w-4 h-4 text-teal-300" />
                                  <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-200"></div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Input */}
                    <div className="flex gap-3">
                      <input
                        className="flex-1 bg-white/10 backdrop-blur-xl border border-white/20 focus:border-teal-500/50 focus:outline-none text-white rounded-2xl px-4 py-3 placeholder-gray-400 transition-all duration-300"
                        placeholder="Ask me about swaps, yields, market analysis, or any DeFi strategy..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!input.trim() || isTyping}
                        className={`relative overflow-hidden rounded-2xl font-semibold text-white px-6 py-3
                        bg-gradient-to-r from-blue-600 to-teal-500
                        hover:from-blue-500 hover:to-teal-400
                        disabled:from-slate-700 disabled:to-slate-700
                        transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed`}
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <Send className="w-4 h-4" />
                          Send
                        </span>
                      </button>
                    </div>

                    {/* AI Features */}
                    <div className="mt-8 pt-6 border-t border-white/10">
                      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-teal-300" />
                        AI Features
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                            <Brain className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">
                              Smart Analysis
                            </p>
                            <p className="text-gray-400 text-xs">
                              Real-time insights
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <Target className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">
                              Intent Recognition
                            </p>
                            <p className="text-gray-400 text-xs">
                              Understands goals
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                            <Network className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">
                              Cross-Chain
                            </p>
                            <p className="text-gray-400 text-xs">
                              Multi-blockchain
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                            <Layers className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">
                              Strategy Builder
                            </p>
                            <p className="text-gray-400 text-xs">
                              Custom strategies
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}