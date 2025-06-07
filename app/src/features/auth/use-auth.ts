"use client";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useState, useCallback } from "react";
import { emailSchema } from "./types";
import { apiClient } from "@/shared/api.client";
// shit code area started. 
type AuthResponse = {
  message?: string;
  error?: string;
};

// hmm m refactor or fuck it ? hmmm... some refactor weel need. because we need to implement oAuth provider.    
// minimum: separate ui from auth logic.
// mayebe i want to see the code more obvious because i dont know what is what is responsoble for what( handleSubmit for example... ). maybe i change some names.


export const useEmailAuth = (type: "login" | "register" | "login-verify" | "register-verify") => {
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

  const validateEmail = () => {
    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (): Promise<AuthResponse> => {
    if (!validateEmail()) {
      return { error: "Некорректный email" };
    }

    setIsLoading(true);
    try {
      const result = await {
        "login": apiClient.loginByEmail,
        "register": apiClient.registerByEmail,
        "login-verify": apiClient.loginByEmail,
        "register-verify": apiClient.registerByEmail,
      }[type](email);
      if (result.error) {
        setError(result.error);
        return { error: result.error };
      }
      if (result.message) {
        setIsSuccess(true);
        return { message: result.message };
      }
      return { error: "Неизвестная ошибка" };
    } catch (err) {
      const error = err instanceof Error ? err.message : "Произошла ошибка";
      setError(error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = useCallback(
    async (e: KeyboardEvent<HTMLInputElement>): Promise<AuthResponse> => {
      if (e.key === "Enter") {
        return handleSubmit();
      }
      return { error: "Неверная клавиша" };
    },
    [handleSubmit]
  );

  const reset = useCallback(() => {
    setEmail("");
    setError(null);
    setIsSuccess(false);
    setIsLoading(false);
  }, []);

  const resend = useCallback(async (): Promise<AuthResponse> => {
    setIsSuccess(false);
    return handleSubmit();
  }, [handleSubmit]);

  return {
    email,
    setEmail: handleEmailChange,
    isLoading,
    error,
    isSuccess,
    submit:handleSubmit,
    validateEmail,
    handleKeyPress,
    reset,
    resend,
  };
};
