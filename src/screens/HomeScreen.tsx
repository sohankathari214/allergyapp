"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useUser } from "../context/UserContext"

const HomeScreen = () => {
  const navigation = useNavigation()
  const { allergens } = useUser()

  const [recentScans] = useState([
    { name: "Greek Yogurt", status: "safe", time: "2 hours ago" },
    { name: "Thai Curry", status: "warning", time: "Yesterday" },
    { name: "Avocado Toast", status: "safe", time: "2 days ago" },
  ])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "severe":
        return "#FFE5E5"
      case "moderate":
        return "#FFF3E0"
      case "mild":
        return "#FFF9C4"
      default:
        return "#F5F5F5"
    }
  }

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case "severe":
        return "#990000"
      case "moderate":
        return "#E65100"
      case "mild":
        return "#F57F17"
      default:
        return "#424242"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "safe" ? "#DFFFE0" : "#FFE5E5"
  }

  const getStatusTextColor = (status: string) => {
    return status === "safe" ? "#006B01" : "#990000"
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AllergyGuard</Text>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome back, Alex</Text>
          <Text style={styles.welcomeSubtitle}>Stay safe with your allergen monitoring</Text>
        </View>

        {/* Quick Scan Button */}
        <TouchableOpacity style={styles.scanButtonContainer} onPress={() => navigation.navigate("Scan" as never)}>
          <LinearGradient colors={["#DCEEFF", "#C1E4FF"]} style={styles.scanButton}>
            <Ionicons name="camera" size={36} color="#2FA0FF" />
            <Text style={styles.scanButtonTitle}>Scan Food for Allergens</Text>
            <Text style={styles.scanButtonSubtitle}>Tap to start scanning</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Your Allergens */}
        <View style={styles.card}>
          <LinearGradient colors={["#EDE7F6", "#D1C4E9"]} style={styles.cardHeader}>
            <View style={styles.cardHeaderContent}>
              <Text style={styles.cardTitle}>Your Allergens</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Profile" as never)}>
                <Text style={styles.manageButton}>Manage</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
          <View style={styles.cardContent}>
            {allergens.map((allergen, index) => (
              <View key={index} style={styles.allergenItem}>
                <Text style={styles.allergenName}>{allergen.name}</Text>
                <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(allergen.severity) }]}>
                  <Text style={[styles.severityText, { color: getSeverityTextColor(allergen.severity) }]}>
                    {allergen.severity}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Scans */}
        <View style={styles.card}>
          <LinearGradient colors={["#EDE7F6", "#D1C4E9"]} style={styles.cardHeader}>
            <View style={styles.cardHeaderContent}>
              <Text style={styles.cardTitle}>Recent Scans</Text>
              <TouchableOpacity onPress={() => navigation.navigate("History" as never)}>
                <Text style={styles.manageButton}>View All</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
          <View style={styles.cardContent}>
            {recentScans.map((scan, index) => (
              <View key={index} style={styles.scanItem}>
                <View style={styles.scanInfo}>
                  <Text style={styles.scanName}>{scan.name}</Text>
                  <Text style={styles.scanTime}>{scan.time}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(scan.status) }]}>
                  <Text style={[styles.statusText, { color: getStatusTextColor(scan.status) }]}>
                    {scan.status === "safe" ? "Safe" : "Warning"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("History" as never)}>
            <Ionicons name="time" size={28} color="#9575CD" />
            <Text style={styles.actionText}>Scan History</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("Profile" as never)}>
            <Ionicons name="shield-checkmark" size={28} color="#9575CD" />
            <Text style={styles.actionText}>Allergen Profile</Text>
          </TouchableOpacity>
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
  welcomeSection: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  scanButtonContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    overflow: "hidden",
  },
  scanButton: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  scanButtonTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A7FE8",
    marginTop: 12,
    marginBottom: 4,
  },
  scanButtonSubtitle: {
    fontSize: 14,
    color: "#2FA0FF",
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EDE7F6",
    overflow: "hidden",
  },
  cardHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cardHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  manageButton: {
    fontSize: 14,
    color: "#7E57C2",
    fontWeight: "500",
  },
  cardContent: {
    padding: 16,
  },
  allergenItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  allergenName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: "500",
  },
  scanItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  scanInfo: {
    flex: 1,
  },
  scanName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  scanTime: {
    fontSize: 12,
    color: "#6B7280",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  quickActions: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 24,
    gap: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EDE7F6",
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1a1a1a",
    marginTop: 12,
    textAlign: "center",
  },
})

export default HomeScreen
