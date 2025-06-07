"use client";
import { AuthForm } from "./auth-form";
import { AuthFormMediator, AuthApiClient } from "./auth-mediator";
import { VerifyForm } from "./verify-form";
import { apiClient } from "@/shared/api.client";
import { ApiResponse } from "@/shared/types";

const authApiAdapter: AuthApiClient = {
  "LOGIN": apiClient.loginByEmail,
  "REGISTER": apiClient.registerByEmail,
  "LOGIN-VERIFY": apiClient.loginByEmailVerify,
  "REGISTER-VERIFY": apiClient.registerByEmailVerify
};

export default function AuthFormFeature({
}: {
}) {
  const mediator = new AuthFormMediator(authApiAdapter);
  return (
    <>
      <VerifyForm 
        mediator={mediator} 
      />
      <AuthForm
        mediator={mediator} 
      />
    </>
  );
}
