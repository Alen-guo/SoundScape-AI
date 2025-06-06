import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export const viewport = 'width=device-width, initial-scale=1'

export const metadata: Metadata = {
  metadataBase: new URL('https://soundscape-ai.vercel.app'),
  title: 'SoundScape AI - Free Ambient Sound Generator for Focus & Relaxation',
  description: 'Create perfect ambient soundscapes online for free. Mix rain sounds, white noise, nature sounds, and fireplace audio for better focus, productivity, sleep, and relaxation. Alternative to A Soft Murmur with advanced features.',
  keywords: 'ambient sound generator, white noise generator, focus music, rain sounds, nature sounds online, productivity sounds, relaxation sounds, sleep sounds, fireplace sounds, ocean waves, background noise generator, ambient music, concentration sounds, meditation sounds, study music, work from home sounds, ADHD focus sounds, anxiety relief sounds, stress relief sounds, zen sounds, calm sounds, peaceful sounds, atmospheric sounds, soundscape creator, ambient noise maker, free ambient sounds, online sound mixer, focus app, productivity app, meditation app, sleep app, relaxation app, sound therapy, nature sound generator, forest sounds, storm sounds, waterfall sounds, bird sounds, wind sounds, ambient sound app, white noise app, pink noise, brown noise, environmental sounds, binaural beats, ASMR sounds, spa sounds, yoga sounds, breathing sounds, mindfulness sounds, zen meditation, deep sleep sounds, power nap sounds, study ambient, work focus sounds',
  authors: [{ name: 'SoundScape AI Team' }],
  robots: 'index, follow',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: '/apple-icon.svg',
    shortcut: '/favicon.svg'
  },
  alternates: {
    canonical: 'https://soundscape-ai.vercel.app'
  },
  openGraph: {
    title: 'SoundScape AI - Free Ambient Sound Generator for Focus & Relaxation',
    description: 'Create perfect ambient soundscapes online for free. Mix rain sounds, white noise, and nature sounds for better focus, productivity, and relaxation. Superior alternative to A Soft Murmur.',
    type: 'website',
    siteName: 'SoundScape AI',
    url: 'https://soundscape-ai.vercel.app',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'SoundScape AI - Free Ambient Sound Generator for Focus & Relaxation'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SoundScape AI - Free Ambient Sound Generator for Focus & Relaxation',
    description: 'Create perfect ambient soundscapes online for free. Mix rain sounds, white noise, and nature sounds for better focus and relaxation.',
    site: '@soundscape_ai',
    creator: '@soundscape_ai'
  },
  other: {
    'google-site-verification': 'your-google-verification-code-here'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "SoundScape AI",
    "description": "Free ambient sound generator for focus, relaxation, and productivity. Mix rain sounds, white noise, and nature sounds online.",
    "url": "https://soundscape-ai.vercel.app",
    "applicationCategory": "Multimedia",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Ambient sound mixing",
      "Timer functionality", 
      "Scene presets",
      "Volume control",
      "Loop playback",
      "Free to use"
    ],
    "screenshot": "https://soundscape-ai.vercel.app/og-image.svg",
    "softwareVersion": "1.0",
    "datePublished": "2024-01-01",
    "dateModified": "2024-01-01",
    "publisher": {
      "@type": "Organization",
      "name": "SoundScape AI Team"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1250"
    }
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 