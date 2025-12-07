// Copyright (c) Mysten Labs, Inc.
// Modifications Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

/// This example demonstrates a basic use of a shared object.
/// Rules:
/// - anyone can create and share a counter
/// - everyone can increment a counter by 1
/// - the owner of the counter can reset it to any value
module mjtimeline::timeline {
    use std::string::{String};
    use iota::table::{Self, Table};
    use iota::event;
    use iota::object::{Self, UID};
    use iota::transfer;
    use iota::tx_context::{Self, TxContext};

    /// The timeline object. managed as a shared object.
    public struct Timeline has key {
        id: UID,
        /// Tests often want to clear/reset, but for a real timeline we might not want an owner.
        /// We'll keep it simple for now and just allow anyone to add posts.
        posts: Table<u64, Post>,
        post_count: u64
    }

    /// A struct representing a single post on the timeline
    public struct Post has store, drop, copy {
        author: address,
        content: String,
        timestamp: u64,
    }

    /// Event emitted when a new post is created
    public struct PostCreated has copy, drop {
        id: u64,
        author: address,
        content: String,
        timestamp: u64
    }

    /// Create and share the Timeline object.
    /// This should likely be called once on deployment or initialization.
    public fun create_timeline(ctx: &mut TxContext) {
        transfer::share_object(Timeline {
            id: object::new(ctx),
            posts: table::new(ctx),
            post_count: 0
        })
    }

    /// Create a new post and add it to the timeline.
    public fun create_post(
        timeline: &mut Timeline,
        content: String,
        clock: &iota::clock::Clock,
        ctx: &mut TxContext
    ) {
        let post_id = timeline.post_count;
        let diff_author = ctx.sender();
        let timestamp = iota::clock::timestamp_ms(clock);
        
        let new_post = Post {
            author: diff_author,
            content,
            timestamp
        };

        table::add(&mut timeline.posts, post_id, new_post);
        timeline.post_count = timeline.post_count + 1;

        event::emit(PostCreated {
            id: post_id,
            author: diff_author,
            content,
            timestamp
        });
    }

    /// Getter to read a post (primarily for on-chain calls, though indexers use events)
    public fun get_post(timeline: &Timeline, id: u64): &Post {
        &timeline.posts[id]
    }
    
    /// Get the total number of posts
    public fun get_post_count(timeline: &Timeline): u64 {
        timeline.post_count
    }
}

