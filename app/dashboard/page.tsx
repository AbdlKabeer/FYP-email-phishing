"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Mail, AlertTriangle, LogOut, Inbox, Trash, Settings, Loader2 } from "lucide-react"
import { connectToGmail, type ProcessedEmail } from "@/lib/gmail"
import { EmailList } from "@/components/email-list"
import { EmailDetail } from "@/components/email-detail"
import { StatsCards } from "@/components/stats-cards"

export default function Dashboard() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEmail, setSelectedEmail] = useState<ProcessedEmail | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is already connected
    async function checkConnection() {
      try {
        setIsLoading(true)

        // Check for existing tokens in cookies
        const response = await fetch("/api/auth/status")
        const data = await response.json()

        if (data.isAuthenticated) {
          setIsConnected(true)
          setUserEmail(data.email || "user@gmail.com") // Fallback if email not available
        }
      } catch (error) {
        console.error("Failed to check authentication status:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkConnection()
  }, [])

  const handleConnect = async () => {
    try {
      await connectToGmail()
      // The page will redirect to Google OAuth, so no need to update state here
    } catch (error) {
      console.error("Failed to connect to Gmail:", error)
    }
  }

  const handleDisconnect = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setIsConnected(false)
      setUserEmail(null)
    } catch (error) {
      console.error("Failed to disconnect:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="border-b">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Shield className="h-6 w-6 text-green-600" />
              <span>PhishGuard</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 container py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-medium">Loading your dashboard...</h2>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Shield className="h-6 w-6 text-green-600" />
            <span>PhishGuard</span>
          </Link>
          {isConnected && userEmail && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">{userEmail}</span>
              <Button variant="ghost" size="sm" onClick={handleDisconnect}>
                <LogOut className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </div>
          )}
        </div>
      </header>
      <main className="flex-1 container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center h-[70vh] max-w-md mx-auto text-center">
            <Shield className="h-16 w-16 text-green-600 mb-6" />
            <h1 className="text-2xl font-bold mb-2">Connect Your Gmail Account</h1>
            <p className="text-gray-500 mb-6">
              Connect your Gmail account to start scanning for phishing emails. We use secure OAuth and never store your
              password.
            </p>
            <Button onClick={handleConnect} size="lg" className="bg-green-600 hover:bg-green-700">
              <Mail className="h-5 w-5 mr-2" />
              Connect Gmail
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <StatsCards />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-6">
                {/* <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Email Folders</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-1 p-2">
                      <Button variant="ghost" className="w-full justify-start" size="sm">
                        <Inbox className="h-4 w-4 mr-2" />
                        Inbox
                        <span className="ml-auto bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs">124</span>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start" size="sm">
                        <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                        Phishing
                        <span className="ml-auto bg-red-100 text-red-600 rounded-full px-2 py-0.5 text-xs">7</span>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start" size="sm">
                        <Trash className="h-4 w-4 mr-2" />
                        Trash
                      </Button>
                    </div>
                  </CardContent>
                </Card> */}

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Detection Settings</CardTitle>
                    <CardDescription>Customize the decision tree algorithm</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Sensitivity Level</span>
                          <span className="text-sm text-green-600 font-medium">Medium</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div className="h-full w-1/2 bg-green-600 rounded-full"></div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Link href="/settings">
                          <Button variant="outline" size="sm" className="w-full">
                            <Settings className="h-4 w-4 mr-2" />
                            Advanced Settings
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-2">
                <Tabs defaultValue="all">
                  <div className="flex items-center justify-between mb-4">
                    <TabsList>
                      <TabsTrigger value="all">All Emails</TabsTrigger>
                      <TabsTrigger value="phishing">Phishing</TabsTrigger>
                      <TabsTrigger value="safe">Safe</TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                        Refresh
                      </Button>
                    </div>
                  </div>

                  <TabsContent value="all" className="m-0">
                    {selectedEmail ? (
                      <EmailDetail email={selectedEmail} onBack={() => setSelectedEmail(null)} />
                    ) : (
                      <EmailList onSelectEmail={setSelectedEmail} />
                    )}
                  </TabsContent>

                  <TabsContent value="phishing" className="m-0">
                    {selectedEmail ? (
                      <EmailDetail email={selectedEmail} onBack={() => setSelectedEmail(null)} />
                    ) : (
                      <EmailList onSelectEmail={setSelectedEmail} filterType="phishing" />
                    )}
                  </TabsContent>

                  <TabsContent value="safe" className="m-0">
                    {selectedEmail ? (
                      <EmailDetail email={selectedEmail} onBack={() => setSelectedEmail(null)} />
                    ) : (
                      <EmailList onSelectEmail={setSelectedEmail} filterType="safe" />
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
