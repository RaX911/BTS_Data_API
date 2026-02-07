import { useState } from "react";
import { ApiKeyGenerator } from "@/components/ApiKeyGenerator";
import { LiveConsole } from "@/components/LiveConsole";
import { Documentation } from "@/components/Documentation";
import { RadioTower, Globe, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#0f1117] text-white overflow-hidden relative selection:bg-blue-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute inset-0 grid-bg opacity-20" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-blue-500 to-purple-500 p-2 rounded-lg">
              <RadioTower className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">OpenCellID <span className="text-blue-400">Indonesia</span></span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#console" className="hover:text-white transition-colors">Console</a>
            <a href="#docs" className="hover:text-white transition-colors">Documentation</a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-all"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-24">
        
        {/* Hero Section */}
        <section className="text-center space-y-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              V1.0 Public Beta Now Live
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              The Complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Indonesian BTS</span> Database API
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Access real-time location data for cellular towers across Indonesia. 
              Search by Cell ID, LAC, MCC, MNC. Instant access, no registration required.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
            {[
              { label: "Provinces", val: "34+", icon: Globe },
              { label: "Districts", val: "514+", icon: Map },
              { label: "Uptime", val: "99.9%", icon: Zap },
              { label: "No Auth", val: "Public", icon: ShieldCheck },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.3 }}
                className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
              >
                <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stat.val}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* API Key Section */}
        <section id="apikey" className="max-w-3xl mx-auto">
          <ApiKeyGenerator onKeyGenerated={setGeneratedKey} />
        </section>

        {/* Live Console Section */}
        <section id="console">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
            <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest">Live Interactive Demo</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </div>
          <LiveConsole apiKey={generatedKey} />
        </section>

        {/* Documentation Section */}
        <section id="docs">
          <Documentation />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/40 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <RadioTower className="w-5 h-5 text-muted-foreground" />
            <span className="font-semibold text-muted-foreground">OpenCellID Indonesia</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Open Data Initiative. Data provided as-is for educational purposes.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Simple map icon component since it was missing from imports
function Map({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" x2="9" y1="3" y2="18" />
      <line x1="15" x2="15" y1="6" y2="21" />
    </svg>
  )
}
