import type { Metadata } from "next";
import { Cinzel, Manrope } from "next/font/google";
import "./globals.css";

// Cấu hình Font
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "Auction Elite - Luxury Bidding",
  description: "Sàn đấu giá thượng lưu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${cinzel.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}