import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Layout from '@/components/Layout';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UPSC Study Assistant',
  description: 'AI-powered UPSC IAS study assistant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden w-full max-w-full">
      <body className={`${inter.className} overflow-x-hidden w-full max-w-full`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}
