import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ApexHardware | Engineered for Extreme Performance",
  description: "Premium PC components for extreme performance. GPUs, CPUs, Memory, Cooling, and Power Supplies engineered with precision.",
  keywords: ["PC hardware", "GPU", "CPU", "gaming PC", "custom build", "components", "ApexHardware"],
  authors: [{ name: "ApexHardware" }],
  creator: "ApexHardware",
  publisher: "ApexHardware",
  robots: "index, follow",
  openGraph: {
    title: "ApexHardware | Engineered for Extreme Performance",
    description: "Premium PC components for extreme performance.",
    type: "website",
    locale: "en_US",
    siteName: "ApexHardware",
  },
  twitter: {
    card: "summary_large_image",
    title: "ApexHardware | Engineered for Extreme Performance",
    description: "Premium PC components for extreme performance.",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export const viewport: Viewport = {
  themeColor: "#0D0F12",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}