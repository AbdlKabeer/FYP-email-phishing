import { analyzeEmailWithDecisionTree } from "./decision-tree"

// Constants for Gmail API
const GMAIL_API_BASE = "https://gmail.googleapis.com/gmail/v1/users/me"
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly", "https://www.googleapis.com/auth/gmail.modify"]

// Types
export interface GmailEmail {
  id: string
  threadId: string
  labelIds: string[]
  snippet: string
  payload: {
    headers: { name: string; value: string }[]
    parts?: {
      mimeType: string
      body: {
        data?: string
      }
    }[]
    body?: {
      data?: string
    }
  }
  internalDate: string
}

export interface ProcessedEmail {
  id: string
  threadId: string
  from: string
  subject: string
  preview: string
  date: string
  isRead: boolean
  body: string
  isPhishing: boolean
  confidence: number
  reasons: string[]
}

// OAuth connection to Gmail
export async function connectToGmail() {
  try {
    // Create OAuth client
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      window.location.origin + "/auth/callback",
    )}&response_type=code&scope=${encodeURIComponent(SCOPES.join(" "))}&access_type=offline&prompt=consent`

    // Redirect to Google's OAuth page
    window.location.href = authUrl

    // This function will return after the redirect, but the page will reload
    // The actual token handling will happen in the callback route
    return Promise.resolve()
  } catch (error) {
    console.error("Failed to connect to Gmail:", error)
    throw error
  }
}

// Exchange authorization code for tokens
export async function exchangeCodeForTokens(code: string) {
  try {
    const response = await fetch("/api/auth/google-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    })

    if (!response.ok) {
      throw new Error("Failed to exchange code for tokens")
    }

    return await response.json()
  } catch (error) {
    console.error("Error exchanging code for tokens:", error)
    throw error
  }
}

// Fetch emails from Gmail API
export async function fetchEmails(maxResults = 20) {
  try {
    const response = await fetch(`/api/gmail/list?maxResults=${maxResults}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch emails")
    }

    const data = await response.json()
    return processEmails(data.emails)
  } catch (error) {
    console.error("Error fetching emails:", error)
    throw error
  }
}

// Fetch a single email by ID
export async function fetchEmailById(emailId: string) {
  try {
    const response = await fetch(`/api/gmail/email/${emailId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch email")
    }

    const data = await response.json()
    return processEmail(data.email)
  } catch (error) {
    console.error("Error fetching email:", error)
    throw error
  }
}

// Process emails from Gmail API format to our app format
function processEmails(emails: GmailEmail[]): ProcessedEmail[] {
  return emails.map(processEmail)
}

// Process a single email
function processEmail(email: GmailEmail): ProcessedEmail {
  // Extract headers
  const headers = email.payload.headers
  const from = headers.find((h) => h.name.toLowerCase() === "from")?.value || "Unknown Sender"
  const subject = headers.find((h) => h.name.toLowerCase() === "subject")?.value || "No Subject"

  // Extract body
  let body = ""
  if (email.payload.body?.data) {
    body = decodeBase64Url(email.payload.body.data)
  } else if (email.payload.parts) {
    const textPart = email.payload.parts.find((part) => part.mimeType === "text/plain")
    if (textPart?.body?.data) {
      body = decodeBase64Url(textPart.body.data)
    }
  }

  // Format date
  const date = new Date(Number.parseInt(email.internalDate))
  const formattedDate = formatDate(date)

  // Check if email is read
  const isRead = !email.labelIds.includes("UNREAD")

  // Analyze email for phishing
  const { isPhishing, confidence, reasons } = analyzeEmail(from, subject, body)

  return {
    id: email.id,
    threadId: email.threadId,
    from,
    subject,
    preview: email.snippet,
    date: formattedDate,
    isRead,
    body,
    isPhishing,
    confidence,
    reasons,
  }
}

// Helper function to decode base64url to text
function decodeBase64Url(data: string): string {
  const base64 = data.replace(/-/g, "+").replace(/_/g, "/")
  try {
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )
  } catch (e) {
    return atob(base64)
  }
}

// Format date for display
function formatDate(date: Date): string {
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === now.toDateString()) {
    return `Today, ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
  } else {
    return date.toLocaleDateString([], { month: "short", day: "numeric" })
  }
}

// Analyze email for phishing indicators
function analyzeEmail(from: string, subject: string, body: string) {
  // Extract features for the decision tree
  const features = extractFeatures(from, subject, body)

  // Run the decision tree algorithm
  return analyzeEmailWithDecisionTree(features)
}

// Extract features from email for analysis
function extractFeatures(from: string, subject: string, body: string) {
  // Extract domain from sender
  const domainMatch = from.match(/@([^>]*)/)
  const senderDomain = domainMatch ? domainMatch[1] : ""

  // Check for urgent language
  const urgentWords = [
    "urgent",
    "immediately",
    "alert",
    "attention",
    "important",
    "action required",
    "verify",
    "suspended",
  ]
  const hasUrgentLanguage = urgentWords.some(
    (word) => subject.toLowerCase().includes(word) || body.toLowerCase().includes(word),
  )

  // Check for sensitive information requests
  const sensitiveRequests = [
    "password",
    "credit card",
    "social security",
    "ssn",
    "account",
    "login",
    "verify your",
    "confirm your",
  ]
  const containsSensitiveRequests = sensitiveRequests.some((phrase) => body.toLowerCase().includes(phrase))

  // Check for suspicious links
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const urls = body.match(urlRegex) || []
  const hasSuspiciousLinks = urls.some((url) => isSuspiciousUrl(url))

  // Check for misspellings (simplified)
  const commonlyMisspelledBrands = ["paypal", "amazon", "microsoft", "apple", "google", "facebook"]
  const hasMisspellings = commonlyMisspelledBrands.some((brand) => {
    const regex = new RegExp(brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/[aeiou]/g, "[a-z0-9]"), "i")
    return regex.test(senderDomain) && !senderDomain.toLowerCase().includes(brand.toLowerCase())
  })

  // Check for attachments (simplified)
  const hasAttachments = body.includes("attachment") || body.includes("attached")

  // In a real implementation, we would parse the email to find actual attachments
  const attachmentTypes: string[] = []

  return {
    senderDomain,
    hasUrgentLanguage,
    containsSensitiveRequests,
    hasSuspiciousLinks,
    hasMisspellings,
    hasAttachments,
    attachmentTypes,
  }
}

// Check if a URL is suspicious
function isSuspiciousUrl(url: string): boolean {
  // Check for IP addresses instead of domain names
  if (/https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url)) {
    return true
  }

  // Check for URL shorteners (simplified)
  const shorteners = ["bit.ly", "tinyurl.com", "goo.gl", "t.co", "is.gd"]
  if (shorteners.some((shortener) => url.includes(shortener))) {
    return true
  }

  // Check for misleading domains (simplified)
  const legitimateDomains = ["paypal.com", "amazon.com", "microsoft.com", "apple.com", "google.com", "facebook.com"]
  return legitimateDomains.some((domain) => {
    const domainWithoutDot = domain.replace(".", "")
    return url.includes(domainWithoutDot) && !url.includes(domain)
  })
}
