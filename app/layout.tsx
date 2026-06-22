import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gopikrishna Venepalli — Full-Stack Developer & AI Builder",
  description: "Portfolio of Gopikrishna Venepalli, a full-stack developer building scalable platforms and AI-powered products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
