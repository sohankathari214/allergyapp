"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AppHeader from "@/components/app-header"

interface Post {
  id: number
  title: string
  content: string
  author: string
  avatar: string
  date: string
  likes: number
  comments: number
}

export default function ForumPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: "Tips for new hikers",
      content:
        "I've been hiking for years and wanted to share some tips for beginners. First, always bring more water than you think you need...",
      author: "MountainExplorer",
      avatar: "",
      date: "2 hours ago",
      likes: 24,
      comments: 8,
    },
    {
      id: 2,
      title: "Best urban photography spots",
      content:
        "I've been exploring the city and found some amazing spots for photography. The abandoned factory on 5th street has incredible lighting in the afternoon...",
      author: "UrbanShutter",
      avatar: "",
      date: "Yesterday",
      likes: 42,
      comments: 15,
    },
    {
      id: 3,
      title: "Community meetup this weekend",
      content:
        "We're organizing a community meetup this Saturday at Central Park. Everyone is welcome! We'll be discussing upcoming features and sharing experiences...",
      author: "CommunityLead",
      avatar: "",
      date: "3 days ago",
      likes: 67,
      comments: 23,
    },
  ])

  return (
    <>
      <AppHeader
        title="Forum"
        action={
          <Button size="sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M12 5v14"></path>
              <path d="M5 12h14"></path>
            </svg>
            New
          </Button>
        }
      />

      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center space-x-2">
          <Input placeholder="Search discussions..." className="flex-1" />
          <Button size="icon" variant="ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </Button>
        </div>

        <Tabs defaultValue="latest">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="latest">Latest</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="my-posts">My Posts</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-3">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="p-3 pb-0">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.avatar || "/placeholder.svg"} alt={post.author} />
                    <AvatarFallback>{post.author.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{post.author}</p>
                    <p className="text-xs text-muted-foreground">{post.date}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3">
                <h3 className="font-semibold mb-1">{post.title}</h3>
                <p className="text-sm line-clamp-2">{post.content}</p>
              </CardContent>
              <CardFooter className="p-3 pt-0 flex justify-between">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                    </svg>
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    {post.comments}
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                    <polyline points="16 6 12 2 8 6"></polyline>
                    <line x1="12" x2="12" y1="2" y2="15"></line>
                  </svg>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
