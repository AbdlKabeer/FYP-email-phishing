# 🛡️ PhishGuard — Email Phishing Detection System

> **Final Year Project (FYP)** — An intelligent, real-time email phishing detection web application powered by a custom Decision Tree algorithm and Gmail API integration.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Decision Tree Algorithm](#decision-tree-algorithm)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [How Phishing Detection Works](#how-phishing-detection-works)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## 📌 Overview

**PhishGuard** is a web-based phishing email detection system developed as part of a Final Year Project (FYP). It connects securely to a user's Gmail account via OAuth 2.0 and uses a custom-built **Decision Tree algorithm** to scan and classify emails in real time as either **phishing** or **safe**.

The system analyses multiple email features — including sender domain patterns, urgent language, suspicious links, sensitive data requests, and attachment types — to generate a phishing confidence score and provide transparent, human-readable reasons for each classification.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Gmail OAuth Integration** | Securely connect your Gmail account without exposing credentials |
| 🌳 **Decision Tree Analysis** | Multi-factor weighted scoring algorithm for phishing classification |
| 📊 **Real-time Dashboard** | Visualise all emails with phishing/safe status at a glance |
| 📋 **Stats Overview** | High-level metrics showing total emails, phishing count, and safety score |
| 🔍 **Email Detail View** | Inspect individual emails with full analysis breakdown and reasoning |
| 🏷️ **Filter by Category** | Filter inbox by All, Phishing, or Safe emails |
| ⚙️ **Detection Settings** | Configurable sensitivity levels for the detection algorithm |
| 🎨 **Dark/Light Mode** | Full theme support via `next-themes` |
| 📱 **Responsive Design** | Fully responsive layout for desktop and mobile |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                     │
│  ┌───────────────┐  ┌───────────────┐  ┌────────────────┐  │
│  │  Landing Page │  │   Dashboard   │  │  Email Detail  │  │
│  └───────────────┘  └───────────────┘  └────────────────┘  │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / API Calls
┌──────────────────────────────▼──────────────────────────────┐
│                    Next.js API Routes (Server)               │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │  /api/auth/*   │  │ /api/gmail/* │  │  Decision Tree  │ │
│  │  OAuth Handler │  │ Email Fetch  │  │  Analysis Lib   │ │
│  └────────────────┘  └──────────────┘  └─────────────────┘ │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                     External Services                        │
│            Google OAuth 2.0 + Gmail API (REST)               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 15.2.4 | Full-stack React framework with App Router |
| **React** | 19 | UI component library |
| **TypeScript** | ^5 | Type-safe development |
| **Tailwind CSS** | ^3.4.17 | Utility-first styling |
| **shadcn/ui** | Latest | Pre-built accessible UI components |
| **Radix UI** | Various | Headless UI primitives |
| **Lucide React** | ^0.454.0 | Icon library |
| **Recharts** | 2.15.0 | Data visualisation charts |
| **next-themes** | ^0.4.4 | Dark/Light mode management |

### Backend (API Routes)
| Technology | Purpose |
|---|---|
| **Next.js API Routes** | Serverless backend endpoints |
| **Google OAuth 2.0** | Secure Gmail authentication |
| **Gmail API** | Email data retrieval |

### Core Algorithm
| Module | Purpose |
|---|---|
| `lib/decision-tree.ts` | Custom phishing detection algorithm |
| `lib/gmail.ts` | Gmail API client and email processing |
| `lib/auth-utils.ts` | OAuth token management |

---

## 🌳 Decision Tree Algorithm

The phishing detection engine is implemented in [`lib/decision-tree.ts`](./lib/decision-tree.ts). It uses a **weighted scoring model** that evaluates the following email features:

### Feature Weights

| Feature | Weight | Description |
|---|---|---|
| 🌐 **Suspicious Sender Domain** | 30 pts | Domain impersonation detection using regex patterns |
| 🔗 **Suspicious Links** | 25 pts | Detects redirects, obfuscated URLs |
| ⚠️ **Urgent Language + Sensitive Request** | 20 pts | Combined high-risk signal |
| 📝 **Sensitive Information Request** | 15 pts | Requests for passwords, bank details, etc. |
| ✍️ **Misspellings / Character Substitutions** | 15 pts | Typosquatting detection |
| 📨 **Urgent Language (alone)** | 10 pts | Alarming language without sensitive request |
| 📎 **Dangerous Attachments** | 10 pts | Executable or script-type file attachments |

### Classification Threshold

```
Phishing Confidence Score = (Phishing Points / Max Possible Points) × 100

Classification:
  ≥ 40%  → 🔴 PHISHING
  < 40%  → 🟢 SAFE
```

### Suspicious Domain Detection

The algorithm checks sender domains against patterns of commonly impersonated brands:

- PayPal, Amazon, Microsoft, Apple, Google, Facebook, Netflix, Instagram, Twitter, LinkedIn

It also flags:
- **Suspicious TLDs**: `.tk`, `.top`, `.xyz`, `.online`, `.club`, `.site`, `.work`
- **Numeric-heavy domains** with 4+ consecutive digits

### Dangerous Attachment Types

Flagged extensions: `.exe`, `.scr`, `.js`, `.jar`, `.bat`, `.cmd`, `.vbs`, `.ps1`, `.hta`, `.pif`, `.msi`, `.vbe`, `.jse`, `.wsf`, `.wsh`, `.reg`

---

## 📁 Project Structure

```
phishing-detector/
├── app/                          # Next.js App Router
│   ├── api/                      # API Route handlers
│   │   ├── auth/                 # OAuth authentication routes
│   │   │   └── callback/         # OAuth callback handler
│   │   └── gmail/                # Gmail data endpoints
│   │       ├── email/            # Fetch single email details
│   │       └── list/             # Fetch email list
│   ├── auth/                     # Auth pages
│   ├── dashboard/                # Dashboard page
│   │   └── page.tsx              # Main dashboard UI
│   ├── settings/                 # Settings page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing/Home page
│
├── components/                   # React components
│   ├── ui/                       # shadcn/ui base components
│   ├── email-detail.tsx          # Individual email analysis view
│   ├── email-list.tsx            # Inbox list component
│   ├── stats-cards.tsx           # Dashboard stats overview
│   └── theme-provider.tsx        # Dark/light mode wrapper
│
├── hooks/                        # Custom React hooks
│   ├── use-mobile.tsx            # Mobile breakpoint hook
│   └── use-toast.ts              # Toast notification hook
│
├── lib/                          # Core library modules
│   ├── decision-tree.ts          # 🌳 Phishing detection algorithm
│   ├── gmail.ts                  # Gmail API client & email processing
│   ├── auth-utils.ts             # OAuth token utilities
│   ├── mock-data.ts              # Mock email data for development
│   └── utils.ts                  # General utilities (cn helper)
│
├── public/                       # Static assets
├── styles/                       # Additional style files
├── components.json               # shadcn/ui configuration
├── next.config.mjs               # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** `>= 18.x` — [Download](https://nodejs.org/)
- **npm** `>= 9.x` or **pnpm** `>= 8.x`
- A **Google Cloud Console** account for OAuth credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AbdlKabeer/FYP-email-phishing.git
   cd FYP-email-phishing
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

### Environment Variables

Create a `.env.local` file in the root of the project:

```env
# Google OAuth 2.0 Credentials
# Obtain from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

# OAuth Redirect URI (must match exactly in Google Cloud Console)
NEXTAUTH_URL=http://localhost:3000

# Session secret — generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your_random_session_secret
```

#### Setting up Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client IDs**
5. Set application type to **Web application**
6. Add `http://localhost:3000/api/auth/callback` as an **Authorised Redirect URI**
7. Enable the **Gmail API** under **APIs & Services → Library**
8. Copy the **Client ID** and **Client Secret** into your `.env.local`

### Running the Application

```bash
# Development mode (with hot-reloading)
npm run dev

# Production build
npm run build
npm run start

# Linting
npm run lint
```

The application will be available at **[http://localhost:3000](http://localhost:3000)**.

---

## 📖 Usage

### 1. Landing Page
Visit the home page to learn about PhishGuard's features and how the system works.

### 2. Connect Gmail
Navigate to the **Dashboard** and click **"Connect Gmail"** to authenticate with your Google account via OAuth. No passwords are stored — only OAuth tokens.

### 3. View Your Inbox
Once connected, all your recent emails are fetched and automatically analysed by the Decision Tree algorithm.

### 4. Inspect Results
- **All Emails** — View the complete inbox with phishing indicators
- **Phishing Tab** — See only flagged suspicious emails
- **Safe Tab** — See emails classified as legitimate

### 5. Email Detail
Click any email to open the detail view, which shows:
- Phishing confidence score
- Classification result (Phishing / Safe)
- List of specific reasons flagged by the algorithm

### 6. Adjust Settings
Go to **Settings** to configure the detection sensitivity level.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/auth/status` | Check if user is authenticated |
| `POST` | `/api/auth/logout` | Disconnect Gmail and clear session |
| `GET` | `/api/auth/callback` | OAuth 2.0 callback handler |
| `GET` | `/api/gmail/list` | Fetch list of user's emails |
| `GET` | `/api/gmail/email?id={messageId}` | Fetch and analyse a specific email |

---

## 🔬 How Phishing Detection Works

```
┌─────────────────────────────────────┐
│         Email Received              │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│     Extract Email Features          │
│  - Sender domain                    │
│  - Subject & body text              │
│  - URLs / links                     │
│  - Attachments                      │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│      Decision Tree Analysis         │
│                                     │
│  1. Domain impersonation check      │
│  2. Suspicious link detection       │
│  3. Urgent language scan            │
│  4. Sensitive request detection     │
│  5. Misspelling/typo analysis       │
│  6. Attachment type validation      │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│      Calculate Confidence Score     │
│  Score = (Points / MaxPoints) × 100 │
└─────────────────┬───────────────────┘
                  │
          ┌───────▼───────┐
          │  Score ≥ 40%? │
          └───────┬───────┘
         Yes      │      No
          ▼       │       ▼
   🔴 PHISHING    │   🟢 SAFE
                  │
                  ▼
        Return Classification
        + Confidence Score
        + Detailed Reasons
```

---

## 👨‍💻 Author

**Abdulkarim / Fawaz**
- GitHub: [@AbdlKabeer](https://github.com/AbdlKabeer)
- Project: Final Year Project (FYP) — Email Phishing Detection

---

## 📄 License

This project is developed as an academic Final Year Project. All rights reserved.

---

> ⚠️ **Disclaimer**: PhishGuard is an academic research project. While it demonstrates real phishing detection techniques, it should not be used as a sole security measure in production environments. Always use multiple layers of security.
