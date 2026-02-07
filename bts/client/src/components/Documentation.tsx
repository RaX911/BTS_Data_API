import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Card } from "@/components/ui/card";
import { BookOpen, Terminal } from "lucide-react";

export function Documentation() {
  const curlExample = `curl -X GET "https://opencellid-id.api/api/v1/towers?mcc=510&mnc=10" \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json"`;

  const jsExample = `const response = await fetch('https://opencellid-id.api/api/v1/towers?mcc=510&mnc=10', {
  headers: {
    'X-API-Key': 'YOUR_API_KEY'
  }
});

const data = await response.json();
console.log(data);`;

  const pyExample = `import requests

url = "https://opencellid-id.api/api/v1/towers"
params = {"mcc": 510, "mnc": 10}
headers = {"X-API-Key": "YOUR_API_KEY"}

response = requests.get(url, headers=headers, params=params)
print(response.json())`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Integration Guide</h2>
          <p className="text-muted-foreground">Start fetching data in seconds with standard HTTP requests.</p>
        </div>
      </div>

      <Card className="glass-card overflow-hidden">
        <Tabs defaultValue="curl" className="w-full">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <Terminal className="w-4 h-4" />
              Request Examples
            </div>
            <TabsList className="bg-black/40 border border-white/10">
              <TabsTrigger value="curl">cURL</TabsTrigger>
              <TabsTrigger value="js">Node.js</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6 bg-black/40">
            <TabsContent value="curl" className="mt-0">
              <CodeBlock code={curlExample} language="bash" />
            </TabsContent>
            <TabsContent value="js" className="mt-0">
              <CodeBlock code={jsExample} language="javascript" />
            </TabsContent>
            <TabsContent value="python" className="mt-0">
              <CodeBlock code={pyExample} language="python" />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Request Parameters</h3>
          <ul className="space-y-3">
            <li className="flex justify-between border-b border-white/5 pb-2">
              <code className="text-blue-400">mcc</code>
              <span className="text-muted-foreground text-sm">Mobile Country Code (510 = ID)</span>
            </li>
            <li className="flex justify-between border-b border-white/5 pb-2">
              <code className="text-blue-400">mnc</code>
              <span className="text-muted-foreground text-sm">Mobile Network Code</span>
            </li>
            <li className="flex justify-between border-b border-white/5 pb-2">
              <code className="text-blue-400">lac</code>
              <span className="text-muted-foreground text-sm">Location Area Code</span>
            </li>
            <li className="flex justify-between border-b border-white/5 pb-2">
              <code className="text-blue-400">cellId</code>
              <span className="text-muted-foreground text-sm">Unique Cell ID</span>
            </li>
          </ul>
        </div>
        
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Response Object</h3>
          <div className="text-sm text-muted-foreground">
            <p className="mb-4">Returns an array of cell tower objects containing detailed location and technical specifications.</p>
            <div className="flex gap-2">
              <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs">JSON</span>
              <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-400 text-xs">UTF-8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
