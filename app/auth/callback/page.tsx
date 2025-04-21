"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { exchangeCodeForTokens } from "@/lib/gmail"
import { Shield } from "lucide-react"

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    async function handleCallback() {
      try {
        const code = searchParams.get("code")
        const error = searchParams.get("error")

        if (error) {
          setStatus("error")
          setErrorMessage(`Authentication failed: ${error}`)
          return
        }

        if (!code) {
          setStatus("error")
          setErrorMessage("No authorization code received")
          return
        }

        // Exchange the code for tokens
        await exchangeCodeForTokens(code)

        setStatus("success")

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } catch (error) {
        console.error("Error in auth callback:", error)
        setStatus("error")
        setErrorMessage("Failed to complete authentication")
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <Shield
          className={`h-16 w-16 mx-auto mb-6 ${status === "success" ? "text-green-600" : status === "error" ? "text-red-600" : "text-gray-400"}`}
        />

        {status === "loading" && (
          <>
            <h1 className="text-2xl font-bold mb-2">Connecting to Gmail</h1>
            <p className="text-gray-500 mb-4">Please wait while we complete the authentication process...</p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold mb-2">Successfully Connected!</h1>
            <p className="text-gray-500 mb-4">Your Gmail account has been connected to PhishGuard.</p>
            <p className="text-sm text-gray-400">Redirecting to dashboard...</p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold mb-2">Authentication Failed</h1>
            <p className="text-red-500 mb-4">{errorMessage}</p>
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Return to Home
            </button>
          </>
        )}
      </div>
    </div>
  )
}
