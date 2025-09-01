"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setIsError(false)
    setMessage(null)

    if (email === "gogo@gmail.com" && password === "12345") {
      setMessage("Login successful! Redirecting...")
      setTimeout(() => router.push("/parking"), 700)
    } else {
      setIsError(true)
      setMessage("Invalid email or password")
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    setLoading(true)
    try {
      await signIn("google", { callbackUrl: "/parking" })
    } catch (err) {
      setIsError(true)
      setMessage("Google sign-in is not configured.")
      setLoading(false)
    }
  }

  const handleInstagram = () => {
    setIsError(false)
    setMessage("Instagram login coming soon")
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 bg-card border rounded-xl p-6 shadow-sm">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="text-sm text-muted-foreground">Use demo credentials or Google</p>
        </div>

        {message ? (
          <div className={`text-sm ${isError ? "text-destructive" : "text-green-600"}`}>{message}</div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none md:text-sm"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input
              className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none md:text-sm"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <div className="h-px bg-border w-full" />
          <span className="text-xs text-muted-foreground">OR</span>
          <div className="h-px bg-border w-full" />
        </div>

        <div className="space-y-2">
          <Button variant="outline" className="w-full" onClick={handleGoogle} disabled={loading}>
            Login with Google
          </Button>
          <Button variant="outline" className="w-full" onClick={handleInstagram} disabled={loading}>
            Login with Instagram
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          Demo: <code>gogo@gmail.com</code> / <code>12345</code>
        </div>
      </div>
    </div>
  )
}

