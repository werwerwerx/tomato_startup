"use client";
import { useState, useCallback } from "react";

export interface UseAddressFormProps {
  onSubmit: (address: string) => Promise<void>;
}

export interface UseAddressFormReturn {
  isEditing: boolean;
  isSubmitting: boolean;
  openEditor: () => void;
  closeEditor: () => void;
  submitAddress: (address: string) => Promise<void>;
}

export const useAddressForm = ({ 
  onSubmit 
}: UseAddressFormProps): UseAddressFormReturn => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const openEditor = useCallback(() => {
    setIsEditing(true);
  }, []);

  const closeEditor = useCallback(() => {
    setIsEditing(false);
  }, []);

  const submitAddress = useCallback(async (address: string) => {
    if (!address.trim()) {
      throw new Error("Адрес не может быть пустым");
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(address);
      setIsEditing(false);
    } catch (error) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit]);

  return {
    isEditing,
    isSubmitting,
    openEditor,
    closeEditor,
    submitAddress,
  };
};
