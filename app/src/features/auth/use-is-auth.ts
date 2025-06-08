import { useEffect, useState } from "react";

export const useIsAuth = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/user/auth/checkout", {
          method: "GET",
          credentials: "include", // Important for cookies
        });
        setIsAuth(res.ok);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuth(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuth, isLoading };
};