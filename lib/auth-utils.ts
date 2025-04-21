import type { NextRequest } from "next/server"

// Get Gmail access token from cookies, refresh if needed
export async function getGmailAccessToken(request: NextRequest): Promise<string | null> {
  // Get access token from cookies
  const accessToken = request.cookies.get("gmail_access_token")?.value

  if (accessToken) {
    return accessToken
  }

  // If no access token, try to refresh
  const refreshToken = request.cookies.get("gmail_refresh_token")?.value

  if (!refreshToken) {
    return null
  }

  try {
    // Refresh the token
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    })

    if (!response.ok) {
      console.error("Failed to refresh token")
      return null
    }

    const data = await response.json()

    // Return the new access token
    return data.access_token
  } catch (error) {
    console.error("Error refreshing token:", error)
    return null
  }
}

// Check if user is authenticated
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const accessToken = await getGmailAccessToken(request)
  return !!accessToken
}
