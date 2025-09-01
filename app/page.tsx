"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "@/lib/firebase"
import Link from "next/link"

export default function LoginRootPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loggedIn = typeof window !== 'undefined' && localStorage.getItem("ps_logged_in") === "true"
    if (loggedIn) router.replace("/parking")
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setIsError(false)
    setMessage(null)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      localStorage.setItem("ps_logged_in", "true")
      localStorage.setItem("ps_user_email", userCredential.user.email || "")
      setMessage("Login successful! Redirecting...")
      setTimeout(() => router.push("/parking"), 500)
    } catch (error: any) {
      setIsError(true)
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setMessage("Invalid email or password")
      } else if (error.code === 'auth/invalid-email') {
        setMessage("Invalid email format")
      } else {
        setMessage("Login failed. Please try again.")
      }
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    setLoading(true)
    setIsError(false)
    setMessage(null)
    
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      localStorage.setItem("ps_logged_in", "true")
      localStorage.setItem("ps_user_email", result.user.email || "")
      setMessage("Google login successful! Redirecting...")
      setTimeout(() => router.push("/parking"), 500)
    } catch (error: any) {
      setIsError(true)
      if (error.code === 'auth/popup-closed-by-user') {
        setMessage("Login cancelled")
      } else if (error.code === 'auth/operation-not-allowed' || error.code === 'auth/configuration-not-found') {
        setMessage("Google sign-in not enabled. Enable it in Firebase Console → Authentication → Sign-in method.")
      } else {
        setMessage("Google login failed. Please try again.")
      }
    }
    setLoading(false)
  }

  const handleInstagram = () => {
    setIsError(false)
    setMessage("Instagram login coming soon.")
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 bg-card border rounded-xl p-6 shadow-sm">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="text-sm text-muted-foreground">Sign in with your account</p>
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

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
        </div>

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
          Create an account in Firebase Console to test
        </div>
      </div>
    </div>
  )
}
