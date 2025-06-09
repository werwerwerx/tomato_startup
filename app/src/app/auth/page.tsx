"use client";
import { Logo } from "../header";
import { Input } from "@/shared/components/ui-kit/input";
import { Button } from "@/shared/components/ui-kit/button";
import { Mail, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { Separator } from "@/shared/components/ui-kit/separator";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FaGithub, FaDiscord, FaYandex } from "react-icons/fa";

interface LoginFormData {
  email: string;
}

export default function AuthPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signIn("resend", {
        email: data.email,
        redirect: false,
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <div className="flex h-[40vh] w-full items-center justify-center p-4 md:p-0 lg:h-[80vh]">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormHeader>
          <h1 className="text-lg font-bold">Вход в систему</h1>
          <Logo className="w-30" />
        </FormHeader>

        <FormSection>
          <EmailFormInput
            type="text"
            {...register("email", {
              required: "Email обязателен",
              validate: (value) => {
                const result = z.string().email().safeParse(value);
                if (!result.success) {
                  return "Введите корректный email";
                }
                return true;
              },
            })}
            label="Введите ваш email"
            placeholder="JohnDoe@gmail.com"
            disabled={isSubmitting}
            error={errors.email?.message}
          />
        </FormSection>

        <FormSection>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Загрузка...
              </>
            ) : (
              "Войти с помощью email"
            )}
          </Button>
          <div className="text-muted-foreground/70 flex w-full flex-row items-center justify-center text-sm font-medium">
            или войти через
          </div>
          <Button
            type="button"
            variant="outline"
            className="!bg-foreground/90 !text-background w-full cursor-pointer"
            onClick={async () => {
              await signIn("yandex");
            }}
          >
            <FaYandex className="mr-2 h-4 w-4" />
            Яндекс
          </Button>
          <div className="flex w-full flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 cursor-pointer"
              onClick={async () => {
                await signIn("github");
              }}
            >
              <FaGithub className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 cursor-pointer"
              onClick={async () => {
                await signIn("discord");
              }}
            >
              <FaDiscord className="mr-2 h-4 w-4" />
              Discord
            </Button>
          </div>
        </FormSection>
      </Form>
    </div>
  );
}

const EmailFormInput = ({
  label,
  name,
  type,
  placeholder,
  error,
  disabled,
  ...props
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  error?: string;
  disabled?: boolean;
} & React.HTMLAttributes<HTMLInputElement>) => {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <label
        htmlFor={name}
        className="text-muted-foreground/70 text-sm font-medium"
      >
        {label}
      </label>
      <div className="bg-muted flex w-full flex-row items-center gap-2 rounded-md border px-2 py-1">
        <Mail className="text-muted-foreground h-5 w-5" />
        <Input
          name={name}
          type={type}
          placeholder={placeholder}
          className="bg-muted placeholder:text-muted-foreground w-full border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={disabled}
          {...props}
        />
      </div>
      {error && (
        <div className="text-destructive text-sm mt-1">{error}</div>
      )}
    </div>
  );
};

const FormSection = ({
  children,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className="bg-background flex flex-col gap-2 rounded-lg border p-5"
      {...props}
    >
      {children}
    </div>
  );
};

const Form = ({
  children,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLFormElement>) => {
  return (
    <form
      className="bg-background/50 flex w-full max-w-md flex-col gap-2 rounded-lg border p-6 shadow-md"
      {...props}
    >
      {children}
    </form>
  );
};

const FormHeader = ({
  children,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className="bg-background flex flex-col gap-2 rounded-lg border border-b p-5 pb-10"
      {...props}
    >
      {children}
    </div>
  );
};
