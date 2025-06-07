import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().email("Неверный формат email").min(1, "Email обязателен"),
});

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