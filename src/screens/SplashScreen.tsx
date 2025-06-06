"use client"

import { useEffect } from "react"
import { View, Text, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

const SplashScreen = () => {
  const navigation = useNavigation()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Login" as never)
    }, 2000)

    return () => clearTimeout(timer)
  }, [navigation])

  return (
    <LinearGradient colors={["#DCEEFF", "#C1E4FF"]} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="shield-checkmark" size={64} color="#2FA0FF" />
        </View>
        <Text style={styles.title}>AllergyGuard</Text>
        <Text style={styles.subtitle}>Stay safe with allergen monitoring</Text>
      </View>

      <View style={styles.loadingContainer}>
        <Ionicons name="checkmark-circle" size={24} color="#F9F9F9" />
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    marginBottom: 100,
  },
  iconContainer: {
    backgroundColor: "#F9F9F9",
    padding: 20,
    borderRadius: 50,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#F9F9F9",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#F9F9F9",
    opacity: 0.9,
  },
  loadingContainer: {
    position: "absolute",
    bottom: 50,
  },
})

export default SplashScreen
