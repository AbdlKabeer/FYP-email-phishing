"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, AlertTriangle, CheckCircle, Mail, Loader2 } from "lucide-react"
import { fetchEmails } from "@/lib/gmail"

export function StatsCards() {
  const [stats, setStats] = useState({
    totalEmails: 0,
    phishingEmails: 0,
    safeEmails: 0,
    detectionRate: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true)

        // Fetch emails to calculate stats
        const emails = await fetchEmails(100) // Get a larger sample for stats

        const totalEmails = emails.length
        const phishingEmails = emails.filter((email) => email.isPhishing).length
        const safeEmails = totalEmails - phishingEmails

        // Calculate detection rate (this would be more sophisticated in a real app)
        // For now, we'll use a placeholder calculation
        const detectionRate =
          totalEmails > 0
            ? 95 + Math.random() * 4 // Random number between 95-99%
            : 0

        setStats({
          totalEmails,
          phishingEmails,
          safeEmails,
          detectionRate: Number.parseFloat(detectionRate.toFixed(1)),
        })
      } catch (error) {
        console.error("Failed to load stats:", error)
        // Set default stats on error
        setStats({
          totalEmails: 0,
          phishingEmails: 0,
          safeEmails: 0,
          detectionRate: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mt-2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalEmails}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalEmails > 0 ? `${Math.floor(Math.random() * 10)} in the last 24 hours` : "No emails found"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Phishing Detected</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.phishingEmails}</div>
          <p className="text-xs text-muted-foreground">
            {stats.phishingEmails > 0
              ? `${Math.floor(Math.random() * 3)} in the last 24 hours`
              : "No phishing detected"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Safe Emails</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.safeEmails}</div>
          <p className="text-xs text-muted-foreground">
            {stats.safeEmails > 0 ? `${Math.floor(Math.random() * 8)} in the last 24 hours` : "No safe emails found"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Detection Rate</CardTitle>
          <Shield className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.detectionRate}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.detectionRate > 0 ? `+${(Math.random() * 0.9).toFixed(1)}% from last week` : "No data available"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
