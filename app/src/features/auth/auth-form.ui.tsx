import { Logo } from "@/app/header";
import { Input } from "@/shared/components/input";
import { Button } from "@/shared/components/ui-kit/button";
import { Loader2, Mail } from "lucide-react";

export const AuthForm = (
  {
    formStrategy,
    email,
    setEmail,
    handleKeyPress,
    validateEmail,
    isLoading,
    error,
    handleEmailSubmit,
    toggleAuthStrategy,
  }: {
    formStrategy: "login" | "register" | "login-verify" | "register-verify";
    email: string;
    setEmail: (email: string) => void;
    handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    validateEmail: () => void;
    isLoading: boolean;
    error: string | null;
    handleEmailSubmit: () => void;
    toggleAuthStrategy: () => void;
  }
) => (
  <div className="flex w-full max-w-[90%] flex-col gap-5 md:max-w-[500px]">
    <div className="flex flex-col gap-2">
      <Logo className="w-40" />
      <h1 className="text-2xl font-bold">
        {formStrategy === "login" ? "Вход" : "Регистрация"}
      </h1>
    </div>

    <div className="flex flex-col gap-2">
      <div>
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
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={validateEmail}
            className="w-full border-none outline-none"
            placeholder="example@example.com"
            disabled={isLoading}
          />
        </div>
        {error && <p className="text-destructive mt-1 text-sm">{error}</p>}
      </div>

      <Button
        className="w-full"
        onClick={handleEmailSubmit}
        disabled={isLoading || !email}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Загрузка...
          </>
        ) : formStrategy === "login" ? (
          "Войти"
        ) : (
          "Зарегистрироваться"
        )}
      </Button>

      <p className="text-foreground/60 text-sm">
        {formStrategy === "login" ? "Нет аккаунта?" : "Уже есть аккаунт?"}
        <button
          className="text-primary ml-1 font-bold"
          onClick={toggleAuthStrategy}
        >
          {formStrategy === "login" ? "Зарегистрироваться" : "Войти"}
        </button>
      </p>
    </div>
  </div>
);