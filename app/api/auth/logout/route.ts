import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Create response to clear cookies
    const response = NextResponse.json({ success: true })

    // Clear the auth cookies
    response.cookies.delete("gmail_access_token")
    response.cookies.delete("gmail_refresh_token")

    return response
  } catch (error) {
    console.error("Error logging out:", error)
    return NextResponse.json({ error: "Failed to log out" }, { status: 500 })
  }
}
