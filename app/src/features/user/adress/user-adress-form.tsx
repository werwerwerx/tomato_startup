"use client";

import { EditIcon, MapPinIcon, X } from "lucide-react";
import { Button } from "@/shared/components/ui-kit/button";
import React, { useState } from "react";
import { useDetectUserGeo } from "../hooks/use-detect-user-geo";
import { useAddressSuggestions } from "../hooks/use-address-suggestions";
import { useAddressForm } from "../hooks/use-address-form";

export const UserAdressForm = ({
  currentAddress,
  onAddressChange,
  isUpdating,
  error: updateError,
  enableGeolocation = true,
}: {
  currentAddress: string;
  onAddressChange: (newAddress: string) => Promise<void>;
  isUpdating: boolean;
  error: string | null;
  enableGeolocation?: boolean;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [validationError, setValidationError] = useState("");

  const {
    isEditing,
    isSubmitting,
    openEditor,
    closeEditor,
    submitAddress,
  } = useAddressForm({
    onSubmit: onAddressChange,
  });

  const { isDetecting, detectLocation } = useDetectUserGeo();

  const {
    suggestions,
    isLoading: isLoadingSuggestions,
    error: suggestError,
    showSuggestions,
    setShowSuggestions,
    handleSuggestionClick,
  } = useAddressSuggestions({
    query: inputValue,
    isEnabled: isEditing,
    maxResults: 5,
    types: ["house", "street"],
  });

  const handleDetectLocation = async () => {
    try {
      const detectedAddress = await detectLocation();
      if (detectedAddress) {
        await onAddressChange(detectedAddress);
      }
    } catch (error) {
      console.error("Ошибка при определении местоположения:", error);
    }
  };

  const handleOpenEditor = () => {
    setInputValue(currentAddress === "Вы ещё не указали адрес доставки" ? "" : currentAddress);
    setValidationError("");
    openEditor();
  };

  const handleCloseEditor = () => {
    setInputValue("");
    setValidationError("");
    closeEditor();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) {
      setValidationError("Адрес не может быть пустым");
      return;
    }
    
    if (inputValue.length < 5) {
      setValidationError("Адрес должен содержать минимум 5 символов");
      return;
    }
    
    if (inputValue.length > 100) {
      setValidationError("Адрес не должен превышать 100 символов");
      return;
    }

    try {
      await submitAddress(inputValue);
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : "Произошла ошибка");
    }
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 150);
  };

  const handleSuggestionSelect = (suggestion: any) => {
    handleSuggestionClick(suggestion, (text: string) => {
      setInputValue(text);
      setValidationError("");
    });
  };

  const LoadingSpinner = () => (
    <div className="absolute top-1/2 right-12 -translate-y-1/2">
      <div className="border-foreground/20 border-t-foreground h-4 w-4 animate-spin rounded-full border-2" />
    </div>
  );

  const SuggestionsDropdown = () => (
    <div className="border-foreground/20 bg-background absolute top-full right-0 left-0 z-[9999] mt-1 max-h-60 overflow-auto rounded-lg border shadow-xl">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          type="button"
          className="border-foreground/10 hover:bg-foreground/5 w-full border-b px-3 py-2 text-left text-sm last:border-b-0"
          onClick={() => handleSuggestionSelect(suggestion)}
        >
          <div className="text-foreground">{suggestion.text}</div>
          {suggestion.subtitle && (
            <div className="text-foreground/60 text-xs">{suggestion.subtitle}</div>
          )}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <div className="relative space-y-2">
        <div className="flex items-center gap-2">
          <MapPinIcon className="text-foreground h-4 w-4" />
          <h4 className="text-foreground text-base font-semibold">
            Адрес доставки
          </h4>
        </div>

        <div className="flex w-full flex-col gap-2">
          <p className="text-foreground/80 text-sm">{currentAddress}</p>

          {updateError && (
            <p className="text-sm text-red-500">{updateError}</p>
          )}

          <div className="flex w-full gap-2">
            {enableGeolocation && (
              <Button
                onClick={handleDetectLocation}
                variant="default"
                size="sm"
                className="flex-1 gap-2"
                disabled={isDetecting || isUpdating}
              >
                {isDetecting ? (
                  <div className="border-primary-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                ) : (
                  <MapPinIcon className="h-4 w-4" />
                )}
                {isDetecting ? "Определяем..." : "Определить"}
              </Button>
            )}

            <Button
              onClick={handleOpenEditor}
              variant="secondary"
              size="sm"
              className="flex-1 gap-2"
              disabled={isUpdating}
            >
              <EditIcon className="h-4 w-4" />
              Изменить
            </Button>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="bg-foreground/90 fixed inset-0 z-[100] flex h-screen w-screen items-center justify-center">
          <div className="container px-4">
            <div className="mx-auto w-full max-w-2xl">
              <form onSubmit={handleSubmit} className="bg-card relative rounded-md border">
                <div className="relative">
                  <div className="flex items-center px-4 py-3">
                    <MapPinIcon
                      size={20}
                      className="text-foreground/60 mr-3 shrink-0"
                    />
                    <input
                      value={inputValue}
                      onChange={(e) => {
                        setInputValue(e.target.value);
                        setValidationError("");
                      }}
                      type="text"
                      placeholder="Введите адрес доставки..."
                      className="placeholder:text-foreground/60 h-full w-full bg-transparent text-base outline-none"
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      autoFocus
                    />

                    {isLoadingSuggestions && <LoadingSpinner />}

                    <button
                      type="button"
                      onClick={handleCloseEditor}
                      className="hover:bg-foreground/5 ml-4 rounded-full p-2 transition-colors"
                    >
                      <X size={20} className="text-foreground/80" />
                    </button>
                  </div>

                  {showSuggestions && suggestions.length > 0 && (
                    <SuggestionsDropdown />
                  )}
                </div>

                <div className="border-foreground/10 space-y-3 border-t px-4 py-3">
                  {validationError && (
                    <p className="text-sm text-red-500">{validationError}</p>
                  )}

                  {suggestError && (
                    <p className="text-xs text-orange-500">
                      Подсказки недоступны: {(suggestError as Error).message}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      disabled={isSubmitting || isUpdating}
                    >
                      {isSubmitting || isUpdating ? "Сохранение..." : "Сохранить"}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCloseEditor}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      disabled={isSubmitting || isUpdating}
                    >
                      Отмена
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="absolute inset-0 -z-10" onClick={handleCloseEditor}></div>
        </div>
      )}
    </>
  );
};
