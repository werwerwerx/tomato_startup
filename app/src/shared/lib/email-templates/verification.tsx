import { FC } from 'react';
import { envConfig } from '../config';
import { TailwindProvider } from './tailwind.config';
interface VerificationEmailProps {
  verificationLink: string;
}

export const VerificationEmail: FC<VerificationEmailProps> = ({ verificationLink }) => {
  return (
    <TailwindProvider>
      <div className="font-sans max-w-[600px] mx-auto p-5 bg-background">
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;500;600;700&display=swap" rel="stylesheet" />
        </head>
        <div className="text-center mb-8">
          {envConfig.NODE_ENV === "production" ? (
            <img 
            src={`${envConfig.IS_HTTPS ? "https" : "http"}://${envConfig.APP_URL}/logo.png`} 
            alt="Tomato Logo" 
            className="w-[120px] h-auto mx-auto"
          />
          ) : (
            <h1 className="text-primary text-2xl mb-5 text-center font-semibold font-sans">Tomato</h1>
          )}
        </div>

        <div className="bg-card p-8 rounded-lg mb-5">
          <h1 className="text-foreground text-2xl mb-5 text-center font-semibold">
            Подтверждение email
          </h1>

          <p className="text-muted-foreground text-base leading-relaxed mb-5">
            Для того чтобы войти в Tomato, пожалуйста, перейдите по ссылке ниже:
          </p>

          <div className="bg-background p-5 rounded-md text-center mb-5 border border-border">
            <span className="text-foreground text-3xl font-bold tracking-wider">
              {verificationLink}
            </span>
          </div>

          <p className="text-muted-foreground text-sm text-center">
            Этот код действителен в течение 10 минут.
          </p>
        </div>

        <div className="text-center text-muted-foreground text-xs mt-8">
          <p>Если вы не запрашивали этот код, просто проигнорируйте это письмо.</p>
          <p>© 2024 Tomato. Все права защищены.</p>
        </div>
      </div>
    </TailwindProvider>
  );
}; 