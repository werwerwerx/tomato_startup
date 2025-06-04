import { Resend } from "resend";
import { envConfig } from "./config";
import { renderToString } from 'react-dom/server';
import { VerificationEmail } from "./email-templates/verification";

export const resend = new Resend(envConfig.RESEND_API_KEY);

export const sendLoginVerificationMail = async (to: string, verificationLink: string) => {
  const html = renderToString(<VerificationEmail verificationLink={verificationLink} />);
  
  const { data, error } = await resend.emails.send({
    from: "noreply@tomato.dev",
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