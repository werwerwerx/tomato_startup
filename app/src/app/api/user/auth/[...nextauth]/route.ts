import { envConfig } from "@/shared/lib/config";
import NextAuth from "next-auth";
import YandexProvider from "next-auth/providers/yandex";

const handler = NextAuth({
  providers: [
    YandexProvider({
      clientId: envConfig.YANDEX_CLIENT_ID,
      clientSecret: envConfig.YANDEX_CLIENT_SECRET,
    }),
    
  ],
  
})

export { handler as GET, handler as POST };