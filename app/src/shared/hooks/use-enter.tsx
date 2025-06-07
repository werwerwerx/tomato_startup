"use client";

import { useCallback } from "react";

export const useEnter = (callback: () => void) => {
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        callback();
      }
    },
    [callback],
  );
  return handleKeyPress;
};