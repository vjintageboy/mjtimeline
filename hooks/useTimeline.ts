"use client"

/**
 * IOTA Timeline Hook
 * Handles all interactions with the Timeline smart contract
 */

import { useState, useEffect, useCallback } from "react"
import {
    useCurrentAccount,
    useIotaClient,
    useSignAndExecuteTransaction,
} from "@iota/dapp-kit"
import { Transaction } from "@iota/iota-sdk/transactions"
import { useNetworkVariable } from "@/lib/config"
import { CLOCK_OBJECT_ID } from "@/lib/config"

// Contract configuration
const MODULE_NAME = "timeline"
const POLL_INTERVAL_MS = 4000

// Timeline Object ID - will be set after first timeline creation
// For now we'll store it in localStorage and URL hash
const TIMELINE_STORAGE_KEY = "mjtimeline_timeline_id"

export interface Post {
    id: number
    author: string
    content: string
    timestamp: number
}

export interface TimelineState {
    isLoading: boolean
    isPending: boolean
    error: Error | null
    hash: string | undefined
}

export const useTimeline = () => {
    const currentAccount = useCurrentAccount()
    const packageId = useNetworkVariable("packageId")
    const iotaClient = useIotaClient()
    const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction()

    const [timelineId, setTimelineId] = useState<string | null>(null)
    const [posts, setPosts] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isFetchingPosts, setIsFetchingPosts] = useState(false)
    const [hash, setHash] = useState<string | undefined>()
    const [error, setError] = useState<Error | null>(null)

    // Load timeline ID from localStorage on mount (not using URL hash to keep URL clean)
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedId = localStorage.getItem(TIMELINE_STORAGE_KEY)
            if (storedId) {
                setTimelineId(storedId)
            }
        }
    }, [])

    // Fetch posts when timeline ID changes
    const fetchPosts = useCallback(async () => {
        if (!timelineId) return

        let active = true

        try {
            setIsFetchingPosts(true)

            const result = await iotaClient.getObject({
                id: timelineId,
                options: { showContent: true },
            })

            if (!result.data || result.data.content?.dataType !== "moveObject") {
                // Timeline object not found - clear it
                console.warn("Timeline object not found, clearing stale ID:", timelineId)
                clearTimeline()
                throw new Error("Timeline object not found. Please create a new timeline.")
            }

            const fields = result.data.content.fields as any
            const postCount = parseInt(fields.post_count || "0", 10)

            console.log("📊 Timeline fields:", fields)
            console.log("📝 Post count:", postCount)

            // Fetch individual posts from the table
            const fetchedPosts: Post[] = []

            if (fields.posts) {
                // Try multiple shapes to get the table id; log when missing for easier debugging
                const tableId =
                    fields.posts?.fields?.id?.id ||
                    fields.posts?.fields?.id ||
                    fields.posts?.id ||
                    fields.posts?.objectId

                console.log("🗂️ Table ID:", tableId)

                if (!tableId) {
                    throw new Error("Cannot resolve posts table id from timeline object")
                }

                const dynamicFields = await iotaClient.getDynamicFields({ parentId: tableId })
                console.log("🔍 Dynamic fields count:", dynamicFields.data.length)

                for (const field of dynamicFields.data) {
                    try {
                        console.log("🔑 Field name structure:", JSON.stringify(field.name, null, 2))
                        
                        // For Table<u64, Post>, the key type is u64
                        const postData = await iotaClient.getObject({
                            id: field.objectId,
                            options: { showContent: true },
                        })

                        console.log("✅ Post data fetched:", postData.data?.objectId)

                        if (postData.data?.content?.dataType === "moveObject") {
                            const postFields = postData.data.content.fields as any
                            console.log("📄 Post fields:", postFields)
                            
                            // Dynamic field structure: {id: {...}, name: 'key', value: {type: '...', fields: {actual_data}}}
                            // The actual post data is in value.fields
                            const actualData = postFields.value?.fields || postFields.value
                            console.log("🔍 Actual data:", actualData)
                            
                            if (actualData && actualData.author && actualData.content) {
                                const postId = typeof field.name.value === 'string' 
                                    ? parseInt(field.name.value, 10) 
                                    : field.name.value
                                    
                                const newPost = {
                                    id: postId,
                                    author: actualData.author,
                                    content: actualData.content,
                                    timestamp: parseInt(actualData.timestamp || "0", 10),
                                }
                                console.log("✨ Adding post to array:", newPost)
                                fetchedPosts.push(newPost)
                            } else {
                                console.warn("⚠️ Post missing required fields. Full fields:", JSON.stringify(postFields, null, 2))
                            }
                        }
                    } catch (fieldError) {
                        console.error(`❌ Failed to fetch post for field ${JSON.stringify(field.name)}:`, fieldError)
                        // Continue to next field instead of failing completely
                    }
                }
            }

            fetchedPosts.sort((a, b) => b.id - a.id)
            console.log("📦 Final fetched posts array:", fetchedPosts)
            console.log("📊 Total posts fetched:", fetchedPosts.length)
            
            if (active) {
                setPosts(fetchedPosts)
                console.log("✅ Posts state updated!")
                setError(null)
            }
        } catch (err) {
            if (active) {
                console.error("Error fetching posts:", err)
                setError(err instanceof Error ? err : new Error(String(err)))
            }
        } finally {
            if (active) setIsFetchingPosts(false)
            active = false
        }
    }, [timelineId, iotaClient])

    // Fetch posts when timeline ID is available
    useEffect(() => {
        if (timelineId) {
            fetchPosts()
        }
    }, [timelineId])

    // Polling for updates so timeline stays fresh (disabled for now to prevent infinite loading)
    // useEffect(() => {
    //     if (!timelineId) return

    //     const interval = setInterval(() => {
    //         fetchPosts()
    //     }, POLL_INTERVAL_MS)

    //     return () => clearInterval(interval)
    // }, [timelineId])

    // Create a new timeline (one-time setup)
    const createTimeline = async () => {
        if (!packageId) {
            setError(new Error("Package ID not configured"))
            setHash(undefined)
            return
        }

        try {
            setIsLoading(true)
            setError(null)
            setHash(undefined)

            const tx = new Transaction()
            tx.moveCall({
                target: `${packageId}::${MODULE_NAME}::create_timeline`,
                arguments: [],
                typeArguments: [],
            })

            signAndExecute(
                { transaction: tx },
                {
                    onSuccess: async ({ digest }) => {
                        setHash(digest)
                        try {
                            const { effects } = await iotaClient.waitForTransaction({
                                digest,
                                options: { showEffects: true },
                            })

                            // Find the created shared object
                            const created = effects?.created?.find(
                                (obj) => obj.owner && typeof obj.owner === "object" && "Shared" in obj.owner
                            )

                            if (created) {
                                const newTimelineId = created.reference.objectId
                                setTimelineId(newTimelineId)
                                if (typeof window !== "undefined") {
                                    localStorage.setItem(TIMELINE_STORAGE_KEY, newTimelineId)
                                    // Don't update URL hash to keep URL clean
                                }
                            }
                        } catch (waitErr) {
                            console.error("Error waiting for transaction:", waitErr)
                        }
                        setIsLoading(false)
                    },
                    onError: (err) => {
                        setHash(undefined)
                        setError(err instanceof Error ? err : new Error(String(err)))
                        setIsLoading(false)
                    },
                }
            )
        } catch (err) {
            setHash(undefined)
            setError(err instanceof Error ? err : new Error(String(err)))
            setIsLoading(false)
        }
    }

    // Create a new post
    const createPost = async (content: string) => {
        if (!packageId || !timelineId) {
            setError(new Error("Timeline not initialized"))
            setHash(undefined)
            return
        }

        if (!content.trim()) {
            setError(new Error("Content cannot be empty"))
            return
        }

        try {
            setIsLoading(true)
            setError(null)
            setHash(undefined)

            const tx = new Transaction()
            tx.moveCall({
                target: `${packageId}::${MODULE_NAME}::create_post`,
                arguments: [
                    tx.object(timelineId),
                    tx.pure.string(content),
                    tx.object(CLOCK_OBJECT_ID),
                ],
            })

            signAndExecute(
                { transaction: tx },
                {
                    onSuccess: async ({ digest }) => {
                        setHash(digest)
                        await iotaClient.waitForTransaction({ digest })
                        // Add a small delay to ensure the transaction is fully committed
                        await new Promise(resolve => setTimeout(resolve, 1000))
                        await fetchPosts()
                        setIsLoading(false)
                    },
                    onError: (err) => {
                        setHash(undefined)
                        setError(err instanceof Error ? err : new Error(String(err)))
                        setIsLoading(false)
                    },
                }
            )
        } catch (err) {
            setHash(undefined)
            setError(err instanceof Error ? err : new Error(String(err)))
            setIsLoading(false)
        }
    }

    // Clear timeline (for testing/reset)
    const clearTimeline = () => {
        setTimelineId(null)
        setPosts([])
        if (typeof window !== "undefined") {
            localStorage.removeItem(TIMELINE_STORAGE_KEY)
            // URL hash removed - keep URL clean
        }
    }

    const state: TimelineState = {
        isLoading: isLoading || isPending,
        isPending,
        error,
        hash,
    }

    return {
        timelineId,
        posts,
        isFetchingPosts,
        state,
        isConnected: !!currentAccount,
        actions: {
            createTimeline,
            createPost,
            fetchPosts,
            clearTimeline,
        },
    }
}
