import NextAuth from "next-auth";
import YandexProvider from "next-auth/providers/yandex";
import { envConfig } from "@/shared/lib/config";
import db from "@/shared/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Resend from "next-auth/providers/resend";
import DiscordProvider from "next-auth/providers/discord";
import GithubProvider from "next-auth/providers/github";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      email: string;
      name: string;
      adress: string | undefined;
      
      image?: string;
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    YandexProvider({
      clientId: envConfig.YANDEX_CLIENT_ID,
      clientSecret: envConfig.YANDEX_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: envConfig.GITHUB_CLIENT_ID,
      clientSecret: envConfig.GITHUB_CLIENT_SECRET,
    }),
    DiscordProvider({
      clientId: envConfig.DISCORD_CLIENT_ID,
      clientSecret: envConfig.DISCORD_CLIENT_SECRET,
    }),
    Resend({
      apiKey: envConfig.RESEND_API_KEY,
      from: "noreply@resend.dev",
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/",
  },
});
