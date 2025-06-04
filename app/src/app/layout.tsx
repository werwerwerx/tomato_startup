import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import "./globals.css";
import { Header } from "@/app/header";
import { Container } from "@/shared/components/container";
import { cookies } from "next/headers";
import { envConfig } from "@/shared/lib/config";
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

export const dynamic = "force-static";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const token = cookieStore.get(envConfig.AUTH_TOKEN_NAME)?.value
  const isAuthorized = !!token;

  return (
    <html lang="en" className="overflow-x-hidden light">
      <body
        className={`${comfortaaFont.className} text-foreground bg-background overflow-x-hidden font-sans py-25`}
      >
        <Header isAuthorized={isAuthorized} />
        <Container>{children}</Container>
      </body>
    </html>
  );
}
