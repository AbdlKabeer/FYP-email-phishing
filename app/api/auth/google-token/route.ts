import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Authorization code is required" }, { status: 400 })
    }

    // Exchange the authorization code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        // redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/google`,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        // redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        grant_type: "authorization_code",
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error("Google token exchange error:", errorData)
      return NextResponse.json({ error: "Failed to exchange code for tokens" }, { status: 400 })
    }

    const tokenData = await tokenResponse.json()

    // Store tokens in a secure HTTP-only cookie
    // In a real app, you'd want to encrypt these and possibly store in a database
    const response = NextResponse.json({ success: true })

    // Set secure HTTP-only cookies
    response.cookies.set({
      name: "gmail_access_token",
      value: tokenData.access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: tokenData.expires_in,
      path: "/",
    })

    if (tokenData.refresh_token) {
      response.cookies.set({
        name: "gmail_refresh_token",
        value: tokenData.refresh_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        // Refresh tokens don't expire unless revoked
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      })
    }

    return response
  } catch (error) {
    console.error("Error in Google token exchange:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
