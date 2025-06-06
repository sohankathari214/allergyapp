"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useUser } from "../context/UserContext"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Card, CardHeader, CardContent } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"

const ProfileScreen = () => {
  const { allergens, addAllergen, removeAllergen } = useUser()
  const [isAddingAllergen, setIsAddingAllergen] = useState(false)
  const [newAllergenName, setNewAllergenName] = useState("")
  const [newAllergenSeverity, setNewAllergenSeverity] = useState<"mild" | "moderate" | "severe">("mild")
  const [newAllergenComments, setNewAllergenComments] = useState("")

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "severe":
        return "error"
      case "moderate":
        return "warning"
      case "mild":
        return "secondary"
      default:
        return "default"
    }
  }

  const handleAddAllergen = () => {
    if (!newAllergenName.trim()) {
      Alert.alert("Error", "Please enter an allergen name")
      return
    }

    addAllergen({
      name: newAllergenName.trim(),
      severity: newAllergenSeverity,
      comments: newAllergenComments.trim(),
    })

    setNewAllergenName("")
    setNewAllergenComments("")
    setNewAllergenSeverity("mild")
    setIsAddingAllergen(false)
    Alert.alert("Success", "Allergen added successfully")
  }

  const handleRemoveAllergen = (id: number, name: string) => {
    Alert.alert("Remove Allergen", `Are you sure you want to remove ${name} from your allergen list?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removeAllergen(id),
      },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={20} color="#7E57C2" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AJ</Text>
            </View>
          </View>
          <Text style={styles.userName}>Alex Johnson</Text>
          <Text style={styles.userHandle}>@alexj</Text>
          <Badge variant="error" style={styles.allergenBadge}>
            {allergens.length} Known Allergens
          </Badge>
        </View>

        {/* Allergens Section */}
        <Card style={styles.card}>
          <CardHeader>
            <LinearGradient colors={["#EDE7F6", "#D1C4E9"]} style={styles.cardHeaderGradient}>
              <View style={styles.cardHeaderContent}>
                <Text style={styles.cardTitle}>My Allergens</Text>
                <TouchableOpacity onPress={() => setIsAddingAllergen(true)}>
                  <View style={styles.addButton}>
                    <Ionicons name="add" size={16} color="#7E57C2" />
                    <Text style={styles.addButtonText}>Add</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </CardHeader>
          <CardContent>
            {allergens.map((allergen) => (
              <View key={allergen.id} style={styles.allergenItem}>
                <View style={styles.allergenInfo}>
                  <Text style={styles.allergenName}>{allergen.name}</Text>
                  <Badge variant={getSeverityColor(allergen.severity) as any} style={styles.severityBadge}>
                    {allergen.severity}
                  </Badge>
                </View>
                {allergen.comments && <Text style={styles.allergenComments}>{allergen.comments}</Text>}
                <Text style={styles.allergenDate}>Added {allergen.dateAdded}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveAllergen(allergen.id, allergen.name)}
                >
                  <Ionicons name="close" size={16} color="#990000" />
                </TouchableOpacity>
              </View>
            ))}
          </CardContent>
        </Card>

        {/* Add Allergen Form */}
        {isAddingAllergen && (
          <Card style={styles.card}>
            <CardHeader>
              <Text style={styles.cardTitle}>Add New Allergen</Text>
            </CardHeader>
            <CardContent>
              <Input
                label="Allergen Name"
                value={newAllergenName}
                onChangeText={setNewAllergenName}
                placeholder="e.g., Peanuts, Shellfish, Dairy"
              />

              <Text style={styles.severityLabel}>Severity Level</Text>
              <View style={styles.severityOptions}>
                {["mild", "moderate", "severe"].map((severity) => (
                  <TouchableOpacity
                    key={severity}
                    style={[styles.severityOption, newAllergenSeverity === severity && styles.severityOptionActive]}
                    onPress={() => setNewAllergenSeverity(severity as any)}
                  >
                    <Text
                      style={[
                        styles.severityOptionText,
                        newAllergenSeverity === severity && styles.severityOptionTextActive,
                      ]}
                    >
                      {severity.charAt(0).toUpperCase() + severity.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Input
                label="Comments & Notes"
                value={newAllergenComments}
                onChangeText={setNewAllergenComments}
                placeholder="Describe your symptoms, triggers, or any additional notes..."
                multiline
                numberOfLines={3}
                style={styles.textArea}
              />

              <View style={styles.formActions}>
                <Button
                  title="Cancel"
                  onPress={() => setIsAddingAllergen(false)}
                  variant="outline"
                  style={styles.cancelButton}
                />
                <Button title="Add Allergen" onPress={handleAddAllergen} style={styles.addAllergenButton} />
              </View>
            </CardContent>
          </Card>
        )}

        {/* Settings Section */}
        <Card style={styles.card}>
          <CardHeader>
            <LinearGradient colors={["#EDE7F6", "#D1C4E9"]} style={styles.cardHeaderGradient}>
              <Text style={styles.cardTitle}>App Settings</Text>
            </LinearGradient>
          </CardHeader>
          <CardContent>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Allergen Warnings</Text>
                <Text style={styles.settingDescription}>Show warnings when allergens are detected</Text>
              </View>
              <Text style={styles.settingValue}>Enabled</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Scan Notifications</Text>
                <Text style={styles.settingDescription}>Get notified about scan results</Text>
              </View>
              <Text style={styles.settingValue}>Enabled</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Emergency Contacts</Text>
                <Text style={styles.settingDescription}>Manage emergency contact information</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#9E9E9E" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.settingItem, styles.lastSettingItem]}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, styles.exportTitle]}>Export Data</Text>
                <Text style={styles.settingDescription}>Export your allergen profile</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#9E9E9E" />
            </TouchableOpacity>
          </CardContent>
        </Card>
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
  editButton: {
    padding: 8,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#EDE7F6",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "600",
    color: "#7E57C2",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  userHandle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 16,
  },
  allergenBadge: {
    alignSelf: "center",
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cardHeaderGradient: {
    margin: -16,
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
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
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#7E57C2",
    marginLeft: 4,
  },
  allergenItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    position: "relative",
  },
  allergenInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  allergenName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
    flex: 1,
  },
  severityBadge: {
    marginLeft: 8,
  },
  allergenComments: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
    paddingRight: 32,
  },
  allergenDate: {
    fontSize: 12,
    color: "#9E9E9E",
  },
  removeButton: {
    position: "absolute",
    top: 12,
    right: 0,
    padding: 4,
  },
  severityLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  severityOptions: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
  },
  severityOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  severityOptionActive: {
    borderColor: "#2FA0FF",
    backgroundColor: "#DCEEFF",
  },
  severityOptionText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  severityOptionTextActive: {
    color: "#2FA0FF",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  formActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
  },
  addAllergenButton: {
    flex: 1,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  lastSettingItem: {
    borderBottomWidth: 0,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  exportTitle: {
    color: "#990000",
  },
  settingDescription: {
    fontSize: 14,
    color: "#6B7280",
  },
  settingValue: {
    fontSize: 14,
    color: "#7E57C2",
    fontWeight: "500",
  },
})

export default ProfileScreen
