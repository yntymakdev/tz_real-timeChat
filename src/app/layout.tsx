import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/providers/UserProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO metadata
export const metadata: Metadata = {
  title: "Realtime Chat App",
  description: "Join real-time conversations with your friends in this modern chat app.",
  keywords: ["chat", "realtime", "messaging", "Next.js", "React", "shadcn/ui"],
  authors: [{ name: "Yntymak Kubanychev", url: "https://portfolioweb-beige.vercel.app/" }],
  openGraph: {
    title: "Realtime Chat App",
    description: "Join real-time conversations with your friends in this modern chat app.",
    url: "https://tz-real-time-chat.vercel.app",
    siteName: "Realtime Chat",
    images: [
      {
        url: "https://tz-real-time-chat.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Realtime Chat App",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Realtime Chat App",
    description: "Join real-time conversations with your friends in this modern chat app.",
    site: "@yourTwitterHandle",
    creator: "@yourTwitterHandle",
    images: ["https://tz-real-time-chat.vercel.app/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
