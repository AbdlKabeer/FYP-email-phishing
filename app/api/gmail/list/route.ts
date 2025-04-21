import { type NextRequest, NextResponse } from "next/server"
import { getGmailAccessToken } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    // Get access token from cookies or refresh if needed
    const accessToken = await getGmailAccessToken(request)

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const maxResults = searchParams.get("maxResults") || "20"
    const query = searchParams.get("q") || ""

    // Fetch emails from Gmail API
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}${query ? `&q=${encodeURIComponent(query)}` : ""}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Gmail API error:", errorData)
      return NextResponse.json({ error: "Failed to fetch emails" }, { status: response.status })
    }

    const data = await response.json()

    // If no messages, return empty array
    if (!data.messages || data.messages.length === 0) {
      return NextResponse.json({ emails: [] })
    }

    // Fetch details for each email
    const emailPromises = data.messages.map(async (message: { id: string }) => {
      const emailResponse = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!emailResponse.ok) {
        console.error(`Failed to fetch email ${message.id}`)
        return null
      }

      return emailResponse.json()
    })

    const emails = (await Promise.all(emailPromises)).filter(Boolean)

    return NextResponse.json({ emails })
  } catch (error) {
    console.error("Error fetching emails:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
