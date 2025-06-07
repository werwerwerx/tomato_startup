import { Resend } from "resend";
import { envConfig } from "./config";
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { VerificationEmail } from "./email-templates/login-verification";
import { renderHtml } from "./renderHtml";
import { RegisterVerifyEmail } from "./email-templates/register-verify";

export const resend = new Resend(envConfig.RESEND_API_KEY);

export const sendRegisterVerificationCode = async (to: string, code: string) => {
  const html = await renderHtml(
    <RegisterVerifyEmail code={code} />
  );

  const { data, error } = await resend.emails.send({
    from: "Tomato <onboarding@resend.dev>",
    to,
    subject: "Tomato Verification Code",
    html,
    
  });

  if (error) {
    console.error('Failed to send verification email:', error);
    throw error;
  }

  return data;
}

export const sendLoginVerificationMail = async (to: string, verificationLink: string) => {
  const html = await renderHtml(
    <VerificationEmail verificationLink={verificationLink} />
);
  
  const { data, error } = await resend.emails.send({
    from: "Tomato <onboarding@resend.dev>",
    to,
    subject: "Tomato Verification Code",
    html,
    
  });

  if (error) {
    console.error('Failed to send verification email:', error);
    throw error;
  }

  return data;
} 

