import { WalletConnect } from "@/components/Wallet-connect"
import Timeline from "@/components/Timeline"
import CreatePost from "@/components/CreatePost"

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0a0a12 0%, #12121f 50%, #0a0a12 100%)",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          borderBottom: "1px solid rgba(100, 100, 255, 0.1)",
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(10, 10, 18, 0.8)",
        }}
      >
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
          }}
        >
          📰 MJ Timeline
        </h1>
        <WalletConnect />
      </header>

      {/* Main Content */}
      <main
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding: "2rem 1rem",
        }}
      >
        <CreatePost />
        <Timeline />
      </main>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "2rem",
          color: "rgba(120, 120, 140, 0.6)",
          fontSize: "0.85rem",
        }}
      >
        Powered by IOTA Move • Micro-Journalism Timeline
      </footer>
    </div>
  )
}
