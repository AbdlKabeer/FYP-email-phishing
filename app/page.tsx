import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Mail, AlertTriangle, CheckCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-semibold">
            <Shield className="h-6 w-6 text-green-600" />
            <span>PhishGuard</span>
          </div>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
              How It Works
            </Link>
            <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Protect Your Inbox from Phishing Attacks
                </h1>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  PhishGuard uses advanced decision tree algorithms to detect and protect you from phishing emails.
                  Connect your Gmail account and stay safe online.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-md">
                  <Card className="border-2 border-green-100">
                    <CardHeader className="bg-green-50 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="h-5 w-5" />
                          <span className="text-sm font-medium">New Message</span>
                        </div>
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium">From:</span>
                          <span className="text-sm ml-2 text-red-500">security-alert@g00gle.com</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Subject:</span>
                          <span className="text-sm ml-2">Urgent: Your Account Has Been Compromised</span>
                        </div>
                        <div className="pt-2 text-sm">
                          Dear User, We have detected suspicious activity on your account. Please verify your
                          information immediately by clicking the link below...
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-red-50 flex justify-between">
                      <span className="text-sm font-medium text-red-600">Phishing Detected</span>
                      <div className="flex items-center gap-1">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span className="text-xs">Protected by PhishGuard</span>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our advanced phishing detection system keeps your inbox safe
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 pt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Gmail Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Securely connect your Gmail account with OAuth for real-time email scanning and protection.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Decision Tree Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Our machine learning algorithm analyzes multiple factors to accurately identify phishing attempts.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                    Automated Protection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Automatically flag suspicious emails and get alerts when potential threats are detected.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  PhishGuard uses a sophisticated decision tree algorithm to protect your inbox
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 pt-8">
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <span className="font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-bold">Connect</h3>
                <p className="text-center text-gray-500">Securely connect your Gmail account with just a few clicks</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <span className="font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-bold">Analyze</h3>
                <p className="text-center text-gray-500">
                  Our algorithm scans your emails for suspicious patterns and content
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <span className="font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-bold">Protect</h3>
                <p className="text-center text-gray-500">Get alerts about phishing attempts and keep your data safe</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-gray-50">
        <div className="container mx-auto flex flex-col gap-4 py-10 md:flex-row md:gap-8 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-semibold">
            <Shield className="h-6 w-6 text-green-600" />
            <span>PhishGuard</span>
          </div>
          <div className="md:ml-auto flex gap-4 sm:gap-6">
            <Link href="#" className="text-sm hover:underline underline-offset-4">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm hover:underline underline-offset-4">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm hover:underline underline-offset-4">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
