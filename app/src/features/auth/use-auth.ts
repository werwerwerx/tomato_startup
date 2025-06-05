"use client";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useState, useCallback } from "react";
import { 
  AuthStrategy, 
  emailSchema, 
  AuthBehavior, 
  REGISTER_EMAIL_ERROR_MSGS,
  UseAuthResult,
  AuthResponse,
  LOGIN_EMAIL_ERROR_MSGS
} from "./types";

const AUTH_BEHAVIOR: Record<AuthStrategy, AuthBehavior> = {
  login: {
    url: "/api/auth/mail",
    schema: emailSchema,
    errorMessages: LOGIN_EMAIL_ERROR_MSGS,
    redirectTo: "prev",
  },
  register: {
    url: "/api/auth/register",
    schema: emailSchema,
    errorMessages: REGISTER_EMAIL_ERROR_MSGS,
    redirectTo: "prev",
  },
};

export const useEmailSubmit = (strategy: AuthStrategy): UseAuthResult => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    setError(null);
    setIsSuccess(false);
  }, []);

  const validateEmail = useCallback(() => {
    const result = AUTH_BEHAVIOR[strategy].schema.safeParse({ email });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return false;
    }
    setError(null);
    return true;
  }, [email, strategy]);

  const handleSubmit = useCallback(async () => {
    if (!validateEmail()) return;

    setIsLoading(true);
    const { url, errorMessages } = AUTH_BEHAVIOR[strategy];

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data: AuthResponse = await res.json();

      if (res.status !== 200) {
        setError(data.error || errorMessages[Number(res.status)] || REGISTER_EMAIL_ERROR_MSGS.UNKNOWN);
        return;
      }

      setIsSuccess(true);
      if (AUTH_BEHAVIOR[strategy].redirectTo === "prev") {
        router.back();
      } else {
        router.push(AUTH_BEHAVIOR[strategy].redirectTo);
      }
    } catch (error) {
      console.error("Error during auth submission:", error);
      setError(REGISTER_EMAIL_ERROR_MSGS[500]);
    } finally {
      setIsLoading(false);
    }
  }, [email, strategy, router, validateEmail]);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const reset = useCallback(() => {
    setEmail("");
    setError(null);
    setIsSuccess(false);
    setIsLoading(false);
  }, []);

  const resend = useCallback(() => {
    setIsSuccess(false);
    handleSubmit();
  }, [handleSubmit]);

  return {
    email,
    setEmail: handleEmailChange,
    isLoading,
    error,
    isSuccess,
    handleSubmit,
    validateEmail,
    handleKeyPress,
    reset,
    resend,
  };
};
