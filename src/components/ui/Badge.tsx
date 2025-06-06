import type React from "react"
import { View, Text, StyleSheet, type ViewStyle, type TextStyle } from "react-native"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "success" | "error" | "warning" | "secondary"
  style?: ViewStyle
  textStyle?: TextStyle
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "default", style, textStyle }) => {
  const getBadgeStyle = () => {
    switch (variant) {
      case "success":
        return styles.success
      case "error":
        return styles.error
      case "warning":
        return styles.warning
      case "secondary":
        return styles.secondary
      default:
        return styles.default
    }
  }

  const getTextStyle = () => {
    switch (variant) {
      case "success":
        return styles.successText
      case "error":
        return styles.errorText
      case "warning":
        return styles.warningText
      case "secondary":
        return styles.secondaryText
      default:
        return styles.defaultText
    }
  }

  return (
    <View style={[styles.badge, getBadgeStyle(), style]}>
      <Text style={[styles.text, getTextStyle(), textStyle]}>{children}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "500",
  },
  default: {
    backgroundColor: "#F5F5F5",
  },
  defaultText: {
    color: "#424242",
  },
  success: {
    backgroundColor: "#DFFFE0",
  },
  successText: {
    color: "#006B01",
  },
  error: {
    backgroundColor: "#FFE5E5",
  },
  errorText: {
    color: "#990000",
  },
  warning: {
    backgroundColor: "#FFF3E0",
  },
  warningText: {
    color: "#E65100",
  },
  secondary: {
    backgroundColor: "#EDE7F6",
  },
  secondaryText: {
    color: "#7E57C2",
  },
})
