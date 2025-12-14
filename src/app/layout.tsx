import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/layout/ThemeToggle'
import { AuthProvider } from '@/components/layout/AuthProvider'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VYLO - Creator Monetization Platform',
  description: 'Monetize your content with ALT coins',
  keywords: ['creator', 'monetization', 'live streaming', 'content', 'ALT coins'],
  authors: [{ name: 'ALTECH' }],
  creator: 'ALTECH',
  publisher: 'ALTECH',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Detect devtools
              (function() {
                const threshold = 160;
                const devtools = /./;
                devtools.toString = function() {
                  if (!this.opened) {
                    this.opened = true;
                    fetch('/api/security/devtools', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ detected: true })
                    });
                  }
                  return '';
                };
                console.log('%c', devtools);
                
                // Tab switching detection
                document.addEventListener('visibilitychange', function() {
                  if (document.hidden) {
                    fetch('/api/security/tabswitch', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ timestamp: Date.now() })
                    });
                  }
                });
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-dark-text`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                className: 'dark:bg-dark-card dark:text-white',
                duration: 4000,
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}