import { AuthFormMediator } from "../auth-mediator";

export const NotifyUser = ({ mediator }: { mediator: AuthFormMediator }) => {
  const error = mediator.useError();
  const message = mediator.useMessage();

  if (!error && !message) return null;

  return (
    <p 
      className={`mt-1 text-sm ${
        error ? "text-destructive" : "text-green-500"
      }`}
    >
      {error || message}
    </p>
  );
}; 