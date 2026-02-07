import { useGenerateApiKey } from "@/hooks/use-api-keys";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Key, Copy, Check, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ApiKeyGenerator({ onKeyGenerated }: { onKeyGenerated: (key: string) => void }) {
  const { mutate: generateKey, isPending, data } = useGenerateApiKey();
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    generateKey(undefined, {
      onSuccess: (response) => {
        onKeyGenerated(response.key);
      }
    });
  };

  const copyToClipboard = () => {
    if (data?.key) {
      navigator.clipboard.writeText(data.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="glass-card p-6 md:p-8 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
            <Key className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Get Instant Access</h2>
        </div>
        
        <p className="text-muted-foreground mb-6">
          Generate a free, unlimited API key to access the complete Indonesian BTS database immediately. No registration required.
        </p>

        <AnimatePresence mode="wait">
          {!data ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Button 
                onClick={handleGenerate} 
                disabled={isPending}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 border-0 shadow-lg shadow-blue-500/25"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Secure Key...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate API Key
                  </>
                )}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/40 border border-green-500/30 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-green-400 font-medium tracking-wider">GENERATION SUCCESSFUL</span>
                <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
              </div>
              
              <div className="flex items-center gap-2">
                <code className="flex-1 font-mono text-lg text-white break-all bg-white/5 p-2 rounded border border-white/10">
                  {data.key}
                </code>
                <Button
                  size="icon"
                  variant="outline"
                  className="shrink-0 bg-transparent border-white/10 hover:bg-white/10 hover:text-white"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                This key is now active. Use it in the header <code>X-API-Key</code>.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
