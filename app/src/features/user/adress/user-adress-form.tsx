"use client";

import { EditIcon, MapPinIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "@/shared/components/ui-kit/button";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDebounce } from "use-debounce";
import {
  useGeoSuggest,
  AddressSuggestion,
} from "@/shared/hooks/use-geo-suggest";

// Схема валидации адреса
const addressSchema = z.object({
  address: z
    .string()
    .min(5, "Адрес должен содержать минимум 5 символов")
    .max(100, "Адрес не должен превышать 100 символов"),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface UserAddressProps {
  initialAddress?: string;
  onAddressChange?: (newAddress: string) => Promise<void>;
}

const DEFAULT_ADDRESS = "Вы ещё не указали адрес доставки";

export const UserAdressForm = ({
  initialAddress = DEFAULT_ADDRESS,
  onAddressChange,
}: UserAddressProps) => {
  // Состояние компонента
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentAddress, setCurrentAddress] = React.useState(initialAddress);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  // Настройка формы с валидацией
  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: currentAddress === DEFAULT_ADDRESS ? "" : currentAddress,
    },
  });

  const { control, handleSubmit, reset, setValue, watch, formState } = form;
  const { errors, isSubmitting } = formState;

  const watchedAddress = watch("address");
  
  const [debouncedQuery] = useDebounce(watchedAddress || "", 300);

  const {
    data: suggestions = [],
    isLoading: isLoadingSuggestions,
    error: suggestError,
  } = useGeoSuggest(debouncedQuery, {
    maxResults: 5,
    types: ["house", "street"],
  });

  React.useEffect(() => {
    const shouldShow = isEditing && 
                     suggestions.length > 0 && 
                     Boolean(watchedAddress) && 
                     watchedAddress.length >= 3;
    
    setShowSuggestions(shouldShow);
  }, [suggestions, isEditing, watchedAddress]);

  const handleFormSubmit = async (data: AddressFormData) => {
    setCurrentAddress(data.address);
    setIsEditing(false);
    setShowSuggestions(false);

    if (onAddressChange) {
      await onAddressChange(data.address);
    }

    reset({ address: data.address });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowSuggestions(false);
    
    const previousValue = currentAddress === DEFAULT_ADDRESS ? "" : currentAddress;
    reset({ address: previousValue });
  };

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    setValue("address", suggestion.text);
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const LoadingSpinner = () => (
    <div className="absolute top-1/2 right-3 -translate-y-1/2">
      <div className="border-foreground/20 border-t-foreground h-4 w-4 animate-spin rounded-full border-2" />
    </div>
  );

  const DropdownIcon = () => (
    <ChevronDownIcon className="text-foreground/60 absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
  );

  const SuggestionsDropdown = () => (
    <div className="border-foreground/20 bg-background absolute top-full right-0 left-0 z-[9999] mt-1 max-h-60 overflow-auto rounded-lg border shadow-xl">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          type="button"
          className="border-foreground/10 hover:bg-foreground/5 w-full border-b px-3 py-2 text-left text-sm last:border-b-0"
          onClick={() => handleSuggestionClick(suggestion)}
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
    <div className="space-y-2 relative">
      {/* Заголовок секции */}
      <div className="flex items-center gap-2">
        <MapPinIcon className="text-foreground h-4 w-4" />
        <h4 className="text-foreground text-base font-semibold">
          Адрес доставки
        </h4>
      </div>

      {isEditing ? (
        /* Форма редактирования */
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3 relative z-50">
          <div className="relative space-y-2">
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <div className="flex w-full flex-col gap-2 md:flex-row">
                    {/* Поле ввода с подсказками */}
                    <div className="relative w-full md:flex-1">
                      <input
                        {...field}
                        placeholder="Начните вводить адрес (г. Москва, ул. Пушкина...)"
                        className="border-foreground/20 bg-background text-foreground placeholder-foreground/60 w-full rounded-lg border px-3 py-2 pr-8 text-sm"
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                      />

                      {/* Индикатор загрузки */}
                      {isLoadingSuggestions && <LoadingSpinner />}

                      {/* Иконка выпадающего списка */}
                      {!isLoadingSuggestions && suggestions.length > 0 && <DropdownIcon />}

                      {/* Выпадающий список подсказок */}
                      {showSuggestions && suggestions.length > 0 && <SuggestionsDropdown />}
                    </div>

                    {/* Кнопки управления */}
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        variant="secondary"
                        size="sm"
                        className="flex-1 md:flex-none"
                        disabled={isSubmitting}
                      >
                        Сохранить
                      </Button>
                      <Button
                        type="button"
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
                        className="flex-1 md:flex-none"
                      >
                        Отмена
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            />

            {/* Сообщения об ошибках */}
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}

            {suggestError && (
              <p className="text-xs text-orange-500">
                Подсказки недоступны: {(suggestError as Error).message}
              </p>
            )}
          </div>
        </form>
      ) : (
        /* Отображение текущего адреса */
        <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="text-foreground/80 text-sm">{currentAddress}</p>
          <Button
            onClick={startEditing}
            variant="secondary"
            size="sm"
            className="w-full gap-2 md:w-auto"
          >
            <EditIcon className="h-4 w-4" />
            Изменить
          </Button>
        </div>
      )}
    </div>
  );
};
