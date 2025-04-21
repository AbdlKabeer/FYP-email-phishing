import { type NextRequest, NextResponse } from "next/server"
import { getGmailAccessToken } from "@/lib/auth-utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const emailId = params.id

    if (!emailId) {
      return NextResponse.json({ error: "Email ID is required" }, { status: 400 })
    }

    // Get access token from cookies or refresh if needed
    const accessToken = await getGmailAccessToken(request)

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Fetch email from Gmail API
    const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailId}?format=full`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Gmail API error:", errorData)
      return NextResponse.json({ error: "Failed to fetch email" }, { status: response.status })
    }

    const email = await response.json()

    return NextResponse.json({ email })
  } catch (error) {
    console.error("Error fetching email:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
