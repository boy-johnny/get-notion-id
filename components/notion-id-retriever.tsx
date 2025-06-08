"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Check, CheckCircle, XCircle } from "lucide-react";
import Header from "./header";
import Illustration from "./illustration";
import Footer from "./footer";

export default function NotionIdRetriever() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Dynamic field count based on screen size
  const getFieldCount = () => {
    if (isMobile) return 1;
    if (isTablet) return 3;
    return 5;
  };

  const fieldCount = getFieldCount();
  const [urls, setUrls] = useState<string[]>(Array(fieldCount).fill(""));
  const [ids, setIds] = useState<string[]>(Array(fieldCount).fill(""));
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [validationStates, setValidationStates] = useState<
    ("valid" | "invalid" | "empty")[]
  >(Array(fieldCount).fill("empty"));

  // Handle responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset arrays when field count changes
  useEffect(() => {
    const newFieldCount = getFieldCount();
    setUrls((prev) => {
      const newUrls = Array(newFieldCount).fill("");
      return newUrls.map((_, i) => prev[i] || "");
    });
    setIds((prev) => {
      const newIds = Array(newFieldCount).fill("");
      return newIds.map((_, i) => prev[i] || "");
    });
    setValidationStates((prev) => {
      const newStates = Array(newFieldCount).fill("empty");
      return newStates.map((_, i) => prev[i] || "empty");
    });
  }, [isMobile, isTablet]);

  // Validate Notion URL
  const validateNotionUrl = (url: string): "valid" | "invalid" | "empty" => {
    if (!url.trim()) return "empty";

    try {
      new URL(url);
    } catch {
      return "invalid";
    }

    const notionPatterns = [
      /^https:\/\/www\.notion\.so\/[^/]+\/[^/]+-[a-f0-9]{32}/i,
      /^https:\/\/www\.notion\.so\/[a-f0-9]{32}/i,
      /^https:\/\/www\.notion\.so\/[^/]+\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i,
      /^https:\/\/www\.notion\.so\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i,
      /^https:\/\/notion\.so\/[^/]+\/[^/]+-[a-f0-9]{32}/i,
      /^https:\/\/notion\.so\/[a-f0-9]{32}/i,
      /^https:\/\/notion\.so\/[^/]+\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i,
      /^https:\/\/notion\.so\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i,
    ];

    return notionPatterns.some((pattern) => pattern.test(url))
      ? "valid"
      : "invalid";
  };

  // Extract Notion ID
  const extractNotionId = (url: string): string => {
    if (!url) return "";

    const cleanUrl = url.split("?")[0].split("#")[0];

    const patterns = [
      /notion\.so\/[^/]+\/[^/]+-([a-f0-9]{32})/i,
      /notion\.so\/([a-f0-9]{32})/i,
      /notion\.so\/[^/]+\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i,
      /notion\.so\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i,
    ];

    for (const pattern of patterns) {
      const match = cleanUrl.match(pattern);
      if (match) {
        return match[1].replace(/-/g, "");
      }
    }

    return "";
  };

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);

    // Validate URL and show alert for invalid URLs
    const validationState = validateNotionUrl(value);
    const newValidationStates = [...validationStates];
    newValidationStates[index] = validationState;
    setValidationStates(newValidationStates);

    // Show browser alert for invalid URLs
    if (value.trim() && validationState === "invalid") {
      alert(
        "Invalid Notion URL! Please enter a valid Notion database URL that starts with https://www.notion.so/ or https://notion.so/ and contains a valid database ID."
      );
    }

    // Auto-extract ID when URL is valid
    const extractedId =
      validationState === "valid" ? extractNotionId(value) : "";
    const newIds = [...ids];
    newIds[index] = extractedId;
    setIds(newIds);
  };

  const handleContinue = () => {
    const newIds = urls.map((url) => extractNotionId(url));
    setIds(newIds);
  };

  const copyToClipboard = async (text: string, index: number) => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 md:py-12">
        <div
          className={` ${
            isMobile || isTablet ? "space-y-8" : "grid md:grid-cols-2 gap-8"
          }`}
        >
          {/* Step 1 */}
          <Card className="bg-gray-100">
            <CardContent className="p-4 md:p-8">
              <div className="text-center mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  Step1
                </h2>
                <p className="text-base md:text-base text-gray-600">
                  Enter URL of your database in Notion
                </p>
              </div>

              <div className="space-y-3 md:space-y-4">
                {urls.map((url, index) => (
                  <div
                    key={index}
                    className={`${
                      isMobile ? "space-y-2" : "flex items-center gap-3"
                    }`}
                  >
                    <label
                      className={`text-sm font-medium text-gray-700 ${
                        isMobile ? "block" : "w-20 shrink-0"
                      }`}
                    >
                      Notion URL
                    </label>
                    <div className="flex-1 relative">
                      <Input
                        type="url"
                        placeholder="https://www.notion.so/..."
                        value={url}
                        onChange={(e) => handleUrlChange(index, e.target.value)}
                        className={`bg-white pr-10 text-sm md:text-base ${
                          validationStates[index] === "valid"
                            ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                            : validationStates[index] === "invalid"
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {validationStates[index] !== "empty" && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {validationStates[index] === "valid" ? (
                            <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-6 md:mt-8">
                <Button
                  onClick={handleContinue}
                  className="bg-gray-800 hover:bg-gray-900 text-white px-6 md:px-8 text-sm md:text-base"
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* Step 2 */}
          <Card>
            <CardContent className="p-4 md:p-8">
              <div className="text-center mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  Step2
                </h2>
                <p className="text-base md:text-base text-gray-600">
                  Get your notion database id
                </p>
              </div>

              <div className="space-y-3 md:space-y-4">
                {ids.map((id, index) => (
                  <div
                    key={index}
                    className={`${
                      isMobile ? "space-y-2" : "flex items-center gap-3"
                    }`}
                  >
                    <label
                      className={`text-sm font-medium text-gray-700 ${
                        isMobile ? "block" : "w-20 shrink-0"
                      }`}
                    >
                      Notion ID {index + 1}
                    </label>
                    <div className="flex-1 relative">
                      <Input
                        type="text"
                        value={id}
                        readOnly
                        placeholder="Database ID will appear here..."
                        className="pr-10 text-sm md:text-base"
                      />
                      {id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 md:h-8 md:w-8 p-0"
                          onClick={() => copyToClipboard(id, index)}
                        >
                          {copiedIndex === index ? (
                            <Check className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3 md:h-4 md:w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-6 md:mt-8">
                <Button
                  className="bg-green-700 hover:bg-green-800 text-white px-6 md:px-8 text-sm md:text-base cursor-default"
                  disabled={!ids.some((id) => id)}
                >
                  That's done!
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Illustration */}
        {isMobile || <Illustration />}
        <Footer />
      </main>
    </div>
  );
}
