"use client";
import { Button } from "@/shared/components/ui-kit/button";
import { Logo } from "@/app/header";
import { Input } from "@/shared/components/input";
import { Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, KeyboardEvent } from "react";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Введите корректный email адрес"),
});

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = () => {
    const result = authSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error("Auth error:", error);
      setError("Произошла ошибка при отправке");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="flex w-full max-w-[90%] md:max-w-[500px] flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Logo className="w-40" />
        <h1 className="text-2xl font-bold">Вход</h1>
      </div>
      <div className="flex flex-col gap-2">
        <div className="">
          <label
            htmlFor="email"
            className="text-foreground/60 text-sm font-medium"
          >
            Введите адрес электронной почты
          </label>
          <div className="flex flex-row items-center gap-2 rounded-lg border px-2">
            <Mail className="text-foreground/60 h-4 w-4" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              onKeyDown={handleKeyPress}
              onBlur={validateEmail}
              className="w-full border-none outline-none"
              placeholder="example@example.com"
              disabled={isLoading}
            />
          </div>
          {error && (
            <p className="text-destructive text-sm mt-1">{error}</p>
          )}
        </div>
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={isLoading || !email}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Загрузка...
            </>
          ) : (
            "Войти"
          )}
        </Button>
        <p className="text-foreground/60 text-sm">
          Нет аккаунта?{" "}
          <Link href="/auth/register" className="text-primary font-bold">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}
