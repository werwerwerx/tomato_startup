import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import "./globals.css";
import { Header } from "@/app/header";
export const metadata: Metadata = {
  title: "Tomato e-commerce",
  description: "This is a site maked just for portfolio",
  authors: [{ name: "Igor Platonov web -developer", url: "https://github.com/JstIgor" }],
};

const comfortaaFont = Comfortaa({
  subsets: ["latin"],
  variable: "--font-comfortaa",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body
        className={`${comfortaaFont.className} font-sans overflow-x-hidden text-foreground bg-background`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
