"use client";

import { cn } from "@/shared/lib/utils";

interface VerificationCodeProps {
  code: string;
  className?: string;
}

const CodeDisplay = ({ code }: { code: string }) => {
  return (
    <div className="inline-flex gap-2 my-4">
      {code.split("").map((digit, i) => (
        <div
          key={i}
          className="w-9 h-12 rounded-md bg-gray-100 flex items-center justify-center border border-gray-200"
        >
          <span className="text-xl font-semibold text-gray-900">{digit}</span>
        </div>
      ))}
    </div>
  );
};

export const RegisterVerifyEmail = ({ code, className }: VerificationCodeProps) => {
  return (
    <div className={cn("w-full max-w-[600px] mx-auto p-8 bg-white text-gray-900", className)}>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Подтвердите ваш email</h1>
        <p className="text-gray-600">
          Для завершения регистрации, пожалуйста, введите этот код на сайте:
        </p>
      </div>

      <div className="text-center">
        <CodeDisplay code={String(code)} />
      </div>

      <div className="mt-8 text-sm text-gray-600">
        <p>
          Если вы не запрашивали этот код, пожалуйста, проигнорируйте это письмо.
        </p>
        <p className="mt-2">
          Код действителен в течение 10 минут.
        </p>
      </div>

      <div className="mt-8 pt-8 border-t border-gray-200 text-center text-xs text-gray-500">
        <p>
          Это автоматическое письмо, пожалуйста, не отвечайте на него.
        </p>
      </div>
    </div>
  );
};