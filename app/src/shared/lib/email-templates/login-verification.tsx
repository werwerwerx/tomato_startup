import { FC } from 'react';
import { envConfig } from '../config';
import { TailwindProvider } from './tailwind.config';

interface VerificationEmailProps {
  code: string;
}

export const VerificationEmail: FC<VerificationEmailProps> = ({ code }) => {
  return (
    <TailwindProvider>
      <div className="w-full max-w-[600px] flex flex-col gap-4 mx-auto p-8 text-foreground bg-background font-sans">
        <div className="m-2 text-xl text-primary font-bold">
          Tomato
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Подтверждение входа</h1>
          <p className="text-gray-600">
            Для входа в систему, пожалуйста, введите этот код на сайте:
          </p>
        </div>

        <div className="text-center">
          <div className="flex justify-center gap-2 mb-4">
            {code.split('').map((digit, index) => (
              <div 
                key={index}
                className="w-12 h-12 flex items-center justify-center border-2 border-gray-300 rounded-md text-2xl font-bold bg-gray-50"
              >
                {digit}
              </div>
            ))}
          </div>
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
    </TailwindProvider>
  );
}; 