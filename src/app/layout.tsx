import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'MindfulChat — Wellness Assistant',
  description: 'AI-powered mental health support',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} font-sans h-full`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
