import './globals.css';
import { Inter } from 'next/font/google';
import Navigation from '@/components/layout/Navigation';
import { AuthProvider } from '@/components/layout/AuthProvider';
import { ThemeProvider } from '@/components/layout/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Vylo Platform - Live Streaming & Community',
  description: 'Watch, stream, and connect with creators using ALT coins',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900`}>
        <ThemeProvider>
          <AuthProvider>
            <Navigation />
            <main className="pt-16">
              {children}
            </main>
            <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 py-8 mt-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg mr-3"></div>
                      <span className="font-bold text-xl">Vylo</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      The future of live streaming and creator monetization.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Platform</h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li><a href="/live/browse" className="hover:text-purple-600">Browse Streams</a></li>
                      <li><a href="/creator" className="hover:text-purple-600">For Creators</a></li>
                      <li><a href="/fan" className="hover:text-purple-600">For Fans</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Resources</h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li><a href="#" className="hover:text-purple-600">Help Center</a></li>
                      <li><a href="#" className="hover:text-purple-600">Community</a></li>
                      <li><a href="#" className="hover:text-purple-600">Blog</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li><a href="#" className="hover:text-purple-600">Privacy Policy</a></li>
                      <li><a href="#" className="hover:text-purple-600">Terms of Service</a></li>
                      <li><a href="#" className="hover:text-purple-600">Cookie Policy</a></li>
                    </ul>
                  </div>
                </div>
                <div className="border-t dark:border-gray-700 mt-8 pt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                  <p>© 2024 Vylo Platform. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
