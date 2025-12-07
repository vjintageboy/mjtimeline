"use client"

import { useState } from "react"
import { useTimeline } from "@/hooks/useTimeline"
import { Button, TextArea, Flex, Text, Card } from "@radix-ui/themes"
import ClipLoader from "react-spinners/ClipLoader"

export function CreatePost() {
    const { timelineId, state, isConnected, actions } = useTimeline()
    const [content, setContent] = useState("")
    const [localError, setLocalError] = useState<string | null>(null)

    const validateContent = (raw: string): string | null => {
        const trimmed = raw.trim()

        if (!trimmed) return "Content cannot be empty"
        if (trimmed.length < 3) return "Post must be at least 3 characters"
        if (trimmed.length > 500) return "Post content must be 500 characters or less"

        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLocalError(null)

        if (!timelineId) {
            setLocalError("Please initialize timeline first")
            return
        }

        const validationError = validateContent(content)
        if (validationError) {
            setLocalError(validationError)
            return
        }

        const trimmed = content.trim()

        await actions.createPost(trimmed)
        setContent("")
    }

    if (!isConnected) {
        return null
    }

    if (!timelineId) {
        return (
            <Card
                style={{
                    background: "linear-gradient(145deg, rgba(30, 30, 40, 0.9), rgba(20, 20, 30, 0.95))",
                    border: "1px solid rgba(100, 100, 255, 0.2)",
                    borderRadius: "20px",
                    padding: "2rem",
                    textAlign: "center",
                }}
            >
                <Text
                    size="4"
                    style={{
                        display: "block",
                        marginBottom: "1.5rem",
                        color: "rgba(200, 200, 220, 0.9)",
                    }}
                >
                    Create a new Timeline to start posting
                </Text>
                <Button
                    size="3"
                    onClick={actions.createTimeline}
                    disabled={state.isPending}
                    style={{
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        color: "white",
                        cursor: state.isPending ? "not-allowed" : "pointer",
                        padding: "0.75rem 2rem",
                        borderRadius: "12px",
                        fontWeight: "600",
                        transition: "all 0.3s ease",
                    }}
                >
                    {state.isPending ? (
                        <Flex align="center" gap="2">
                            <ClipLoader size={16} color="white" />
                            <span>Creating Timeline...</span>
                        </Flex>
                    ) : (
                        "🚀 Initialize Timeline"
                    )}
                </Button>
            </Card>
        )
    }

    return (
        <Card
            style={{
                background: "linear-gradient(145deg, rgba(30, 30, 40, 0.9), rgba(20, 20, 30, 0.95))",
                border: "1px solid rgba(100, 100, 255, 0.2)",
                borderRadius: "20px",
                padding: "1.5rem",
                marginBottom: "2rem",
            }}
        >
            <form onSubmit={handleSubmit}>
                <TextArea
                    placeholder="What's happening in your world? Share your micro-journalism... ✍️"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={state.isPending}
                    style={{
                        width: "100%",
                        minHeight: "100px",
                        background: "rgba(10, 10, 20, 0.6)",
                        border: "1px solid rgba(100, 100, 255, 0.15)",
                        borderRadius: "12px",
                        padding: "1rem",
                        color: "rgba(240, 240, 255, 0.95)",
                        fontSize: "1rem",
                        resize: "vertical",
                        marginBottom: "1rem",
                    }}
                />

                <Flex justify="between" align="center">
                    <Text size="1" style={{ color: "rgba(160, 160, 180, 0.7)" }}>
                        {content.trim().length}/500 characters
                    </Text>

                    <Button
                        type="submit"
                        size="3"
                        disabled={state.isPending || !!validateContent(content)}
                        style={{
                            background: state.isPending || !content.trim()
                                ? "rgba(100, 100, 120, 0.5)"
                                : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                            color: "white",
                            cursor: state.isPending || !content.trim() ? "not-allowed" : "pointer",
                            padding: "0.6rem 1.5rem",
                            borderRadius: "10px",
                            fontWeight: "600",
                            transition: "all 0.3s ease",
                        }}
                    >
                        {state.isPending ? (
                            <Flex align="center" gap="2">
                                <ClipLoader size={14} color="white" />
                                <span>Posting...</span>
                            </Flex>
                        ) : (
                            "📤 Post"
                        )}
                    </Button>
                </Flex>
            </form>

            {(localError || state.error) && (
                <div
                    style={{
                        marginTop: "1rem",
                        padding: "0.75rem 1rem",
                        background: "rgba(220, 50, 50, 0.15)",
                        border: "1px solid rgba(220, 50, 50, 0.3)",
                        borderRadius: "10px",
                    }}
                >
                    <Text size="2" style={{ color: "rgba(255, 100, 100, 0.9)" }}>
                        ⚠️ {localError || state.error?.message}
                    </Text>
                </div>
            )}

            {state.hash && !state.isPending && (
                <div
                    style={{
                        marginTop: "1rem",
                        padding: "0.75rem 1rem",
                        background: "rgba(50, 200, 100, 0.1)",
                        border: "1px solid rgba(50, 200, 100, 0.25)",
                        borderRadius: "10px",
                    }}
                >
                    <Text size="2" style={{ color: "rgba(100, 220, 150, 0.9)" }}>
                        ✅ Post created successfully!
                    </Text>
                </div>
            )}
        </Card>
    )
}

export default CreatePost
