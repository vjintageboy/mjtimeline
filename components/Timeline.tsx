"use client"

import { useTimeline, Post } from "@/hooks/useTimeline"
import { Container, Heading, Text, Card, Flex, Badge } from "@radix-ui/themes"
import ClipLoader from "react-spinners/ClipLoader"

// Helper to format timestamp
const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
}

// Helper to truncate address
const truncateAddress = (address: string) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

interface PostCardProps {
    post: Post
}

const PostCard = ({ post }: PostCardProps) => {
    return (
        <Card
            style={{
                background: "linear-gradient(145deg, rgba(30, 30, 40, 0.9), rgba(20, 20, 30, 0.95))",
                border: "1px solid rgba(100, 100, 255, 0.15)",
                borderRadius: "16px",
                padding: "1.25rem",
                marginBottom: "1rem",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
            }}
        >
            <Flex justify="between" align="center" style={{ marginBottom: "0.75rem" }}>
                <Badge
                    size="2"
                    style={{
                        background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                        color: "white",
                        fontFamily: "monospace",
                    }}
                >
                    {truncateAddress(post.author)}
                </Badge>
                <Text size="1" style={{ color: "rgba(160, 160, 180, 0.8)" }}>
                    {formatTime(post.timestamp)}
                </Text>
            </Flex>
            <Text
                size="3"
                style={{
                    color: "rgba(240, 240, 255, 0.95)",
                    lineHeight: "1.6",
                    wordBreak: "break-word",
                }}
            >
                {post.content}
            </Text>
        </Card>
    )
}

export function Timeline() {
    const { posts, isFetchingPosts, timelineId, state, actions } = useTimeline()

    if (!timelineId) {
        return null
    }

    if (state.error) {
        return (
            <Container style={{ padding: "2rem", textAlign: "center" }}>
                <div
                    style={{
                        padding: "1.5rem",
                        border: "1px solid rgba(220, 50, 50, 0.25)",
                        borderRadius: "14px",
                        background: "rgba(220, 50, 50, 0.08)",
                    }}
                >
                    <Heading size="4" style={{ color: "rgba(255, 120, 120, 0.9)" }}>
                        ⚠️ Unable to load posts
                    </Heading>
                    <Text style={{ color: "rgba(220, 220, 240, 0.8)", display: "block", marginTop: "0.5rem" }}>
                        {state.error.message}
                    </Text>
                    <button
                        onClick={actions.fetchPosts}
                        style={{
                            marginTop: "1rem",
                            padding: "0.65rem 1.4rem",
                            borderRadius: "10px",
                            border: "1px solid rgba(255, 255, 255, 0.12)",
                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                            color: "white",
                            cursor: "pointer",
                        }}
                    >
                        Retry
                    </button>
                </div>
            </Container>
        )
    }

    if (isFetchingPosts && posts.length === 0) {
        return (
            <Container style={{ padding: "2rem", textAlign: "center" }}>
                <ClipLoader color="#8b5cf6" size={40} />
                <Text style={{ display: "block", marginTop: "1rem", color: "rgba(160, 160, 180, 0.8)" }}>
                    Loading posts...
                </Text>
            </Container>
        )
    }

    if (posts.length === 0) {
        return (
            <Container style={{ padding: "2rem", textAlign: "center" }}>
                <div
                    style={{
                        padding: "3rem",
                        background: "linear-gradient(145deg, rgba(30, 30, 40, 0.6), rgba(20, 20, 30, 0.7))",
                        borderRadius: "20px",
                        border: "1px dashed rgba(100, 100, 255, 0.3)",
                    }}
                >
                    <Text size="4" style={{ color: "rgba(160, 160, 180, 0.8)" }}>
                        📝 No posts yet. Be the first to share something!
                    </Text>
                </div>
            </Container>
        )
    }

    return (
        <Container style={{ padding: "1rem 0" }}>
            <Heading
                size="5"
                style={{
                    marginBottom: "1.5rem",
                    background: "linear-gradient(90deg, #f8f8ff, #a5b4fc)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                }}
            >
                📰 Timeline ({posts.length} {posts.length === 1 ? "post" : "posts"})
            </Heading>

            <div style={{ display: "flex", flexDirection: "column" }}>
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>

            {isFetchingPosts && (
                <Flex justify="center" style={{ padding: "1rem" }}>
                    <ClipLoader color="#8b5cf6" size={24} />
                </Flex>
            )}
        </Container>
    )
}

export default Timeline
