import { z } from "zod";

export const loginEmailScmema = z.object({
  email: z.string().email("Введите корректный email адрес"),
});

export const loginEmailErrorMessages: Record<number, string> = {
  404: "Пользователь с таким email не найден",
  200: "Письмо отправлено",
  500: "Не удалось обработать запрос",
};

export const registerEmailErrorMessages: Record<number, string> = {
  404: "Пользователь с таким email уже существует",
  200: "Письмо отправлено",
  500: "Не удалось обработать запрос",
};



export type formStrategy = "register" | "login";