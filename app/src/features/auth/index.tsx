"use client";
import { Button } from "@/shared/components/ui-kit/button";
import { Logo } from "@/app/header";
import { Input } from "@/shared/components/input";
import { Loader2, Mail } from "lucide-react";
import { useEmailAuth } from "./use-auth";
import { useCallback, useState, useEffect, useRef } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/shared/components/ui-kit/input-otp";
import { AuthForm } from "./auth-form.ui";
import { useRouter, usePathname } from "next/navigation";
// shit code area started.
// what is the fuck is this ? what n idea to do naything in one form ?? 4 actions in one form ??
type FormStrategy = "login" | "register" | "login-verify" | "register-verify";

const script = {
  toggle: {
    login: "register",
    register: "login",
  },
  next: {
    login: "login-verify",
    register: "register-verify",
  },
} as Record<"toggle" | "next", Record<FormStrategy, FormStrategy>>;

export default function AuthFormFeature({ initialRoute }: { initialRoute: string }) {
  const [formStrategy, setFormStrategy] = useState<FormStrategy>("login");
  const {
    email,
    setEmail,
    isLoading,
    error,
    submit,
    handleKeyPress,
    validateEmail,
    isSuccess,
    resend,
  } = useEmailAuth(formStrategy);
  const router = useRouter();

  const handleSuccess = useCallback(() => {
    if (isSuccess) {
      if (formStrategy === "login-verify" || formStrategy === "register-verify") {
        router.push(initialRoute);
      } else if (Object.keys(script.toggle).includes(formStrategy)) {
        setFormStrategy(script.next[formStrategy]);
      }
    }
  }, [isSuccess, formStrategy, initialRoute, router]);

  useEffect(() => {
    handleSuccess();
  }, [isSuccess, handleSuccess]);

  const toggleAuthStrategy = () => {
    setFormStrategy((prev) => script.toggle[prev]);
  };

  const handleEmailSubmit = async () => {
    await submit().then((result) => {
      if (result.message) {
        setFormStrategy(script.next[formStrategy]);
      }
    });
  };

  if (formStrategy === "login-verify" || formStrategy === "register-verify") {
    return (
      <VerifyForm
        formStrategy={formStrategy}
        email={email}
        submit={submit}
        resend={resend}
        isLoading={isLoading}
        error={error}
        toggleAuthStrategy={toggleAuthStrategy}
      />
    );
  }

  return (
    <AuthForm
      formStrategy={formStrategy}
      email={email}
      setEmail={setEmail}
      handleKeyPress={handleKeyPress}
      validateEmail={validateEmail}
      isLoading={isLoading}
      error={error}
      handleEmailSubmit={handleEmailSubmit}
      toggleAuthStrategy={toggleAuthStrategy}
    />
  );
}

interface VerifyFormProps {
  formStrategy: FormStrategy;
  email: string;
  submit: () => Promise<{ message?: string; error?: string }>;
  resend: () => Promise<{ message?: string; error?: string }>;
  isLoading: boolean;
  error: string | null;
  toggleAuthStrategy: () => void;
}

const VerifyForm: React.FC<VerifyFormProps> = ({
  formStrategy,
  email,
  submit,
  resend,
  isLoading,
  error,
  toggleAuthStrategy,
}) => (
  <div className="flex w-full max-w-[90%] flex-col gap-5 md:max-w-[500px]">
    <div className="flex flex-col gap-2">
      <Logo className="w-40" />
      <h1 className="text-2xl font-bold">
        {formStrategy === "login-verify"
          ? "Подтверждение входа"
          : "Подтверждение регистрации"}
      </h1>
    </div>

    <div className="flex flex-col gap-4">
      <InputOTPControlled
        email={email}
        handleSubmit={submit}
        onResend={resend}
        isLoading={isLoading}
        error={error}
      />

      <Button className="w-full" onClick={toggleAuthStrategy} variant="outline">
        {formStrategy === "login-verify" ? "Зарегистрироваться" : "Войти"}
      </Button>
    </div>
  </div>
);

interface InputOTPControlledProps {
  email: string;
  handleSubmit: () => Promise<{ message?: string; error?: string }>;
  onResend: () => Promise<{ message?: string; error?: string }>;
  isLoading: boolean;
  error: string | null;
}

export function InputOTPControlled({
  email,
  handleSubmit,
  onResend,
  isLoading,
  error,
}: InputOTPControlledProps) {
  const [value, setValue] = useState("");

  const handleKeyPress = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && value.length === 6) {
        const result = await handleSubmit();
        if (result.error) {
          setValue("");
        }
      }
    },
    [handleSubmit, value],
  );

  const handleValueChange = useCallback(
    (newValue: string) => {
      setValue(newValue);
      if (newValue.length === 6) {
        handleSubmit().then((result) => {
          if (result.error) {
            setValue("");
          }
        });
      }
    },
    [handleSubmit],
  );

  return (
    <div className="space-y-4">
      <InputOTP
        maxLength={6}
        value={value}
        onChange={handleValueChange}
        onKeyDown={handleKeyPress}
        disabled={isLoading}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      <div className="text-foreground/60 text-center text-sm">
        {value === "" && (
          <>Введите 6-ти значный код который мы отправили на почту: {email}</>
        )}
      </div>

      {error && <p className="text-destructive text-center text-sm">{error}</p>}

      <Button
        variant="link"
        onClick={onResend}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Отправка...
          </>
        ) : (
          "Отправить код повторно"
        )}
      </Button>
    </div>
  );
}
