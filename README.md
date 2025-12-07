# 📰 MJ Timeline

A decentralized micro-journalism timeline built on the IOTA blockchain. Share your thoughts, stories, and updates in a censorship-resistant, transparent, and community-driven platform.

[![Built with Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![IOTA dApp Kit](https://img.shields.io/badge/IOTA-dApp_Kit-blue?style=flat)](https://github.com/iotaledger/dapp-kit)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 What is MJ Timeline?

MJ Timeline is a decentralized social timeline application where anyone can create and share posts stored permanently on the IOTA blockchain. Think of it as a Web3-powered micro-blogging platform where:

- **Your posts are immutable** - Once published, they live forever on the blockchain
- **No central authority** - No one can censor or delete your content
- **Transparent and verifiable** - Every post is cryptographically signed and timestamped
- **User-owned** - You control your timeline through your IOTA wallet

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- [IOTA Wallet](https://wiki.iota.org/iota-sandbox/welcome/) browser extension
- Basic understanding of blockchain and Web3 concepts

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mjtimeline.git
   cd mjtimeline
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Deploy the smart contract**
   ```bash
   npm run iota-deploy
   ```
   This will:
   - Compile the Move smart contract
   - Deploy it to IOTA Devnet
   - Automatically update your configuration with the package ID

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### First Steps

1. **Connect Your Wallet** - Click the "Connect Wallet" button in the header
2. **Initialize Timeline** - Click "Initialize Timeline" to create your shared timeline object
3. **Create a Post** - Type your message (3-500 characters) and click "Post"
4. **View Timeline** - See your post appear in the timeline below

## 📖 Usage Examples

### Creating Your First Post

```typescript
// The useTimeline hook handles all blockchain interactions
const { timelineId, actions } = useTimeline()

// Create a post (automatically signed with your wallet)
await actions.createPost("Hello, decentralized world! 🌍")
```

### Reading Posts

```typescript
const { posts, isFetchingPosts } = useTimeline()

// Posts are automatically fetched and sorted by timestamp
posts.forEach(post => {
  console.log(post.content)      // Post content
  console.log(post.author)       // Author's wallet address
  console.log(post.timestamp)    // Unix timestamp
})
```

## 🏗️ Project Structure

```
mjtimeline/
├── app/                      # Next.js app router pages
│   ├── layout.tsx           # Root layout with IOTA provider
│   ├── page.tsx             # Main timeline page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── CreatePost.tsx      # Post creation form
│   ├── Timeline.tsx        # Timeline display
│   ├── Wallet-connect.tsx  # Wallet connection UI
│   └── Provider.tsx        # IOTA dApp Kit provider
├── contract/               # Move smart contracts
│   └── mjtimeline/
│       └── sources/
│           └── mjtimeline.move  # Timeline contract
├── hooks/                  # Custom React hooks
│   └── useTimeline.ts     # Timeline interaction hook
├── lib/                   # Configuration and utilities
│   └── config.ts         # Network and package config
└── scripts/              # Build and deployment scripts
    └── iota-deploy-wrapper.js
```

## 🔧 Technology Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component library
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS

### Blockchain
- **[IOTA SDK](https://github.com/iotaledger/iota)** - Blockchain interaction
- **[IOTA dApp Kit](https://github.com/iotaledger/dapp-kit)** - Wallet integration
- **[Move](https://move-language.github.io/move/)** - Smart contract language
- **[@tanstack/react-query](https://tanstack.com/query)** - Data fetching and caching

## 📝 Smart Contract Overview

The `mjtimeline` Move module provides:

```move
// Create a shared timeline (one-time setup)
public fun create_timeline(ctx: &mut TxContext)

// Add a new post to the timeline
public fun create_post(
    timeline: &mut Timeline,
    content: String,
    clock: &iota::clock::Clock,
    ctx: &mut TxContext
)

// Read timeline data
public fun get_post_count(timeline: &Timeline): u64
public fun get_post(timeline: &Timeline, id: u64): &Post
```

### Smart Contract Address (Devnet)
- **[Contract Address](https://explorer.iota.org/object/0xf3e3d5af37d5b81886e7c2fe41ec471e2b7f8e3555a05602675f3a8699cd0e23?network=devnet)**

### Data Structures

- **Timeline** - Shared object containing all posts in a Table
- **Post** - Individual post with author, content, and timestamp
- **PostCreated** - Event emitted when a post is created

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build production bundle |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |
| `npm run iota-deploy` | Deploy Move contract to IOTA network |

## 🌐 Network Configuration

The app supports multiple IOTA networks. Edit `lib/config.ts` to configure:

```typescript
export const DEVNET_PACKAGE_ID = "0x..." // Auto-filled after deployment
export const TESTNET_PACKAGE_ID = ""     // Add manually for testnet
export const MAINNET_PACKAGE_ID = ""     // Add manually for mainnet
```

## 🔍 Troubleshooting

### Posts Not Showing After Creation
- Wait 1-2 seconds for blockchain confirmation
- Check browser console for errors
- Ensure you've initialized the timeline first

### Wallet Connection Issues
- Install [IOTA Wallet extension](https://wiki.iota.org/iota-sandbox/welcome/)
- Switch to IOTA Devnet in wallet settings
- Ensure you have test IOTA tokens (request from faucet)

### Contract Deployment Fails
- Check you have IOTA CLI installed
- Ensure you're connected to the correct network
- Verify your wallet has sufficient balance

## 📚 Learn More

- **[IOTA Documentation](https://wiki.iota.org/)** - Official IOTA docs
- **[Move Language Book](https://move-language.github.io/move/)** - Learn Move programming
- **[IOTA dApp Kit Guide](https://github.com/iotaledger/dapp-kit)** - Integration guide
- **[Next.js Docs](https://nextjs.org/docs)** - Next.js features and API
- **[INSTRUCTION_GUIDE.md](./INSTRUCTION_GUIDE.md)** - Detailed setup instructions

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Keep commits atomic and well-described


**Ready to build the future of decentralized journalism?** Get started now! 🚀
