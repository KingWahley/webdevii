import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Navbar from "@/components/Navbar";
import AgentationWrapper from "@/components/AgentationWrapper";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Peter Olawale - Software Engineer Portfolio",
  description:
    "I help businesses build websites that serve as powerful sales machines. Clean design, fast performance, and strategic structure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body className="bg-dark text-neutral-100 min-h-screen relative pb-12 font-sans antialiased">
        <Navbar />
        {children}
        <AgentationWrapper />
      </body>
    </html>
  );
}
