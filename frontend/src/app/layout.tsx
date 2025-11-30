import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BlinkForm Builder",
  description: "Visual form builder for Solana Blinks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
