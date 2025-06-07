import AuthFormFeature from "@/features/auth";
import { headers } from "next/headers";

export default async function AuthPage() {
  // const headersList = await headers();
  // const referer = headersList.get("referer");
  
  // const redirectTo = (!referer || referer.includes('/auth')) ? '/' : referer;
  
  return (
    <div className="flex h-[70vh] md:h-[70vh] lg:h-screen xl:h-[90vh] w-full items-center justify-center">
      <AuthFormFeature />
    </div>
  );
}
