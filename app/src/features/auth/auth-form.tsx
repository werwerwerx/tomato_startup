import { Logo } from "@/app/header";
import { Input } from "@/shared/components/input";
import { Button } from "@/shared/components/ui-kit/button";
import { Loader2, Mail } from "lucide-react";
import { AuthFormMediator, AuthStrategy } from "./auth-mediator";
import { useEnter } from "@/shared/hooks/use-enter";
import { useCallback, useState, useEffect } from "react";
import { NotifyUser } from "./components/notify-user";

type EmailInputProps = {
  initialEmail: string;
  onEmailChange: (email: string) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  isLoading: boolean;
  mediator: AuthFormMediator;
};

type SubmitEmailButtonProps = {
  isLoading: boolean;
  email: string;
  formStrategy: AuthStrategy;
  onSubmit: () => void;
};

type ToggleAuthStrategyButtonProps = {
  formStrategy: AuthStrategy;
  onToggle: () => void;
};

export const AuthForm = ({ mediator }: { mediator: AuthFormMediator }) => {
  const formStrategy = mediator.useAuthStrategy();
  const isLoading = mediator.useIsLoading();
  const [email, setEmail] = useState("");

  const handleKeyPress = useEnter(mediator.submitEmailAction);
  const handleToggleStrategy = useCallback(() => {
    mediator.toggleAuthStrategyAction();
  }, [mediator]);

  const handleEmailChange = useCallback((newEmail: string) => {
    setEmail(newEmail);
    mediator.changeEmailAction(newEmail);
  }, [mediator]);

  if (formStrategy === "LOGIN-VERIFY" || formStrategy === "REGISTER-VERIFY") {
    return null;
  }

  return (
    <div className="flex w-full max-w-[90%] flex-col gap-5 md:max-w-[500px]">
      <div className="flex flex-col gap-2">
        <Logo className="w-40" />
        <h1 className="text-2xl font-bold">
          {formStrategy === "LOGIN" ? "Вход" : "Регистрация"}
        </h1>
      </div>

      <div className="flex flex-col gap-2">
        <EmailInput
          initialEmail={email}
          onEmailChange={handleEmailChange}
          handleKeyPress={handleKeyPress}
          onBlur={() => mediator.validateEmail(email)}
          isLoading={isLoading}
          mediator={mediator}
        />

        <SubmitEmailButton
          isLoading={isLoading}
          email={email}
          formStrategy={formStrategy}
          onSubmit={mediator.submitEmailAction}
        />

        <ToggleAuthButton
          formStrategy={formStrategy}
          onToggle={handleToggleStrategy}
        />
      </div>
    </div>
  );
};

function EmailInput({
  initialEmail,
  onEmailChange,
  handleKeyPress,
  onBlur,
  isLoading,
  mediator
}: EmailInputProps) {
  const [localEmail, setLocalEmail] = useState(initialEmail);

  useEffect(() => {
    setLocalEmail(initialEmail);
  }, [initialEmail]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setLocalEmail(newEmail);
    onEmailChange(newEmail);
  }, [onEmailChange]);

  return (
    <div>
      <label htmlFor="email" className="text-foreground/60 text-sm font-medium">
        Введите адрес электронной почты
      </label>
      <div className="flex flex-row items-center gap-2 rounded-lg border px-2">
        <Mail className="text-foreground/60 h-4 w-4" />
        <Input
          id="email"
          type="email"
          value={localEmail}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          onBlur={onBlur}
          className="w-full border-none outline-none"
          placeholder="example@example.com"
          disabled={isLoading}
        />
      </div>
      <NotifyUser mediator={mediator} />
    </div>
  );
}

function SubmitEmailButton({
  isLoading,
  email,
  formStrategy,
  onSubmit,
}: SubmitEmailButtonProps) {
  return (
    <Button className="w-full" onClick={onSubmit} disabled={isLoading || !email}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Загрузка...
        </>
      ) : formStrategy === "LOGIN" ? (
        "Войти"
      ) : (
        "Зарегистрироваться"
      )}
    </Button>
  );
}

function ToggleAuthButton({ formStrategy, onToggle }: ToggleAuthStrategyButtonProps) {
  return (
    <p className="text-foreground/60 text-sm">
      {formStrategy === "LOGIN" ? "Нет аккаунта?" : "Уже есть аккаунт?"}
      <button className="text-primary ml-1 font-bold" onClick={onToggle}>
        {formStrategy === "LOGIN" ? "Зарегистрироваться" : "Войти"}
      </button>
    </p>
  );
}