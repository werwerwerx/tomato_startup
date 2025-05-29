import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import "./globals.css";
import { HeaderWidget } from "@/components/widjets/header-widget";

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
    <html lang="en">
      <body
        className={`${comfortaaFont.className} font-sans text-foreground bg-background`}
      >
        <HeaderWidget />
        {children}
      </body>
    </html>
  );
}
