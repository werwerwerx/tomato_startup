import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import "./globals.css";
import { Header } from "@/shared/components/header";
import Logo from "@/public/assets/logo.png";
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
        <Header />
        {children}
      </body>
    </html>
  );
}
