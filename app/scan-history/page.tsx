"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AppHeader from "@/components/app-header";
import { useRouter } from "next/navigation";

interface AllergenRisk {
  name: string;
  likelihood: "high" | "medium" | "low";
  confidence: number;
  userAllergen: boolean;
}

interface ScanResult {
  id: number;
  foodName: string;
  description: string;
  identifiedAllergens: Array<{ name: string; confidence: number }>;
  userAllergenRisks: AllergenRisk[];
  isSafe: boolean;
  safetyExplanation: string;
  additionalWarnings?: string;
  image: string;
  scanDate: string;
  scanTime: string;
  isFallback?: boolean;
}

export default function ScanHistoryPage() {
  const router = useRouter();
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load scan history from localStorage
    const loadHistory = () => {
      setIsLoading(true);
      try {
        const historyJson = localStorage.getItem("scan-history");
        if (historyJson) {
          const history = JSON.parse(historyJson);
          setScanResults(history);
        }
      } catch (error) {
        console.error("Error loading scan history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  const getLikelihoodColor = (likelihood: string) => {
    switch (likelihood) {
      case "high":
        return "bg-error text-error border-error";
      case "medium":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "low":
        return "bg-success text-success border-success";
      default:
        return "bg-secondary text-secondary-foreground border-secondary";
    }
  };

  const getSafetyBadge = (isSafe: boolean) => {
    return isSafe ? (
      <Badge className="bg-success text-success border-success">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-1"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
        Safe for you
      </Badge>
    ) : (
      <Badge className="bg-error text-error border-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-1"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <path d="M12 7v5"></path>
          <path d="M12 16h.01"></path>
        </svg>
        Contains allergens
      </Badge>
    );
  };

  const deleteScanResult = (id: number) => {
    const updatedResults = scanResults.filter((result) => result.id !== id);
    setScanResults(updatedResults);
    localStorage.setItem("scan-history", JSON.stringify(updatedResults));
  };

  const clearAllResults = () => {
    setScanResults([]);
    localStorage.removeItem("scan-history");
  };

  const newScan = () => {
    router.push("/scan");
  };

  return (
    <>
      <AppHeader
        title="Scan History"
        action={
          <Button
            size="sm"
            variant="outline"
            onClick={clearAllResults}
            disabled={scanResults.length === 0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              <line x1="10" x2="10" y1="11" y2="17"></line>
              <line x1="14" x2="14" y1="11" y2="17"></line>
            </svg>
            Clear All
          </Button>
        }
      />

      <div className="px-4 py-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : scanResults.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="rounded-full bg-secondary p-4 w-16 h-16 mx-auto flex items-center justify-center">
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
                className="text-accent-400"
              >
                <path d="M3 3v5h5"></path>
                <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"></path>
                <path d="M12 7v5l4 2"></path>
              </svg>
            </div>
            <h3 className="font-medium text-lg">No scan history</h3>
            <p className="text-muted-foreground">
              Scan some food to see your history here
            </p>
            <Button
              onClick={newScan}
              className="mt-2 bg-gradient-primary hover:bg-primary/80"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
              Scan Food Now
            </Button>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <Card className="border-accent">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {scanResults.length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Scans
                  </div>
                </CardContent>
              </Card>
              <Card className="border-accent">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-success-700">
                    {scanResults.filter((r) => r.isSafe).length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Safe Foods
                  </div>
                </CardContent>
              </Card>
              <Card className="border-accent">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-error-700">
                    {scanResults.filter((r) => !r.isSafe).length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    With Warnings
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Scan Results */}
            <div className="space-y-4">
              {scanResults.map((result) => (
                <Card key={result.id} className="overflow-hidden border-accent">
                  <div className="aspect-video relative">
                    <img
                      src={result.image || "/placeholder.svg"}
                      alt={result.foodName}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 right-2">
                      {getSafetyBadge(result.isSafe)}
                    </div>
                    {result.isFallback && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"></path>
                          </svg>
                          Manual Check
                        </Badge>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute bottom-2 left-2 h-8 w-8 rounded-full bg-background/80 hover:bg-background/90"
                      onClick={() => deleteScanResult(result.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                    </Button>
                  </div>

                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">
                          {result.foodName}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {result.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Scanned {result.scanTime}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 pt-0">
                    <div className="space-y-3">
                      {result.userAllergenRisks.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            Allergen Assessment
                          </h4>
                          <div className="space-y-2">
                            {result.userAllergenRisks
                              .slice(0, 3)
                              .map((risk, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm">{risk.name}</span>
                                    {risk.userAllergen && (
                                      <Badge
                                        variant="destructive"
                                        className="text-xs bg-error text-error"
                                      >
                                        Your allergen
                                      </Badge>
                                    )}
                                  </div>
                                  <Badge
                                    className={getLikelihoodColor(
                                      risk.likelihood
                                    )}
                                    variant="outline"
                                  >
                                    {result.isFallback
                                      ? "Check manually"
                                      : `${risk.confidence}%`}
                                  </Badge>
                                </div>
                              ))}
                            {result.userAllergenRisks.length > 3 && (
                              <p className="text-xs text-muted-foreground">
                                +{result.userAllergenRisks.length - 3} more
                                allergens
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={newScan}
                      className="border-accent bg-accent hover:bg-accent/80"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1"
                      >
                        <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"></path>
                        <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"></path>
                        <path d="m14 16-3 3 3 3"></path>
                        <path d="M8.293 13.596 7.196 9.5 3.1 10.598"></path>
                        <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843"></path>
                        <path d="m13.378 9.633 4.096 1.098 1.097-4.096"></path>
                      </svg>
                      New Scan
                    </Button>
                    <Button
                      size="sm"
                      variant={result.isSafe ? "default" : "destructive"}
                      className={
                        result.isSafe
                          ? "bg-gradient-primary hover:bg-primary/80"
                          : "bg-gradient-error hover:bg-error/80"
                      }
                    >
                      {result.isSafe ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                            <polyline points="16 6 12 2 8 6"></polyline>
                            <line x1="12" x2="12" y1="2" y2="15"></line>
                          </svg>
                          Share Result
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"></path>
                          </svg>
                          View Details
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
