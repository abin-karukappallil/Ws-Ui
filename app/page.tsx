"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"

export default function DarkWebScraper() {
  const [url, setUrl] = useState("")
  const [method, setMethod] = useState("id")
  const [selector, setSelector] = useState("")
  const [results, setResults] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const scrapeFeatures = [
    { name: "Scrape with ID", method: "id", requiresSelector: true },
    { name: "Scrape with Class", method: "class", requiresSelector: true },
    { name: "Scrape Element", method: "element", requiresSelector: true },
    { name: "Scrape Hidden Links", method: "hidden-links", requiresSelector: false },
    { name: "Scrape Confidential Documents", method: "confidential-docs", requiresSelector: false },
  ]

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (method === "confidential-docs") {
        const api = `http://localhost:8000/confi-doc?url=${url}`;
        const response = await fetch(api);
        if (!response.ok) {
          throw new Error("Failed to fetch the file");
        }
        const blob = await response.blob(); 
        const fileURL = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = "docsLink.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(fileURL);
      }


    } catch (error) {
      console.error("Error during scrape:", error);
      setResults("An error occurred during the scraping process.");
    } finally {
      setIsLoading(false);
    }
  };


  const currentFeature = scrapeFeatures.find((feature) => feature.method === method)

  useEffect(() => {
    if (!currentFeature?.requiresSelector) {
      setSelector("")
    }
  }, [method, currentFeature])

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="fixed inset-0 h-screen w-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-800 text-gray-100">
          <CardHeader className="bg-gradient-to-r from-blue-700 to-purple-800 rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Web Scraper</CardTitle>
            <CardDescription className="text-gray-300">
              Enter a URL and select a scraping method to begin.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-4">
            <form onSubmit={handleScrape} className="space-y-4">
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
                  className="border-2 border-purple-700 focus:border-purple-500 rounded-md bg-gray-700 text-gray-100 placeholder-gray-400"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger className="border-2 border-purple-700 focus:border-purple-500 rounded-md bg-gray-700 text-gray-100">
                    <SelectValue placeholder="Select scraping method" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-gray-100 border-purple-700">
                    {scrapeFeatures.map((feature) => (
                      <SelectItem key={feature.method} value={feature.method} className="focus:bg-purple-600">
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
                      className="border-2 border-purple-700 focus:border-purple-500 rounded-md bg-gray-700 text-gray-100 placeholder-gray-400"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-blue-700 hover:from-green-700 hover:to-blue-800 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Scrape"}
                </Button>

              </motion.div>
            </form>

            <AnimatePresence>
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                  className="mt-4"
                >
                    <pre className="bg-gray-700 p-2 rounded mt-2 overflow-x-auto text-sm text-gray-200">
                    Scrapping..this may take a while..☕
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
                    <pre className="bg-gray-700 p-2 rounded mt-2 overflow-x-auto text-sm text-gray-200">
                      Sucessfully scraped the website
                    </pre>
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

