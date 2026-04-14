import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

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
    images: ['/iconwhite.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: "utexas.network",
    description: "A webring for UT Austin students",
    images: ['/iconwhite.svg'],
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
