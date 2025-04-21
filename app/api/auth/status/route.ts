import { type NextRequest, NextResponse } from "next/server"
import { getGmailAccessToken } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    // Check if user has a valid access token
    const accessToken = await getGmailAccessToken(request)

    if (!accessToken) {
      return NextResponse.json({ isAuthenticated: false })
    }

    // Get user email from Google API
    try {
      const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json({
          isAuthenticated: true,
          email: data.email,
        })
      }
    } catch (error) {
      console.error("Error fetching user info:", error)
    }

    // If we couldn't get the email but have a token, still return authenticated
    return NextResponse.json({ isAuthenticated: true })
  } catch (error) {
    console.error("Error checking auth status:", error)
    return NextResponse.json({ isAuthenticated: false })
  }
}
