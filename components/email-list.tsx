"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import { fetchEmails, type ProcessedEmail } from "@/lib/gmail"

interface EmailListProps {
  onSelectEmail: (email: ProcessedEmail) => void
  filterType?: "phishing" | "safe" | "all"
}

export function EmailList({ onSelectEmail, filterType = "all" }: EmailListProps) {
  const [emails, setEmails] = useState<ProcessedEmail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadEmails() {
      try {
        setLoading(true)
        setError(null)

        // Fetch emails from Gmail API
        const fetchedEmails = await fetchEmails(50)

        // Filter emails based on the selected filter
        let filteredEmails = [...fetchedEmails]

        if (filterType === "phishing") {
          filteredEmails = filteredEmails.filter((email) => email.isPhishing)
        } else if (filterType === "safe") {
          filteredEmails = filteredEmails.filter((email) => !email.isPhishing)
        }

        setEmails(filteredEmails)
      } catch (err) {
        console.error("Failed to load emails:", err)
        setError("Failed to load emails. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadEmails()
  }, [filterType])

  if (loading) {
    return (
      <Card className="p-8 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-2" />
        <p className="text-gray-500">Loading emails...</p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
        <p className="text-gray-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          Retry
        </button>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {emails.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No emails found</p>
        </Card>
      ) : (
        emails.map((email) => (
          <Card
            key={email.id}
            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${!email.isRead ? "border-l-4 border-l-green-600" : ""}`}
            onClick={() => onSelectEmail(email)}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{email.from}</span>
                  {email.isPhishing ? (
                    <div className="flex items-center gap-1 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Phishing ({email.confidence}%)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                      <CheckCircle className="h-3 w-3" />
                      <span>Safe ({email.confidence}%)</span>
                    </div>
                  )}
                </div>
                <div className="font-medium">{email.subject}</div>
                <div className="text-sm text-gray-500 line-clamp-1">{email.preview}</div>
              </div>
              <div className="text-xs text-gray-500">{email.date}</div>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
