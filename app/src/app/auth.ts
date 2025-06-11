import NextAuth from "next-auth";
import YandexProvider from "next-auth/providers/yandex";
import { envConfig } from "@/shared/lib/config";
import db from "@/shared/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Resend from "next-auth/providers/resend";
import DiscordProvider from "next-auth/providers/discord";
import GithubProvider from "next-auth/providers/github";
import { users, favorite, userCartDishes, userCart } from "@/shared/db/schema";
import { eq } from "drizzle-orm";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    adress?: string;
    image?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      adress: string | undefined;
      favoritesIds?: string[];
      cartItems?: Array<{ dishId: string; quantity: number }>;
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
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async session({ session, user }) {
      if (session.user && user.id) {
        try {
          const userData = await db
            .select({
              userId: users.id,
              userName: users.name,
              userEmail: users.email,
              userAdress: users.adress,
              userImage: users.image,
              favoriteId: favorite.dishId,
              cartDishId: userCartDishes.dishId,
              quantity: userCartDishes.quantity,
            })
            .from(users)
            .leftJoin(favorite, eq(favorite.userId, users.id))
            .leftJoin(userCart, eq(userCart.userId, users.id))
            .leftJoin(userCartDishes, eq(userCartDishes.cartId, userCart.id))
            .where(eq(users.id, user.id));

          if (userData.length === 0) {
            throw new Error("User not found");
          }

          const userInfo = userData[0];

          // Собираем уникальные ID избранных блюд
          const favoriteIds = userData
            .map((row) => row.favoriteId?.toString())
            .filter((id): id is string => Boolean(id));
          const favoritesIds = Array.from(new Set(favoriteIds));

          // Собираем корзину с количеством
          const cartItems = userData
            .map((row) => ({
              dishId: row.cartDishId?.toString() || "",
              quantity: row.quantity || 1,
            }))
            .filter((item): item is { dishId: string; quantity: number } =>
              Boolean(item.dishId),
            );

          session.user = {
            ...session.user,
            id: user.id,
            name: userInfo.userName || session.user.name,
            email: userInfo.userEmail || session.user.email,
            adress: userInfo.userAdress || undefined,
            image: userInfo.userImage || session.user.image,
            favoritesIds,
            cartItems,
          };
        } catch (error) {
          console.error("Error fetching user data for session:", error);
          session.user = {
            ...session.user,
            id: user.id,
            adress: undefined,
            favoritesIds: [],
            cartItems: [],
          };
        }
      }
      return session;
    },
  },
});
