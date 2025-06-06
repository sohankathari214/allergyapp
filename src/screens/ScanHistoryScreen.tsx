"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Button } from "../components/ui/Button"
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"

interface AllergenRisk {
  name: string
  likelihood: "high" | "medium" | "low"
  confidence: number
  userAllergen: boolean
}

interface ScanResult {
  id: number
  foodName: string
  description: string
  identifiedAllergens: Array<{ name: string; confidence: number }>
  userAllergenRisks: AllergenRisk[]
  isSafe: boolean
  safetyExplanation: string
  additionalWarnings?: string
  image: string
  scanDate: string
  scanTime: string
  isFallback?: boolean
}

const ScanHistoryScreen = () => {
  const navigation = useNavigation()
  const [scanResults, setScanResults] = useState<ScanResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    setIsLoading(true)
    try {
      const historyJson = await AsyncStorage.getItem("scan-history")
      if (historyJson) {
        const history = JSON.parse(historyJson)
        setScanResults(history)
      }
    } catch (error) {
      console.error("Error loading scan history:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteScanResult = async (id: number) => {
    const updatedResults = scanResults.filter((result) => result.id !== id)
    setScanResults(updatedResults)
    try {
      await AsyncStorage.setItem("scan-history", JSON.stringify(updatedResults))
    } catch (error) {
      console.error("Error saving scan history:", error)
    }
  }

  const clearAllResults = () => {
    Alert.alert("Clear All History", "Are you sure you want to clear all scan history? This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear All",
        style: "destructive",
        onPress: async () => {
          setScanResults([])
          try {
            await AsyncStorage.removeItem("scan-history")
          } catch (error) {
            console.error("Error clearing scan history:", error)
          }
        },
      },
    ])
  }

  const newScan = () => {
    navigation.navigate("Scan" as never)
  }

  const getLikelihoodVariant = (likelihood: string) => {
    switch (likelihood) {
      case "high":
        return "error"
      case "medium":
        return "warning"
      case "low":
        return "success"
      default:
        return "default"
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Scan History</Text>
          {scanResults.length > 0 && (
            <TouchableOpacity onPress={clearAllResults}>
              <View style={styles.clearButton}>
                <Ionicons name="trash-outline" size={16} color="#990000" />
                <Text style={styles.clearButtonText}>Clear All</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {scanResults.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="time-outline" size={48} color="#9575CD" />
            </View>
            <Text style={styles.emptyTitle}>No scan history</Text>
            <Text style={styles.emptyDescription}>Scan some food to see your history here</Text>
            <Button title="Scan Food Now" onPress={newScan} style={styles.scanButton} />
          </View>
        ) : (
          <>
            {/* Summary Stats */}
            <View style={styles.statsContainer}>
              <Card style={styles.statCard}>
                <CardContent style={styles.statContent}>
                  <Text style={styles.statNumber}>{scanResults.length}</Text>
                  <Text style={styles.statLabel}>Total Scans</Text>
                </CardContent>
              </Card>
              <Card style={styles.statCard}>
                <CardContent style={styles.statContent}>
                  <Text style={[styles.statNumber, styles.successNumber]}>
                    {scanResults.filter((r) => r.isSafe).length}
                  </Text>
                  <Text style={styles.statLabel}>Safe Foods</Text>
                </CardContent>
              </Card>
              <Card style={styles.statCard}>
                <CardContent style={styles.statContent}>
                  <Text style={[styles.statNumber, styles.errorNumber]}>
                    {scanResults.filter((r) => !r.isSafe).length}
                  </Text>
                  <Text style={styles.statLabel}>With Warnings</Text>
                </CardContent>
              </Card>
            </View>

            {/* Scan Results */}
            <View style={styles.resultsContainer}>
              {scanResults.map((result) => (
                <Card key={result.id} style={styles.resultCard}>
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: result.image }} style={styles.resultImage} />
                    <View style={styles.imageOverlay}>
                      <Badge variant={result.isSafe ? "success" : "error"} style={styles.safetyBadge}>
                        <Ionicons
                          name={result.isSafe ? "shield-checkmark" : "warning"}
                          size={12}
                          color={result.isSafe ? "#006B01" : "#990000"}
                        />
                        <Text style={styles.safetyBadgeText}>
                          {result.isSafe ? " Safe for you" : " Contains allergens"}
                        </Text>
                      </Badge>
                      {result.isFallback && (
                        <Badge variant="warning" style={styles.fallbackBadge}>
                          <Ionicons name="warning" size={12} color="#E65100" />
                          <Text style={styles.fallbackBadgeText}> Manual Check</Text>
                        </Badge>
                      )}
                    </View>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteScanResult(result.id)}>
                      <Ionicons name="close" size={16} color="#990000" />
                    </TouchableOpacity>
                  </View>

                  <CardHeader style={styles.resultHeader}>
                    <Text style={styles.resultTitle}>{result.foodName}</Text>
                    <Text style={styles.resultDescription} numberOfLines={2}>
                      {result.description}
                    </Text>
                    <Text style={styles.resultTime}>Scanned {result.scanTime}</Text>
                  </CardHeader>

                  <CardContent style={styles.resultContent}>
                    {result.userAllergenRisks.length > 0 && (
                      <View style={styles.allergenAssessment}>
                        <Text style={styles.assessmentTitle}>Allergen Assessment</Text>
                        {result.userAllergenRisks.slice(0, 3).map((risk, index) => (
                          <View key={index} style={styles.allergenRisk}>
                            <View style={styles.allergenRiskLeft}>
                              <Text style={styles.allergenRiskName}>{risk.name}</Text>
                              {risk.userAllergen && (
                                <Badge variant="error" style={styles.userAllergenBadge}>
                                  Your allergen
                                </Badge>
                              )}
                            </View>
                            <Badge variant={getLikelihoodVariant(risk.likelihood) as any}>
                              {result.isFallback ? "Check manually" : `${risk.confidence}%`}
                            </Badge>
                          </View>
                        ))}
                        {result.userAllergenRisks.length > 3 && (
                          <Text style={styles.moreAllergens}>
                            +{result.userAllergenRisks.length - 3} more allergens
                          </Text>
                        )}
                      </View>
                    )}
                  </CardContent>

                  <CardFooter style={styles.resultFooter}>
                    <Button
                      title="New Scan"
                      onPress={newScan}
                      variant="outline"
                      size="sm"
                      icon={<Ionicons name="scan" size={14} color="#7E57C2" style={{ marginRight: 4 }} />}
                    />
                    <Button
                      title={result.isSafe ? "Share Result" : "View Details"}
                      onPress={() => Alert.alert("Feature", "This feature would be implemented")}
                      variant={result.isSafe ? "primary" : "secondary"}
                      size="sm"
                      icon={
                        <Ionicons
                          name={result.isSafe ? "share-outline" : "information-circle-outline"}
                          size={14}
                          color={result.isSafe ? "#1A7FE8" : "#7E57C2"}
                          style={{ marginRight: 4 }}
                        />
                      }
                    />
                  </CardFooter>
                </Card>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EDE7F6",
    backgroundColor: "#F9F9F9",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#FFE5E5",
    borderRadius: 16,
  },
  clearButtonText: {
    fontSize: 14,
    color: "#990000",
    marginLeft: 4,
    fontWeight: "500",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
  },
  scanButton: {
    paddingHorizontal: 32,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: "center",
    paddingVertical: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2FA0FF",
    marginBottom: 4,
  },
  successNumber: {
    color: "#006B01",
  },
  errorNumber: {
    color: "#990000",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  resultsContainer: {
    paddingHorizontal: 16,
  },
  resultCard: {
    marginBottom: 16,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    height: 200,
  },
  resultImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F5F5F5",
  },
  imageOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
    gap: 8,
  },
  safetyBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  safetyBadgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  fallbackBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  fallbackBadgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  deleteButton: {
    position: "absolute",
    bottom: 8,
    left: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  resultHeader: {
    paddingBottom: 8,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  resultDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  resultTime: {
    fontSize: 12,
    color: "#9E9E9E",
  },
  resultContent: {
    paddingTop: 0,
  },
  allergenAssessment: {
    marginTop: 8,
  },
  assessmentTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  allergenRisk: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  allergenRiskLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  allergenRiskName: {
    fontSize: 14,
    color: "#1a1a1a",
    marginRight: 8,
  },
  userAllergenBadge: {
    marginRight: 8,
  },
  moreAllergens: {
    fontSize: 12,
    color: "#6B7280",
    fontStyle: "italic",
  },
  resultFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
})

export default ScanHistoryScreen
