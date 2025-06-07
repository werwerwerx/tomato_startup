import { Logo } from "@/app/header";
import { Button } from "@/shared/components/ui-kit/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/shared/components/ui-kit/input-otp";
import { Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { AuthFormMediator } from "./auth-mediator";
import { NotifyUser } from "./components/notify-user";

type CodeInputProps = {
  isLoading: boolean;
  code: string;
  email: string;
  onChange: (code: string) => void;
  mediator: AuthFormMediator;
};

type SubmitCodeButtonProps = {
  isLoading: boolean;
  code: string;
  onSubmit: (code: string) => void;
};

export const VerifyForm = ({ mediator }: { mediator: AuthFormMediator }) => {
  const formStrategy = mediator.useAuthStrategy();
  const isLoading = mediator.useIsLoading();
  const [code, setCode] = useState("");
  const email = mediator.getEmail();
  const message = mediator.useMessage();

  const handleCodeChange = useCallback(
    (newValue: string) => {
      setCode(newValue);
      mediator.changeCodeAction(newValue);
    },
    [mediator],
  );

  const handleSubmitCode = useCallback(
    (code: string) => {
      mediator.submitCodeAction(code);
    },
    [mediator],
  );

  // Conditional rendering after all hooks and callbacks
  if (formStrategy === "LOGIN" || formStrategy === "REGISTER") {
    return null;
  }

  return (
    <div className="flex w-full max-w-[90%] flex-col gap-5 md:max-w-[500px]">
      <div className="flex flex-col gap-2">
        <Logo className="w-40" />
        <h1 className="text-2xl font-bold">
          {formStrategy === "LOGIN-VERIFY"
            ? "Подтверждение входа"
            : "Подтверждение регистрации"}
        </h1>
      </div>

      <div className="flex flex-col gap-4">
        <CodeInput
          isLoading={isLoading}
          code={code}
          email={email}
          onChange={handleCodeChange}
          mediator={mediator}
        />
        <SubmitCodeButton
          isLoading={isLoading}
          code={code}
          onSubmit={handleSubmitCode}
        />
      </div>
    </div>
  );
};

function CodeInput({ isLoading, code, email, onChange, mediator }: CodeInputProps) {
  return (
    <div className="space-y-4">
      <InputOTP maxLength={6} onChange={onChange} disabled={isLoading}>
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
        {code === "" && (
          <>Введите 6-ти значный код который мы отправили на почту: {email}</>
        )}
      </div>
      <NotifyUser mediator={mediator} />
    </div>
  );
}

function SubmitCodeButton({
  isLoading,
  code,
  onSubmit,
}: SubmitCodeButtonProps) {
  return (
    <Button
      variant="link"
      onClick={() => onSubmit(code)}
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
  );
}
