import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { WatchlistProvider } from "@/context/WatchlistContext";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Erebix | Financial Dashboard",
  description: "Algorithmic Market Data & AI Insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="dark" themes={['light', 'dark', 'hades', 'cyber']} enableSystem={false}>
          <AuthProvider>
            <WatchlistProvider>
              {children}
            </WatchlistProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
