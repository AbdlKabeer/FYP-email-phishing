"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ArrowLeft, AlertTriangle, CheckCircle, Flag, Trash, Loader2 } from "lucide-react"
import { fetchEmailById, type ProcessedEmail } from "@/lib/gmail"

interface EmailDetailProps {
  email: ProcessedEmail
  onBack: () => void
}

export function EmailDetail({ email, onBack }: EmailDetailProps) {
  const [fullEmail, setFullEmail] = useState<ProcessedEmail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadFullEmail() {
      try {
        setLoading(true)
        setError(null)

        // If we already have the full email content, use it
        if (email.body && email.body.length > 0) {
          setFullEmail(email)
          setLoading(false)
          return
        }

        // Otherwise fetch the full email content
        const fetchedEmail = await fetchEmailById(email.id)
        setFullEmail(fetchedEmail)
      } catch (err) {
        console.error("Failed to load full email:", err)
        setError("Failed to load the complete email. Please try again.")
        // Use the preview version as fallback
        setFullEmail(email)
      } finally {
        setLoading(false)
      }
    }

    loadFullEmail()
  }, [email])

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2 border-b">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-8 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-2" />
          <p className="text-gray-500">Loading email content...</p>
        </CardContent>
      </Card>
    )
  }

  const displayEmail = fullEmail || email
  const bodyContent = displayEmail.body || displayEmail.preview

  return (
    <Card>
      <CardHeader className="pb-2 border-b">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Flag className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="font-medium">{displayEmail.subject}</div>
              <div className="text-sm text-gray-500">{displayEmail.date}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                From: <span className="font-medium">{displayEmail.from}</span>
              </div>
              {displayEmail.isPhishing ? (
                <div className="flex items-center gap-1 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Phishing Detected ({displayEmail.confidence}% confidence)</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                  <CheckCircle className="h-3 w-3" />
                  <span>Safe Email ({displayEmail.confidence}% confidence)</span>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="p-2 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-700">{error}</div>
          )}

          <div className="border-t pt-4">
            <div className="whitespace-pre-line text-sm">{bodyContent}</div>
          </div>
        </div>
      </CardContent>
      {displayEmail.isPhishing && displayEmail.reasons && displayEmail.reasons.length > 0 && (
        <CardFooter className="bg-red-50 border-t">
          <div className="space-y-2 w-full">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-medium text-red-600">Why we think this is a phishing email:</span>
            </div>
            <ul className="text-sm space-y-1 text-red-600 pl-7 list-disc">
              {displayEmail.reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
