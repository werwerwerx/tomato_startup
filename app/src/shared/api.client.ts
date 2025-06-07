import { SendLoginEmailRPC } from "@/app/api/user/auth/login/email/route";

export interface ApiClient {
  registerByEmail: SendLoginEmailRPC;
  loginByEmail: SendLoginEmailRPC;
  registerByEmailVerify: SendLoginEmailRPC;
  loginByEmailVerify: SendLoginEmailRPC;
}

export const apiClient: ApiClient = {
  registerByEmail: async (email) => {
    try {
    const res = await fetch("/api/user/auth/register/email", {
      method: "POST",
      body: JSON.stringify({ email }),
      }).then((res) => res.json());
      return res;
    } catch (error) {
      console.error(error);
      return { error: "Не удалось отправить письмо" };
    }
  },
  loginByEmail: async (email) => {
    const res = await fetch("/api/user/auth/login/email", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    return res.json();
  },
  registerByEmailVerify: async (code) => {
    const res = await fetch("/api/user/auth/register/email/verify", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
    return res.json();
  },
  loginByEmailVerify: async (code) => {
    const res = await fetch("/api/user/auth/login/email/verify", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
    return res.json();
  },
}