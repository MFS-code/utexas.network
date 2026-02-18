import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "utexas.network",
  description: "A webring for UT Austin students",
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: "utexas.network",
    description: "A webring for UT Austin students",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "utexas.network",
    description: "A webring for UT Austin students",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
