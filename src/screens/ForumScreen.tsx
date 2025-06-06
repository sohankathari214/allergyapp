"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

interface Post {
  id: number
  title: string
  content: string
  author: string
  date: string
  likes: number
  comments: number
}

const ForumScreen = () => {
  const [posts] = useState<Post[]>([
    {
      id: 1,
      title: "Tips for new allergy sufferers",
      content: "I've been managing severe allergies for years and wanted to share some tips for beginners...",
      author: "AllergyExpert",
      date: "2 hours ago",
      likes: 24,
      comments: 8,
    },
    {
      id: 2,
      title: "Best restaurants for food allergies",
      content: "Found some amazing allergy-friendly restaurants in the city. Here's my comprehensive list...",
      author: "FoodieWithAllergies",
      date: "Yesterday",
      likes: 42,
      comments: 15,
    },
    {
      id: 3,
      title: "Community meetup this weekend",
      content: "We're organizing an allergy support meetup this Saturday. Everyone is welcome!",
      author: "CommunityLead",
      date: "3 days ago",
      likes: 67,
      comments: 23,
    },
  ])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Forum</Text>
          <TouchableOpacity style={styles.newPostButton}>
            <LinearGradient colors={["#DCEEFF", "#C1E4FF"]} style={styles.newPostGradient}>
              <Ionicons name="add" size={16} color="#2FA0FF" />
              <Text style={styles.newPostText}>New</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={18} color="#9E9E9E" style={styles.searchIcon} />
            <TextInput style={styles.searchInput} placeholder="Search discussions..." placeholderTextColor="#9E9E9E" />
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          <TouchableOpacity style={[styles.filterTab, styles.activeTab]}>
            <Text style={[styles.filterTabText, styles.activeTabText]}>Latest</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterTab}>
            <Text style={styles.filterTabText}>Popular</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterTab}>
            <Text style={styles.filterTabText}>My Posts</Text>
          </TouchableOpacity>
        </View>

        {/* Posts */}
        <View style={styles.postsContainer}>
          {posts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={styles.authorInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{post.author.substring(0, 2)}</Text>
                  </View>
                  <View style={styles.authorDetails}>
                    <Text style={styles.authorName}>{post.author}</Text>
                    <Text style={styles.postDate}>{post.date}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.postContent}>
                <Text style={styles.postTitle}>{post.title}</Text>
                <Text style={styles.postText} numberOfLines={2}>
                  {post.content}
                </Text>
              </View>

              <View style={styles.postActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="heart-outline" size={16} color="#9E9E9E" />
                  <Text style={styles.actionText}>{post.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="chatbubble-outline" size={16} color="#9E9E9E" />
                  <Text style={styles.actionText}>{post.comments}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareButton}>
                  <Ionicons name="share-outline" size={16} color="#9E9E9E" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
  newPostButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  newPostGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  newPostText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2FA0FF",
    marginLeft: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EDE7F6",
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1a1a1a",
  },
  filterTabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EDE7F6",
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: "#DCEEFF",
    borderColor: "#2FA0FF",
  },
  filterTabText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#2FA0FF",
  },
  postsContainer: {
    paddingHorizontal: 16,
  },
  postCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EDE7F6",
    marginBottom: 16,
    overflow: "hidden",
  },
  postHeader: {
    padding: 12,
    paddingBottom: 0,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EDE7F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7E57C2",
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  postDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  postContent: {
    padding: 12,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  postText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 4,
  },
  shareButton: {
    padding: 4,
  },
})

export default ForumScreen
