import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'], 
  variable: '--font-mono' 
});

export const metadata: Metadata = {
  title: 'HackForge - AI Code Generation Platform',
  description: 'Transform your ideas into production-ready code with AI',
  keywords: 'AI, code generation, full-stack, developer tools',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {/* The app is dark-only (ThemeProvider pins defaultTheme="dark" with
            enableSystem off), so Clerk's own UI is pinned to its dark theme to
            match rather than rendering a white card on a black page.
            afterSignOutUrl lives here in Clerk Core 3 — it was removed from
            <UserButton>. */}
        <ClerkProvider appearance={{ theme: dark }} afterSignOutUrl="/">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange={false}
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}