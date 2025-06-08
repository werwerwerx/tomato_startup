import { AuthFormMediator } from "../auth-mediator";
import { useState, useEffect } from "react";

export const NotifyUser = ({ mediator }: { mediator: AuthFormMediator }) => {
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const error = mediator.useError();
  const message = mediator.useMessage();

  useEffect(() => {
    if (error !== null) {
      setCurrentMessage(error);
    } else if (message !== null) {
      setCurrentMessage(message);
    } else {
      setCurrentMessage(null);
    }
  }, [error, message]);

  if (!currentMessage) return null;

  return (
    <p 
      className={`mt-1 text-sm ${
        error ? "text-destructive" : "text-green-500"
      }`}
    >
      {currentMessage}
    </p>
  );
}; 