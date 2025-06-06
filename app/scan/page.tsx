"use client";

import React, { useState, useRef, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";
import {
  Button,
  Card,
  Badge,
  Surface,
  Portal,
  Dialog,
} from "react-native-paper";
import { Camera } from "expo-camera";
import type { CameraCapturedPicture, CameraType } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "@/lib/user-store";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  ScanHistory: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface AllergenWarning {
  name: string;
  likelihood: "high" | "medium" | "low";
  confidence: number;
  userAllergen: boolean;
}

interface ScanResult {
  foodName: string;
  description: string;
  identifiedAllergens: Array<{ name: string; confidence: number }>;
  userAllergenRisks: AllergenWarning[];
  isSafe: boolean;
  safetyExplanation: string;
  additionalWarnings?: string;
}

export default function ScanPage() {
  const navigation = useNavigation<NavigationProp>();
  const [cameraActive, setCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isFallbackResult, setIsFallbackResult] = useState(false);
  const allergens = useUserStore((state) => state.allergens);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    if (!cameraActive) return;

    (async () => {
      const { granted } = await Camera.getCameraPermissionsAsync();
      setHasPermission(granted);
      if (!granted) {
        setError(
          "Camera permission denied. Please enable it in your settings."
        );
      }
    })();
  }, [cameraActive]);

  const requestCameraPermission = async () => {
    const { granted } = await Camera.getCameraPermissionsAsync();
    setHasPermission(granted);
  };

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync();
      await handleCameraCapture(photo);
    } catch (e) {
      setError("Failed to capture image");
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      await analyzeImage(result.assets[0].uri);
    }
  };

  const handleCameraCapture = async (photo: { uri: string }) => {
    try {
      await analyzeImage(photo.uri);
    } catch (err) {
      setError("Failed to process captured image");
    }
  };

  const handleCameraError = (error: string) => {
    setError(error);
    setCameraActive(false);
  };

  const analyzeImage = async (imageUri: string) => {
    setIsScanning(true);
    setScanResult(null);
    setError(null);
    setIsFallbackResult(false);

    try {
      const formData = new FormData();
      const imageFile = {
        uri: imageUri,
        type: "image/jpeg",
        name: "photo.jpg",
      } as unknown as Blob;

      formData.append("image", imageFile);
      formData.append("allergens", JSON.stringify(allergens));

      const response = await fetch("/api/analyze-food", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (responseData.fallback && responseData.result) {
          setScanResult(responseData.result);
          setIsFallbackResult(true);
          setError(responseData.error);
          saveToHistory(responseData.result, imageUri, true);
        } else {
          throw new Error(responseData.error || "Failed to analyze image");
        }
      } else {
        setScanResult(responseData);
        setIsFallbackResult(false);
        saveToHistory(responseData, imageUri, false);
      }
    } catch (err: any) {
      console.error("Error analyzing image:", err);
      const fallbackResult: ScanResult = {
        foodName: "Unknown Food Item",
        description:
          "Unable to analyze image. Please check ingredients manually.",
        identifiedAllergens: [],
        userAllergenRisks: allergens.map((allergen) => ({
          name: allergen.name,
          likelihood: "medium" as const,
          confidence: 50,
          userAllergen: true,
        })),
        isSafe: allergens.length === 0,
        safetyExplanation:
          allergens.length > 0
            ? "Cannot determine safety - please check ingredients manually."
            : "No allergens in your profile, but please verify ingredients.",
        additionalWarnings:
          "Analysis failed. Always read ingredient labels carefully.",
      };

      setScanResult(fallbackResult);
      setIsFallbackResult(true);
      setError(
        "Analysis unavailable. Showing basic safety check based on your allergen profile."
      );
      saveToHistory(fallbackResult, imageUri, true);
    } finally {
      setIsScanning(false);
      setCameraActive(false);
    }
  };

  const saveToHistory = async (
    result: ScanResult,
    imageUri: string,
    isFallback: boolean
  ) => {
    const newScan = {
      id: Date.now(),
      ...result,
      image: imageUri,
      scanDate: new Date().toISOString().split("T")[0],
      scanTime: "Just now",
      isFallback: isFallback,
    };

    const historyJson = (await AsyncStorage.getItem("scan-history")) || "[]";
    const history = JSON.parse(historyJson);
    await AsyncStorage.setItem(
      "scan-history",
      JSON.stringify([newScan, ...history])
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return styles.errorBadge;
      case "medium":
        return styles.warningBadge;
      case "low":
        return styles.successBadge;
      default:
        return styles.defaultBadge;
    }
  };

  const resetScan = () => {
    setCameraActive(false);
    setScanResult(null);
    setSelectedImage(null);
    setError(null);
    setIsFallbackResult(false);
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button mode="contained" onPress={requestCameraPermission}>
          Grant Permission
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <Text style={styles.headerTitle}>Scan Food</Text>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate("ScanHistory")}
          icon={({ size, color }) => (
            <MaterialIcons name="history" size={size} color={color} />
          )}
        >
          History
        </Button>
      </Surface>

      <ScrollView style={styles.content}>
        {isFallbackResult && (
          <Surface style={styles.warningCard}>
            <MaterialIcons name="warning" size={24} color="#f59e0b" />
            <Text style={styles.warningText}>
              AI analysis is temporarily unavailable. Results are based on your
              allergen profile only. Please manually verify all ingredients.
            </Text>
          </Surface>
        )}

        <Surface style={styles.scanArea}>
          {isScanning ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0891b2" />
              <Text style={styles.loadingText}>Analyzing for allergens...</Text>
              <Text style={styles.loadingSubtext}>
                This may take a few seconds
              </Text>
            </View>
          ) : cameraActive ? (
            <View style={styles.cameraContainer}>
              <Camera
                ref={cameraRef}
                style={styles.camera}
                type={Camera.Constants.Type.back}
              >
                <View style={styles.cameraOverlay}>
                  <View style={styles.scanFrame} />
                  <TouchableOpacity
                    style={styles.captureButton}
                    onPress={takePhoto}
                  />
                </View>
              </Camera>
            </View>
          ) : selectedImage ? (
            <Surface style={styles.imageContainer}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.previewImage}
                resizeMode="cover"
              />
            </Surface>
          ) : scanResult ? (
            <View style={styles.resultContainer}>
              <MaterialIcons
                name={scanResult.isSafe ? "verified" : "warning"}
                size={48}
                color={scanResult.isSafe ? "#059669" : "#dc2626"}
              />
              <Text style={styles.foodName}>{scanResult.foodName}</Text>
              <Text style={styles.description}>{scanResult.description}</Text>
              <Badge
                style={[
                  styles.badge,
                  scanResult.isSafe ? styles.successBadge : styles.errorBadge,
                ]}
              >
                {scanResult.isSafe ? "Safe for you" : "Contains your allergens"}
              </Badge>

              {scanResult.userAllergenRisks.length > 0 && (
                <View style={styles.allergenList}>
                  <Text style={styles.allergenTitle}>Allergen Assessment:</Text>
                  {scanResult.userAllergenRisks
                    .slice(0, 3)
                    .map((allergen, index) => (
                      <View key={index} style={styles.allergenItem}>
                        <View style={styles.allergenInfo}>
                          <Text style={styles.allergenName}>
                            {allergen.name}
                          </Text>
                          {allergen.userAllergen && (
                            <Badge style={styles.userAllergenBadge}>
                              Your allergen
                            </Badge>
                          )}
                        </View>
                        <Badge
                          style={[
                            styles.badge,
                            getSeverityColor(allergen.likelihood),
                          ]}
                        >
                          {isFallbackResult
                            ? "Check manually"
                            : `${allergen.confidence}%`}
                        </Badge>
                      </View>
                    ))}
                  {scanResult.userAllergenRisks.length > 3 && (
                    <Text style={styles.moreAllergens}>
                      +{scanResult.userAllergenRisks.length - 3} more allergens
                    </Text>
                  )}
                </View>
              )}

              {scanResult.additionalWarnings && (
                <Surface style={styles.warningCard}>
                  <Text style={styles.warningTitle}>Additional warnings:</Text>
                  <Text style={styles.warningText}>
                    {scanResult.additionalWarnings}
                  </Text>
                </Surface>
              )}
            </View>
          ) : error && !scanResult ? (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error" size={48} color="#dc2626" />
              <Text style={styles.errorTitle}>Error</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <MaterialIcons name="camera-alt" size={48} color="#9ca3af" />
              <Text style={styles.placeholderText}>
                Take a photo or upload an image to scan for allergens
              </Text>
            </View>
          )}
        </Surface>

        <View style={styles.buttonContainer}>
          {cameraActive ? (
            <View style={styles.cameraButtons}>
              <Button
                mode="outlined"
                onPress={() => setCameraActive(false)}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
            </View>
          ) : (
            <>
              <Button
                mode="contained"
                onPress={pickImage}
                disabled={isScanning}
                style={styles.uploadButton}
                icon="upload"
              >
                {scanResult || selectedImage
                  ? "Upload New Photo"
                  : "Upload Photo"}
              </Button>
              <Button
                mode="outlined"
                onPress={() => setCameraActive(true)}
                disabled={isScanning}
                style={styles.cameraButton}
                icon="camera"
              >
                {scanResult || selectedImage ? "Take New Photo" : "Use Camera"}
              </Button>
              {(scanResult || selectedImage) && (
                <Button
                  mode="text"
                  onPress={resetScan}
                  disabled={isScanning}
                  icon="refresh"
                >
                  Start Over
                </Button>
              )}
            </>
          )}
        </View>

        <Card style={styles.tipsCard}>
          <Card.Content>
            <Text style={styles.tipsTitle}>Photo Tips for Best Results:</Text>
            <View style={styles.tipsList}>
              <Text style={styles.tipText}>
                • Ensure good lighting and clear image quality
              </Text>
              <Text style={styles.tipText}>
                • Include ingredient labels when scanning packaged foods
              </Text>
              <Text style={styles.tipText}>
                • Position food items clearly in the center
              </Text>
              <Text style={styles.tipText}>
                • For multiple items, take separate photos for each
              </Text>
              <Text style={styles.tipText}>
                • Supported formats: JPG, PNG, WebP (max 10MB)
              </Text>
              {isFallbackResult && (
                <Text style={[styles.tipText, styles.warningTip]}>
                  • AI analysis unavailable - manually verify all ingredients
                </Text>
              )}
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scanArea: {
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
    marginBottom: 16,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: "75%",
    height: "75%",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
    borderRadius: 12,
  },
  captureButton: {
    position: "absolute",
    bottom: 32,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#fff",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.5)",
  },
  imageContainer: {
    flex: 1,
    overflow: "hidden",
  },
  previewImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 16,
  },
  cameraButtons: {
    flexDirection: "row",
    gap: 8,
  },
  cancelButton: {
    flex: 0.3,
  },
  uploadButton: {
    marginBottom: 8,
  },
  cameraButton: {
    marginBottom: 8,
  },
  warningCard: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff3e0",
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#b45309",
    marginBottom: 4,
  },
  warningText: {
    flex: 1,
    marginLeft: 12,
    color: "#b45309",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
  },
  loadingSubtext: {
    marginTop: 4,
    fontSize: 14,
    color: "#6b7280",
  },
  resultContainer: {
    padding: 24,
    alignItems: "center",
  },
  foodName: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    textAlign: "center",
    marginBottom: 12,
    color: "#6b7280",
  },
  badge: {
    marginBottom: 4,
  },
  successBadge: {
    backgroundColor: "#dcfce7",
  },
  errorBadge: {
    backgroundColor: "#fee2e2",
  },
  warningBadge: {
    backgroundColor: "#fff3e0",
  },
  defaultBadge: {
    backgroundColor: "#f3f4f6",
  },
  allergenList: {
    width: "100%",
    marginTop: 16,
  },
  allergenTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  allergenItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  allergenInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  allergenName: {
    fontSize: 14,
  },
  userAllergenBadge: {
    backgroundColor: "#fee2e2",
  },
  moreAllergens: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  tipsCard: {
    marginTop: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  tipsList: {
    gap: 8,
  },
  tipText: {
    fontSize: 14,
    color: "#6b7280",
  },
  warningTip: {
    color: "#b45309",
    fontWeight: "500",
  },
  permissionWarning: {
    padding: 12,
    backgroundColor: "#fff3e0",
    borderRadius: 8,
    marginBottom: 16,
  },
  permissionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#b45309",
    marginBottom: 4,
  },
  permissionText: {
    fontSize: 14,
    color: "#b45309",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    textAlign: "center",
    color: "#dc2626",
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  placeholderText: {
    textAlign: "center",
    marginTop: 16,
    color: "#6b7280",
  },
  message: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
});
