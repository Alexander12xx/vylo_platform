import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/layout/AuthProvider';
import { ThemeProvider } from '@/components/layout/ThemeToggle';
import { Home, Compass, Video, User } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vylo Platform',
  description: 'Live streaming and community platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-gray-50 dark:bg-dark-bg`}>
        <AuthProvider>
          <ThemeProvider>
            {/* Navigation */}
            <nav className="sticky top-0 z-50 border-b dark:border-gray-800 bg-white dark:bg-dark-card">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  {/* Logo */}
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg mr-3"></div>
                    <span className="font-bold text-xl text-gray-900 dark:text-white">Vylo</span>
                  </div>

                  {/* Navigation Links */}
                  <div className="hidden md:flex items-center space-x-8">
                    <a href="/" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
                      <Home className="w-4 h-4 mr-2" />
                      Home
                    </a>
                    <a href="/explore" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
                      <Compass className="w-4 h-4 mr-2" />
                      Explore
                    </a>
                    <a href="/live" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
                      <Video className="w-4 h-4 mr-2" />
                      Live
                    </a>
                  </div>

                  {/* Right Side */}
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90">
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </button>
                  </div>
                </div>
              </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1">
              {children}
            </main>

            {/* Footer */}
            <footer className="mt-12 border-t dark:border-gray-800 py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 dark:text-gray-400">
                <p>© 2024 Vylo Platform. All rights reserved.</p>
                <p className="text-sm mt-2">Built with Next.js, Supabase, and WebRTC</p>
              </div>
            </footer>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
