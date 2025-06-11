import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import "./globals.css";
import { Header } from "@/app/header";
import { Container } from "@/shared/components/container";
import { auth } from "./auth";
import { SessionProvider } from "next-auth/react";

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
  display: "swap",
});

function ClientSessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light overflow-x-hidden">
      <body
        className={`${comfortaaFont.className} text-foreground bg-muted h-screen w-screen overflow-x-hidden py-25 font-sans`}
      >
        <ClientSessionProvider session={await auth()}>
          <Header />
          <Container>{children}</Container>
        </ClientSessionProvider>
      </body>
    </html>
  );
}
