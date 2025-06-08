import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Get Notion ID",
  description: "Get Notion ID",
  generator: "Johnny-Boy",
  icons: {
    icon: [
      {
        url: "/notion-icon.svg",
        href: "/notion-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  },
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
