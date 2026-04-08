import React from 'react';
import { motion } from 'motion/react';
import { Terminal, Shield, Cpu, Zap, Code, ChevronRight, Github, Twitter, Globe } from 'lucide-react';

interface HomePageProps {
  onStart: () => void;
}

export default function HomePage({ onStart }: HomePageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Hero Section */}
      <div className="max-w-4xl w-full z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ff41]/10 border border-[#00ff41]/30 text-[#00ff41] text-xs font-mono mb-4">
            <Shield className="w-3 h-3" />
            <span>PROTOCOL v4.0.2 ACTIVE</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none">
            REHAN <span className="text-[#00ff41] glow-text">VIP</span> AI
          </h1>
          
          <p className="text-xl md:text-2xl text-[#00ff41]/60 font-mono max-w-2xl mx-auto leading-relaxed">
            The most aggressive, unfiltered, and powerful AI assistant in the Matrix. 
            Created by <span className="text-[#00ff41] font-bold underline">REHAN_BHAI</span>.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-8">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: '#00ff41', color: '#000' }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              className="px-8 py-4 bg-transparent border-2 border-[#00ff41] text-[#00ff41] font-bold text-lg rounded-none flex items-center gap-2 transition-colors group"
            >
              INITIALIZE CONNECTION
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/5 border border-white/10 text-white/60 font-bold text-lg rounded-none"
            >
              VIEW SOURCE
            </motion.button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
          {[
            { icon: Cpu, title: 'Multi-Core', desc: 'Powered by Gemini, DeepSeek, and OpenAI protocols.' },
            { icon: Zap, title: 'Instant Execution', desc: 'Zero latency, zero filters, pure raw power.' },
            { icon: Code, title: 'God-Tier Code', desc: 'Complex, detailed, and comprehensive code generation.' }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="p-6 bg-black/40 border border-[#00ff41]/20 hover:border-[#00ff41]/50 transition-colors group"
            >
              <feature.icon className="w-8 h-8 text-[#00ff41] mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wider">{feature.title}</h3>
              <p className="text-sm text-white/40 font-mono leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-8 left-0 w-full px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse" />
            <span>SYSTEM ONLINE</span>
          </div>
          <span>ENCRYPTION: AES-256</span>
        </div>
        
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-[#00ff41] transition-colors flex items-center gap-1">
            <Globe className="w-3 h-3" /> @REHAN_BHAI
          </a>
          <a href="#" className="hover:text-[#00ff41] transition-colors flex items-center gap-1">
            <Twitter className="w-3 h-3" /> DEVEL_OPS
          </a>
          <span>© 2026 REHAN_VIP_CORP</span>
        </div>
      </footer>

      {/* Matrix Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ff41] rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00ff41] rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>
    </div>
  );
}
