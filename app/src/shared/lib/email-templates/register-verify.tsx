import { TailwindProvider } from './tailwind.config';

interface VerificationCodeProps {
  code: string;
}

export const RegisterVerifyEmail = ({ code }: VerificationCodeProps) => {
  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '32px',
      backgroundColor: '#ffffff',
      color: '#1a1a1a'
    }}>
      <div style={{
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '600',
          marginBottom: '8px',
          color: '#1a1a1a'
        }}>
          Подтвердите ваш email
        </h1>
        <p style={{
          color: '#666666',
          fontSize: '16px',
          lineHeight: '1.5'
        }}>
          Для завершения регистрации, пожалуйста, введите этот код на сайте:
        </p>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '32px'
      }}>
        {code.split('').map((digit, index) => (
          <div 
            key={index}
            style={{
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #e5e5e5',
              borderRadius: '8px',
              fontSize: '24px',
              fontWeight: '600',
              backgroundColor: '#f9f9f9',
              color: '#1a1a1a'
            }}
          >
            {digit}
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '32px',
        fontSize: '14px',
        color: '#666666',
        lineHeight: '1.5'
      }}>
        <p>
          Если вы не запрашивали этот код, пожалуйста, проигнорируйте это письмо.
        </p>
        <p style={{ marginTop: '8px' }}>
          Код действителен в течение 10 минут.
        </p>
      </div>

      <div style={{
        marginTop: '32px',
        paddingTop: '32px',
        borderTop: '1px solid #e5e5e5',
        textAlign: 'center',
        fontSize: '12px',
        color: '#999999'
      }}>
        <p>
          Это автоматическое письмо, пожалуйста, не отвечайте на него.
        </p>
      </div>
    </div>
  );
};