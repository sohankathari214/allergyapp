"use client"

import { useState } from "react"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"

// Import screens
import SplashScreen from "./src/screens/SplashScreen"
import LoginScreen from "./src/screens/LoginScreen"
import HomeScreen from "./src/screens/HomeScreen"

// Import providers
import { UserProvider } from "./src/context/UserContext"

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("Splash")

  const renderScreen = () => {
    switch (currentScreen) {
      case "Splash":
        return <SplashScreen onComplete={() => setCurrentScreen("Login")} />
      case "Login":
        return <LoginScreen onLogin={() => setCurrentScreen("Home")} />
      case "Home":
        return <HomeScreen />
      default:
        return <SplashScreen onComplete={() => setCurrentScreen("Login")} />
    }
  }

  return (
    <SafeAreaProvider>
      <UserProvider>
        <StatusBar style="auto" />
        {renderScreen()}
      </UserProvider>
    </SafeAreaProvider>
  )
}
