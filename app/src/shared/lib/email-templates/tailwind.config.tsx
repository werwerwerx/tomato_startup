import { Tailwind } from "@react-email/tailwind";

const config = {
  theme: {
    extend: {
      colors: {
        background: 'oklch(1 0 0)',
        foreground: 'oklch(0.180 0 0)',
        card: 'oklch(1 0 0)',
        'card-foreground': 'oklch(0.145 0 0)',
        popover: 'oklch(1 0 0)',
        'popover-foreground': 'oklch(0.145 0 0)',
        primary: 'oklch(0.66 0.2224 32.99)',
        'primary-foreground': 'oklch(1 0 0)',
        secondary: 'oklch(0.97 0 0)',
        'secondary-foreground': 'oklch(0.205 0 0)',
        muted: 'oklch(0.97 0 0)',
        'muted-foreground': 'oklch(0.556 0 0)',
        accent: 'oklch(0.97 0 0)',
        'accent-foreground': 'oklch(0.205 0 0)',
        destructive: 'oklch(0.577 0.245 27.325)',
        border: 'oklch(0.922 0 0)',
        input: 'oklch(0.922 0 0)',
        ring: 'oklch(0.708 0 0)',
      },
      borderRadius: {
        DEFAULT: '10px',
        sm: '6px',
        md: '8px',
        lg: '10px',
        xl: '14px',
      },
      fontFamily: {
        sans: ['Comfortaa', 'system-ui', 'sans-serif'],
      },
    },
  },
};

export const TailwindProvider = ({ children }: { children: React.ReactNode }) => (
  <Tailwind config={config}>
    {children}
  </Tailwind>
);