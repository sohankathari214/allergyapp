import type React from "react"
import { TouchableOpacity, Text, StyleSheet, type ViewStyle, type TextStyle } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
  icon?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]]

    if (variant === "primary") {
      return [...baseStyle, styles.primary]
    } else if (variant === "secondary") {
      return [...baseStyle, styles.secondary]
    } else if (variant === "outline") {
      return [...baseStyle, styles.outline]
    } else {
      return [...baseStyle, styles.ghost]
    }
  }

  const getTextStyle = () => {
    const baseTextStyle = [styles.text, styles[`${size}Text`]]

    if (variant === "primary") {
      return [...baseTextStyle, styles.primaryText]
    } else if (variant === "secondary") {
      return [...baseTextStyle, styles.secondaryText]
    } else if (variant === "outline") {
      return [...baseTextStyle, styles.outlineText]
    } else {
      return [...baseTextStyle, styles.ghostText]
    }
  }

  if (variant === "primary") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[getButtonStyle(), style, disabled && styles.disabled]}
      >
        <LinearGradient colors={disabled ? ["#E0E0E0", "#BDBDBD"] : ["#DCEEFF", "#C1E4FF"]} style={styles.gradient}>
          {icon && <>{icon}</>}
          <Text style={[getTextStyle(), textStyle, disabled && styles.disabledText]}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[getButtonStyle(), style, disabled && styles.disabled]}
    >
      {icon && <>{icon}</>}
      <Text style={[getTextStyle(), textStyle, disabled && styles.disabledText]}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  gradient: {
    flex: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  md: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    minHeight: 44,
  },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 52,
  },
  primary: {
    overflow: "hidden",
  },
  secondary: {
    backgroundColor: "#EDE7F6",
    borderWidth: 1,
    borderColor: "#D1C4E9",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#EDE7F6",
  },
  ghost: {
    backgroundColor: "transparent",
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  smText: {
    fontSize: 14,
  },
  mdText: {
    fontSize: 16,
  },
  lgText: {
    fontSize: 18,
  },
  primaryText: {
    color: "#1A7FE8",
  },
  secondaryText: {
    color: "#7E57C2",
  },
  outlineText: {
    color: "#7E57C2",
  },
  ghostText: {
    color: "#6B7280",
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: "#9E9E9E",
  },
})
