import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import Sidebar from "@/components/layout/Sidebar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SOC Dashboard - BBT Connect",
  description: "Security Operations Center Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} antialiased bg-soc-bg text-gray-100 min-h-screen`}>
        <QueryProvider>
          <Sidebar />
          <main className="lg:pl-60">
            <div className="p-6 max-w-[1600px] mx-auto pt-16 lg:pt-6">
              {children}
            </div>
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
