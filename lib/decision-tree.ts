// Decision tree algorithm for phishing detection

interface EmailFeatures {
  senderDomain: string
  hasUrgentLanguage: boolean
  containsSensitiveRequests: boolean
  hasSuspiciousLinks: boolean
  hasMisspellings: boolean
  hasAttachments: boolean
  attachmentTypes: string[]
}

interface AnalysisResult {
  isPhishing: boolean
  confidence: number
  reasons: string[]
}

export function analyzeEmailWithDecisionTree(features: EmailFeatures): AnalysisResult {
  const reasons: string[] = []
  let phishingScore = 0
  let maxScore = 0

  // Domain check (highest weight)
  maxScore += 30
  if (isSuspiciousDomain(features.senderDomain)) {
    phishingScore += 30
    reasons.push("Suspicious sender domain that may be impersonating a legitimate company")
  }

  // Suspicious links check
  maxScore += 25
  if (features.hasSuspiciousLinks) {
    phishingScore += 25
    reasons.push("Contains suspicious links or redirects")
  }

  // Urgent language + sensitive requests (combination is suspicious)
  maxScore += 20
  if (features.hasUrgentLanguage && features.containsSensitiveRequests) {
    phishingScore += 20
    reasons.push("Uses urgent language while requesting sensitive information")
  } else {
    // Individual checks with lower weights
    maxScore += 10
    if (features.hasUrgentLanguage) {
      phishingScore += 10
      reasons.push("Contains urgent or alarming language")
    }

    maxScore += 15
    if (features.containsSensitiveRequests) {
      phishingScore += 15
      reasons.push("Requests sensitive personal or financial information")
    }
  }

  // Misspellings check
  maxScore += 15
  if (features.hasMisspellings) {
    phishingScore += 15
    reasons.push("Contains misspellings or character substitutions")
  }

  // Attachment check
  maxScore += 10
  if (features.hasAttachments && hasSuspiciousAttachments(features.attachmentTypes)) {
    phishingScore += 10
    reasons.push("Contains potentially dangerous attachment types")
  }

  // Calculate confidence percentage
  const confidence = Math.round((phishingScore / maxScore) * 100)

  // Determine if it's phishing based on threshold
  // Threshold can be adjusted based on sensitivity settings
  const threshold = 40 // Default threshold (40%)
  const isPhishing = confidence >= threshold

  return {
    isPhishing,
    confidence: isPhishing ? confidence : 100 - confidence, // If not phishing, show confidence that it's safe
    reasons: reasons.length > 0 ? reasons : ["No phishing indicators detected"],
  }
}

function isSuspiciousDomain(domain: string): boolean {
  // Check for common legitimate domains with slight modifications
  const suspiciousDomainPatterns = [
    { legitimate: "paypal.com", regex: /paypa[l1][^.]*\.(?!com$)/i },
    { legitimate: "amazon.com", regex: /amaz[o0]n[^.]*\.(?!com$)/i },
    { legitimate: "microsoft.com", regex: /micr[o0]s[o0]ft[^.]*\.(?!com$)/i },
    { legitimate: "apple.com", regex: /appl[e3][^.]*\.(?!com$)/i },
    { legitimate: "google.com", regex: /g[o0]{2}gl[e3][^.]*\.(?!com$)/i },
    { legitimate: "facebook.com", regex: /faceb[o0]{2}k[^.]*\.(?!com$)/i },
    { legitimate: "netflix.com", regex: /netfl[i1]x[^.]*\.(?!com$)/i },
    { legitimate: "instagram.com", regex: /[i1]nstagram[^.]*\.(?!com$)/i },
    { legitimate: "twitter.com", regex: /tw[i1]tt[e3]r[^.]*\.(?!com$)/i },
    { legitimate: "linkedin.com", regex: /l[i1]nked[i1]n[^.]*\.(?!com$)/i },
  ]

  // Check if domain matches any suspicious pattern
  for (const pattern of suspiciousDomainPatterns) {
    if (pattern.regex.test(domain)) {
      return true
    }
  }

  // Check for suspicious TLDs often used in phishing
  const suspiciousTLDs = [".tk", ".top", ".xyz", ".online", ".club", ".site", ".work"]
  if (suspiciousTLDs.some((tld) => domain.endsWith(tld))) {
    return true
  }

  // Check for numeric domains (often suspicious)
  if (/\d{4,}/.test(domain)) {
    return true
  }

  return false
}

function hasSuspiciousAttachments(types: string[]): boolean {
  const suspiciousTypes = [
    ".exe",
    ".scr",
    ".js",
    ".jar",
    ".bat",
    ".cmd",
    ".vbs",
    ".ps1",
    ".hta",
    ".pif",
    ".msi",
    ".vbe",
    ".jse",
    ".wsf",
    ".wsh",
    ".reg",
  ]

  return types.some((type) => suspiciousTypes.includes(type.toLowerCase()))
}
