import './globals.css';
import AuthProvider from '@/components/layout/AuthProvider';

export const metadata = {
  title: 'Vylo Platform',
  description: 'Live streaming platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
