import { z } from "zod";

export type AuthStrategy = "login" | "register";

export const emailSchema = z.object({
  email: z.string().email("Неверный формат email").min(1, "Email обязателен"),
});

export type EmailSchema = z.infer<typeof emailSchema>;

export const LOGIN_EMAIL_ERROR_MSGS = {
  400: "Неверный запрос",
  404: "Пользователь с таким email не найден",
  500: "Произошла ошибка на сервере",
  VALIDATION: "Проверьте правильность введенных данных",
  UNKNOWN: "Неизвестная ошибка",
} as const;

export const REGISTER_EMAIL_ERROR_MSGS = {
  400: "Неверный запрос",
  409: "Пользователь с таким email уже существует",
  500: "Произошла ошибка на сервере",
  VALIDATION: "Проверьте правильность введенных данных",
  UNKNOWN: "Неизвестная ошибка",
} as const;

export type AuthResponse = {
  message?: string;
  error?: string;
};

export interface AuthBehavior {
  url: string;
  schema: z.ZodSchema;
  errorMessages: Record<string | number, string>;
  redirectTo: string | "prev";
}

export interface UseAuthResult {
  email: string;
  setEmail: (value: string) => void;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  handleSubmit: () => Promise<void>;
  validateEmail: () => boolean;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  reset: () => void;
  resend: () => void;
} 