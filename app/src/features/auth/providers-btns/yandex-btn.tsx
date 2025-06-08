import { signIn } from 'next-auth/react';

export default function YandexLoginButton() {
  return (
    <button 
      onClick={() => signIn('yandex')} 
      style={{
        padding: '10px 20px',
        background: '#FF0000', 
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M12 0a12 12 0 100 24 12 12 0 000-24zm1.56 5.85h3.07v12.3h-3.07v-1.6c-.78.98-1.94 1.6-3.38 1.6-2.16 0-3.9-1.5-3.9-4.05 0-2.6 1.74-4.05 3.9-4.05 1.44 0 2.6.62 3.38 1.6v-1.6zm0 6.15c0-.8-.56-1.35-1.44-1.35-.88 0-1.44.55-1.44 1.35 0 .8.56 1.35 1.44 1.35.88 0 1.44-.55 1.44-1.35z"/>
      </svg>
      Войти с Яндекс ID
    </button>
  );
}
