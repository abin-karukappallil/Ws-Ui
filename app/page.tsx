"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"

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
        // Handle element scraping
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
  }, [method, currentFeature])

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="fixed inset-0 h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md md:max-w-2xl lg:max-w-3xl bg-gray-800 text-gray-100 shadow-lg border border-gray-700">
          <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-t-lg border-b border-gray-700">
            <CardTitle className="text-2xl font-bold text-purple-400">Advanced Web Scraper</CardTitle>
            <CardDescription className="text-gray-400">
              Scrape classes, links, and sensitive documents with ease.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-4 p-6 md:p-8">
            <form onSubmit={handleScrape} className="space-y-4 max-w-lg mx-auto">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Input
                    type="url"
                    placeholder="Enter website URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    className="w-full border-2 border-gray-600 focus:border-purple-500 rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 transition-all duration-300"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger className="w-full border-2 border-gray-600 focus:border-purple-500 rounded-md bg-gray-700 text-gray-100 transition-all duration-300">
                      <SelectValue placeholder="Select scraping method" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-gray-100 border-gray-700">
                      {scrapeFeatures.map((feature) => (
                        <SelectItem
                          key={feature.method}
                          value={feature.method}
                          className="focus:bg-purple-700 cursor-pointer"
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
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Input
                        type="text"
                        placeholder="Enter selector (ID, class, or element)"
                        value={selector}
                        onChange={(e) => setSelector(e.target.value)}
                        className="w-full border-2 border-gray-600 focus:border-purple-500 rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 transition-all duration-300"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={isLoading || !url}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scraping...
                    </>
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
                  transition={{ duration: 0.5 }}
                  className="mt-4"
                >
                  <pre className="bg-red-900/50 text-red-200 p-4 rounded-md mt-2 overflow-x-auto text-sm border border-red-800">
                    {error}
                  </pre>
                </motion.div>
              )}

              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                  className="mt-4"
                >
                  <pre className="bg-gray-700 p-4 rounded-md mt-2 overflow-x-auto text-sm text-gray-200 border border-gray-600">
                    Scraping... this may take a while... ☕
                  </pre>
                </motion.div>
              ) : (
                results && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                    className="mt-4"
                  >
                    <div className="bg-gray-700 p-4 rounded-md mt-2 overflow-x-auto max-h-60 md:max-h-96 text-sm md:text-base text-gray-200 border border-gray-600">
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
                )
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
