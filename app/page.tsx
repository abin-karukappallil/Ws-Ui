"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from 'lucide-react'

export default function DarkWebScraper() {
  const [url, setUrl] = useState("")
  const [method, setMethod] = useState("id")
  const [selector, setSelector] = useState("")
  const [results, setResults] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const scrapeFeatures = [
    { name: "Scrape with ID", method: "id", requiresSelector: true },
    { name: "Scrape with Class", method: "class", requiresSelector: true },
    { name: "Scrape Element", method: "element", requiresSelector: true },
    { name: "Scrape Hidden Links", method: "hidden-links", requiresSelector: false },
    { name: "Scrape Confidential Documents", method: "confidential-docs", requiresSelector: false },
  ]
  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setResults("")

    try {
      let response;
      
      if (method === "confidential-docs") {
        response = await fetch(`https://wsapi.abinthomas.dev/confi-doc?url=${encodeURIComponent(url)}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
      } else if (method === "hidden-links") {
        response = await fetch(`https://wsapi.abinthomas.dev/scrape-hiddenlinks?url=${encodeURIComponent(url)}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
      } else if (method === "id") {
        response = await fetch(`https://wsapi.abinthomas.dev/scrape-id?url=${encodeURIComponent(url)}&_id=${encodeURIComponent(selector)}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
      } else if (method === "class") {
        response = await fetch(`https://wsapi.abinthomas.dev/scrape-class?url=${encodeURIComponent(url)}&_class=${encodeURIComponent(selector)}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
      } else {
        response = await fetch(`https://wsapi.abinthomas.dev/scrape-element?url=${encodeURIComponent(url)}&element=${encodeURIComponent(selector)}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
      }

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      
      if (contentType?.includes("application/json")) {
        const data = await response.json();
        setResults(data);
      } else {
        const blob = await response.blob();
        const fileURL = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = method === "hidden-links" ? "hiddenlinks.txt" : "docsLink.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(fileURL);
        setResults("Download completed successfully");
      }
    } catch (error) {
      console.error("Error during scrape:", error);
      setError(error instanceof Error ? error.message : "An error occurred during the scraping process.");
    } finally {
      setIsLoading(false);
    }
  }

  const currentFeature = scrapeFeatures.find((feature) => feature.method === method)

  useEffect(() => {
    if (!currentFeature?.requiresSelector) {
      setSelector("")
    }
  }, [currentFeature?.requiresSelector])

  return (
    <div className="min-h-screen w-full bg-zinc-900 flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-zinc-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_50%)]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md md:max-w-2xl lg:max-w-3xl relative z-10"
      >
        <Card className="relative overflow-hidden bg-zinc-800/40 backdrop-blur-xl border-zinc-700/50">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-transparent"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          
          <CardHeader className="relative z-10">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-100">
              Advanced Web Scraper
              </CardTitle>
              <CardDescription className="text-zinc-400 mt-2">
                Scrape classes, links, and documents with ease.
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="relative z-10 space-y-6">
            <form onSubmit={handleScrape} className="space-y-4">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Input
                  type="url"
                  placeholder="Enter website URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="bg-zinc-700/30 backdrop-blur-sm border-zinc-600/50 text-zinc-200 placeholder:text-zinc-400"
                />
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger className="bg-zinc-700/30 backdrop-blur-sm border-zinc-600/50 text-zinc-200">
                    <SelectValue placeholder="Select scraping method" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800/90 backdrop-blur-md border-zinc-700/50">
                    {scrapeFeatures.map((feature) => (
                      <SelectItem
                        key={feature.method}
                        value={feature.method}
                        className="text-zinc-200 focus:bg-zinc-700/50 focus:text-zinc-200"
                      >
                        {feature.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>

              <AnimatePresence>
                {currentFeature?.requiresSelector && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Input
                      type="text"
                      placeholder="Enter selector (ID, class, or element)"
                      value={selector}
                      onChange={(e) => setSelector(e.target.value)}
                      className="bg-zinc-700/30 backdrop-blur-sm border-zinc-600/50 text-zinc-200 placeholder:text-zinc-400"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-white hover:bg-slate-100 text-black"
                  disabled={isLoading || !url}
                >
                  {isLoading ? (
                    <motion.div
                      className="flex items-center justify-center"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scraping...
                    </motion.div>
                  ) : (
                    "Scrape"
                  )}
                </Button>
              </motion.div>
            </form>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-red-900/20 backdrop-blur-sm border border-red-800/50 text-red-400 p-4 rounded-md"
                >
                  {error}
                </motion.div>
              )}

              {results && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                     className="bg-zinc-700/20 backdrop-blur-sm border border-zinc-600/50 rounded-md p-4 max-h-60 md:max-h-96 overflow-auto"
                  >
                    <div  className="text-zinc-200 text-sm">
                      {Array.isArray(results) ? (
                        results.map((item, index) => (
                          <div key={index} className="mb-2 pb-2 border-b border-gray-600 last:border-b-0">
                            {item.data}
                          </div>
                        ))
                      ) : (
                        <pre>{typeof results === "object" ? JSON.stringify(results, null, 2) : results}</pre>
                      )}
                    </div>
                  </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}