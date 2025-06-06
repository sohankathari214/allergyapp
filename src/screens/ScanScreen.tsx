"use client"

import { useState, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, ScrollView } from "react-native"
import { Camera } from "expo-camera"
import * as ImagePicker from "expo-image-picker"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useUser } from "../context/UserContext"

const ScanScreen = () => {
  const { allergens } = useUser()
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)
  const cameraRef = useRef<Camera>(null)

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync()
    setHasPermission(status === "granted")
    if (status === "granted") {
      setCameraActive(true)
    } else {
      Alert.alert(
        "Camera Permission",
        "Camera access is needed to scan food items. You can still upload photos from your gallery.",
        [{ text: "OK" }],
      )
    }
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled && result.assets[0]) {
      analyzeImage(result.assets[0].uri)
    }
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      setIsScanning(true)
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        })
        setCameraActive(false)
        analyzeImage(photo.uri)
      } catch (error) {
        console.error("Error taking picture:", error)
        setIsScanning(false)
      }
    }
  }

  const analyzeImage = async (imageUri: string) => {
    setIsScanning(true)

    // Simulate API call with fallback result
    setTimeout(() => {
      const mockResult = {
        foodName: "Food Item",
        description: "Analysis unavailable. Please check ingredients manually.",
        userAllergenRisks: allergens.map((allergen) => ({
          name: allergen.name,
          likelihood: "medium",
          confidence: 50,
          userAllergen: true,
        })),
        isSafe: allergens.length === 0,
        safetyExplanation:
          allergens.length > 0
            ? "Cannot determine safety - please check ingredients manually."
            : "No allergens in your profile, but please verify ingredients.",
        additionalWarnings: "AI analysis unavailable. Always read ingredient labels carefully.",
        isFallback: true,
      }

      setScanResult(mockResult)
      setIsScanning(false)
    }, 2000)
  }

  const resetScan = () => {
    setCameraActive(false)
    setScanResult(null)
    setIsScanning(false)
  }

  const getSeverityColor = (likelihood: string) => {
    switch (likelihood) {
      case "high":
        return "#FFE5E5"
      case "medium":
        return "#FFF3E0"
      case "low":
        return "#DFFFE0"
      default:
        return "#F5F5F5"
    }
  }

  const getSeverityTextColor = (likelihood: string) => {
    switch (likelihood) {
      case "high":
        return "#990000"
      case "medium":
        return "#E65100"
      case "low":
        return "#006B01"
      default:
        return "#424242"
    }
  }

  if (cameraActive && hasPermission) {
    return (
      <View style={styles.cameraContainer}>
        <Camera ref={cameraRef} style={styles.camera} type={Camera.Constants.Type.back}>
          <View style={styles.cameraOverlay}>
            <View style={styles.scanFrame} />
            <View style={styles.cameraControls}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setCameraActive(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.captureButton} onPress={takePicture} disabled={isScanning}>
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
              <View style={styles.placeholder} />
            </View>
          </View>
        </Camera>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Scan Food</Text>
        </View>

        {/* Fallback Warning */}
        {scanResult?.isFallback && (
          <View style={styles.warningContainer}>
            <View style={styles.warningContent}>
              <Ionicons name="warning" size={16} color="#E65100" />
              <Text style={styles.warningText}>
                AI analysis is temporarily unavailable. Results are based on your allergen profile only.
              </Text>
            </View>
          </View>
        )}

        {/* Main Scan Area */}
        <View style={styles.scanArea}>
          {isScanning ? (
            <LinearGradient colors={["#DCEEFF", "#C1E4FF"]} style={styles.scanningContainer}>
              <Ionicons name="scan" size={48} color="#2FA0FF" />
              <Text style={styles.scanningTitle}>Analyzing for allergens...</Text>
              <Text style={styles.scanningSubtitle}>This may take a few seconds</Text>
            </LinearGradient>
          ) : scanResult ? (
            <View style={styles.resultContainer}>
              <View style={[styles.resultIcon, { backgroundColor: scanResult.isSafe ? "#DFFFE0" : "#FFE5E5" }]}>
                <Ionicons
                  name={scanResult.isSafe ? "shield-checkmark" : "warning"}
                  size={32}
                  color={scanResult.isSafe ? "#006B01" : "#990000"}
                />
              </View>
              <Text style={styles.resultTitle}>{scanResult.foodName}</Text>
              <Text style={styles.resultDescription}>{scanResult.description}</Text>
              <View style={[styles.safetyBadge, { backgroundColor: scanResult.isSafe ? "#DFFFE0" : "#FFE5E5" }]}>
                <Text style={[styles.safetyText, { color: scanResult.isSafe ? "#006B01" : "#990000" }]}>
                  {scanResult.isSafe ? "Safe for you" : "Contains your allergens"}
                </Text>
              </View>

              {scanResult.userAllergenRisks.length > 0 && (
                <View style={styles.allergenResults}>
                  <Text style={styles.allergenResultsTitle}>Allergen Assessment:</Text>
                  {scanResult.userAllergenRisks.slice(0, 3).map((risk: any, index: number) => (
                    <View key={index} style={styles.allergenRisk}>
                      <View style={styles.allergenRiskLeft}>
                        <Text style={styles.allergenRiskName}>{risk.name}</Text>
                        {risk.userAllergen && (
                          <View style={styles.userAllergenBadge}>
                            <Text style={styles.userAllergenText}>Your allergen</Text>
                          </View>
                        )}
                      </View>
                      <View style={[styles.confidenceBadge, { backgroundColor: getSeverityColor(risk.likelihood) }]}>
                        <Text style={[styles.confidenceText, { color: getSeverityTextColor(risk.likelihood) }]}>
                          {scanResult.isFallback ? "Check manually" : `${risk.confidence}%`}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons name="camera" size={48} color="#9575CD" />
              <Text style={styles.placeholderText}>Take a photo or upload an image to scan for allergens</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {!cameraActive && !isScanning && (
            <>
              <TouchableOpacity style={styles.primaryButton} onPress={pickImage}>
                <LinearGradient colors={["#DCEEFF", "#C1E4FF"]} style={styles.buttonGradient}>
                  <Ionicons name="image" size={20} color="#1A7FE8" />
                  <Text style={styles.primaryButtonText}>{scanResult ? "Upload New Photo" : "Upload Photo"}</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton} onPress={requestCameraPermission}>
                <View style={styles.secondaryButtonContent}>
                  <Ionicons name="camera" size={20} color="#7E57C2" />
                  <Text style={styles.secondaryButtonText}>{scanResult ? "Take New Photo" : "Use Camera"}</Text>
                </View>
              </TouchableOpacity>

              {scanResult && (
                <TouchableOpacity style={styles.resetButton} onPress={resetScan}>
                  <Ionicons name="refresh" size={16} color="#6B7280" />
                  <Text style={styles.resetButtonText}>Start Over</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <LinearGradient colors={["#EDE7F6", "#D1C4E9"]} style={styles.tipsHeader}>
            <Text style={styles.tipsTitle}>Photo Tips for Best Results:</Text>
          </LinearGradient>
          <View style={styles.tipsContent}>
            <Text style={styles.tipText}>• Ensure good lighting and clear image quality</Text>
            <Text style={styles.tipText}>• Include ingredient labels when scanning packaged foods</Text>
            <Text style={styles.tipText}>• Position food items clearly in the center</Text>
            <Text style={styles.tipText}>• For multiple items, take separate photos for each</Text>
            {scanResult?.isFallback && (
              <Text style={[styles.tipText, { color: "#E65100", fontWeight: "500" }]}>
                • AI analysis unavailable - manually verify all ingredients
              </Text>
            )}
          </View>
        </View>
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
  header: {
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
  warningContainer: {
    margin: 16,
    backgroundColor: "#FFF3E0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFB74D",
  },
  warningContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  warningText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#E65100",
  },
  scanArea: {
    margin: 16,
    height: 300,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#EDE7F6",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  scanningContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  scanningTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1A7FE8",
    marginTop: 16,
  },
  scanningSubtitle: {
    fontSize: 12,
    color: "#2FA0FF",
    marginTop: 4,
  },
  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  resultIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
    textAlign: "center",
  },
  resultDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
    textAlign: "center",
  },
  safetyBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 16,
  },
  safetyText: {
    fontSize: 14,
    fontWeight: "500",
  },
  allergenResults: {
    width: "100%",
  },
  allergenResultsTitle: {
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
    backgroundColor: "#FFE5E5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  userAllergenText: {
    fontSize: 10,
    color: "#990000",
    fontWeight: "500",
  },
  confidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: "500",
  },
  placeholderContainer: {
    alignItems: "center",
    padding: 24,
  },
  placeholderText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 16,
  },
  actionButtons: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  primaryButton: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A7FE8",
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: "#EDE7F6",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1C4E9",
    marginBottom: 12,
  },
  secondaryButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7E57C2",
    marginLeft: 8,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  resetButtonText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 8,
  },
  tipsCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EDE7F6",
    overflow: "hidden",
  },
  tipsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  tipsContent: {
    padding: 16,
  },
  tipText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "space-between",
  },
  scanFrame: {
    flex: 1,
    margin: 50,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 12,
    opacity: 0.7,
  },
  cameraControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 50,
    paddingBottom: 50,
  },
  cancelButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#DCEEFF",
  },
  placeholder: {
    width: 60,
  },
})

export default ScanScreen
