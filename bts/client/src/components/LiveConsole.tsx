import { useState } from "react";
import { useTowers } from "@/hooks/use-towers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Search, Radio, AlertCircle, MapPin, Database } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";

interface LiveConsoleProps {
  apiKey: string | null;
}

export function LiveConsole({ apiKey }: LiveConsoleProps) {
  // Default search params
  const [params, setParams] = useState({
    mcc: "510", // Indonesia
    mnc: "",
    lac: "",
    cellId: "",
  });
  
  // Trigger state for query
  const [activeSearch, setActiveSearch] = useState<typeof params | null>(null);

  const { data, isLoading, error, isError } = useTowers(
    { 
      mcc: activeSearch?.mcc ? Number(activeSearch.mcc) : undefined,
      mnc: activeSearch?.mnc ? Number(activeSearch.mnc) : undefined,
      lac: activeSearch?.lac ? Number(activeSearch.lac) : undefined,
      cellId: activeSearch?.cellId ? Number(activeSearch.cellId) : undefined,
    },
    apiKey
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(params);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      {/* Input Panel */}
      <Card className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Live API Console</h3>
            <p className="text-sm text-muted-foreground">Test the API directly in your browser</p>
          </div>
        </div>

        {!apiKey && (
          <Alert className="mb-6 border-yellow-500/20 bg-yellow-500/10 text-yellow-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please generate an API key above to use the console.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-mono text-muted-foreground uppercase">MCC (Country)</Label>
              <Input 
                value={params.mcc} 
                onChange={(e) => setParams(p => ({ ...p, mcc: e.target.value }))}
                placeholder="510" 
                className="bg-black/20 border-white/10 text-white font-mono focus:ring-purple-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-mono text-muted-foreground uppercase">MNC (Network)</Label>
              <Input 
                value={params.mnc} 
                onChange={(e) => setParams(p => ({ ...p, mnc: e.target.value }))}
                placeholder="e.g. 10" 
                className="bg-black/20 border-white/10 text-white font-mono focus:ring-purple-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-mono text-muted-foreground uppercase">LAC (Area)</Label>
              <Input 
                value={params.lac} 
                onChange={(e) => setParams(p => ({ ...p, lac: e.target.value }))}
                placeholder="e.g. 1234" 
                className="bg-black/20 border-white/10 text-white font-mono focus:ring-purple-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-mono text-muted-foreground uppercase">Cell ID</Label>
              <Input 
                value={params.cellId} 
                onChange={(e) => setParams(p => ({ ...p, cellId: e.target.value }))}
                placeholder="e.g. 4567" 
                className="bg-black/20 border-white/10 text-white font-mono focus:ring-purple-500/50"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={!apiKey || isLoading}
            className="w-full bg-white text-black hover:bg-gray-200 font-semibold"
          >
            {isLoading ? "Searching Database..." : "Search Towers"}
            {!isLoading && <Search className="w-4 h-4 ml-2" />}
          </Button>
        </form>
      </Card>

      {/* Output Panel */}
      <Card className="glass-card h-[500px] flex flex-col overflow-hidden relative border-white/10 bg-black/40">
        <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <span className="text-xs font-mono text-muted-foreground">JSON RESPONSE</span>
          {data && <span className="text-xs text-green-400 font-mono">{data.length} RESULTS FOUND</span>}
        </div>
        
        <div className="flex-1 overflow-auto p-4 font-mono text-sm">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
              <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              <p>Querying Network...</p>
            </div>
          ) : isError ? (
            <div className="h-full flex flex-col items-center justify-center text-red-400 space-y-2">
              <AlertCircle className="w-8 h-8" />
              <p>{error instanceof Error ? error.message : "Request Failed"}</p>
            </div>
          ) : data ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {data.length === 0 ? (
                <div className="text-center text-muted-foreground mt-20">
                  <Database className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No towers found matching criteria.</p>
                </div>
              ) : (
                data.map((tower, idx) => (
                  <div key={idx} className="group relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-white/10 group-hover:bg-purple-500 transition-colors" />
                    <pre className="text-blue-200 whitespace-pre-wrap">
                      {JSON.stringify(tower, null, 2)}
                    </pre>
                  </div>
                ))
              )}
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
              <MapPin className="w-12 h-12 mb-4" />
              <p>Waiting for request...</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
