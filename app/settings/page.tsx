"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Shield, ArrowLeft, Save } from "lucide-react"

export default function SettingsPage() {
  const [sensitivity, setSensitivity] = useState(50)

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
      <main className="flex-1 container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold ml-4">Settings</h1>
        </div>

        <Tabs defaultValue="detection">
          <TabsList className="mb-6">
            <TabsTrigger value="detection">Detection Settings</TabsTrigger>
            <TabsTrigger value="account">Account Settings</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="detection" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Decision Tree Algorithm Settings</CardTitle>
                <CardDescription>Customize how the phishing detection algorithm works</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sensitivity">Detection Sensitivity</Label>
                    <span className="text-sm font-medium">
                      {sensitivity < 33 ? "Low" : sensitivity < 66 ? "Medium" : "High"} ({sensitivity}%)
                    </span>
                  </div>
                  <Slider
                    id="sensitivity"
                    min={0}
                    max={100}
                    step={1}
                    value={[sensitivity]}
                    onValueChange={(value) => setSensitivity(value[0])}
                  />
                  <p className="text-xs text-gray-500">
                    Higher sensitivity may result in more false positives but fewer missed phishing attempts.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-medium">Detection Features</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="domain-check" className="text-sm font-medium">
                          Suspicious Domain Check
                        </Label>
                        <p className="text-xs text-gray-500">
                          Detect lookalike domains that mimic legitimate companies
                        </p>
                      </div>
                      <Switch id="domain-check" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="link-check" className="text-sm font-medium">
                          Suspicious Link Detection
                        </Label>
                        <p className="text-xs text-gray-500">Analyze links for potential phishing attempts</p>
                      </div>
                      <Switch id="link-check" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="content-check" className="text-sm font-medium">
                          Content Analysis
                        </Label>
                        <p className="text-xs text-gray-500">
                          Check for urgent language and requests for sensitive information
                        </p>
                      </div>
                      <Switch id="content-check" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="attachment-check" className="text-sm font-medium">
                          Attachment Scanning
                        </Label>
                        <p className="text-xs text-gray-500">Detect potentially malicious attachments</p>
                      </div>
                      <Switch id="attachment-check" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="custom-domains">Custom Suspicious Domains</Label>
                  <Input
                    id="custom-domains"
                    placeholder="Enter domains separated by commas (e.g., fake-site.com, scam.net)"
                  />
                  <p className="text-xs text-gray-500">Add custom domains that should be flagged as suspicious</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Auto-Actions</CardTitle>
                <CardDescription>Configure automatic actions for detected phishing emails</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-flag" className="text-sm font-medium">
                      Auto-Flag Phishing Emails
                    </Label>
                    <p className="text-xs text-gray-500">Automatically flag emails detected as phishing</p>
                  </div>
                  <Switch id="auto-flag" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-move" className="text-sm font-medium">
                      Move to Phishing Folder
                    </Label>
                    <p className="text-xs text-gray-500">Automatically move phishing emails to a separate folder</p>
                  </div>
                  <Switch id="auto-move" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-delete" className="text-sm font-medium">
                      Auto-Delete High Confidence Phishing
                    </Label>
                    <p className="text-xs text-gray-500">
                      Automatically delete emails with very high phishing confidence
                    </p>
                  </div>
                  <Switch id="auto-delete" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gmail Connection</CardTitle>
                <CardDescription>Manage your connected Gmail account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-md bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Connected Account</p>
                      <p className="text-sm text-gray-500">user@gmail.com</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Disconnect
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scan-frequency">Email Scan Frequency</Label>
                  <select id="scan-frequency" className="w-full p-2 border rounded-md" defaultValue="realtime">
                    <option value="realtime">Real-time (as emails arrive)</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="manual">Manual only</option>
                  </select>
                  <p className="text-xs text-gray-500">How often PhishGuard should scan your inbox for new emails</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how you want to be notified about phishing attempts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="text-sm font-medium">
                      Email Notifications
                    </Label>
                    <p className="text-xs text-gray-500">Receive email notifications for detected phishing attempts</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="browser-notifications" className="text-sm font-medium">
                      Browser Notifications
                    </Label>
                    <p className="text-xs text-gray-500">Receive browser notifications when phishing is detected</p>
                  </div>
                  <Switch id="browser-notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="summary-reports" className="text-sm font-medium">
                      Weekly Summary Reports
                    </Label>
                    <p className="text-xs text-gray-500">Receive weekly reports of phishing activity</p>
                  </div>
                  <Switch id="summary-reports" defaultChecked />
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="notification-email">Notification Email</Label>
                  <Input
                    id="notification-email"
                    type="email"
                    placeholder="Enter email address"
                    defaultValue="user@gmail.com"
                  />
                  <p className="text-xs text-gray-500">
                    Where to send notification emails (if different from your Gmail)
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Notification Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
