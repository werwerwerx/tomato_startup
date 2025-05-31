import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import "./globals.css";
import { Header } from "@/app/header";
import { Container } from "@/shared/components/container";
export const metadata: Metadata = {
  title: "Tomato e-commerce",
  description: "This is a site maked just for portfolio",
  authors: [
    { name: "Igor Platonov web -developer", url: "https://github.com/JstIgor" },
  ],
};

const comfortaaFont = Comfortaa({
  subsets: ["latin"],
  variable: "--font-comfortaa",
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden light">
      <body
        className={`${comfortaaFont.className} text-foreground bg-background overflow-x-hidden font-sans`}
      >
        <Header />
        <Container className="mt-5">{children}</Container>
      </body>
    </html>
  );
}
