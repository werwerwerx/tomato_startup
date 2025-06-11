"use client";

import { EditIcon, MapPinIcon, ChevronDownIcon, X } from "lucide-react";
import { Button } from "@/shared/components/ui-kit/button";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDebounce } from "use-debounce";
import { cn, withDelay } from "@/shared/lib/utils";
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
  enableGeolocation?: boolean; // Новая фича для определения местоположения
}

const DEFAULT_ADDRESS = "Вы ещё не указали адрес доставки";

export const UserAdressForm = ({
  initialAddress = DEFAULT_ADDRESS,
  onAddressChange,
  enableGeolocation = true, // По умолчанию включена
}: UserAddressProps) => {
  // Состояние компонента
  const [isEditing, setIsEditing] = React.useState(false);
  const [isInputVisible, setIsInputVisible] = React.useState(false);
  const [currentAddress, setCurrentAddress] = React.useState(initialAddress);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [isDetecting, setIsDetecting] = React.useState(false); // Для индикатора загрузки

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
    handleClose();

    if (onAddressChange) {
      await onAddressChange(data.address);
    }

    reset({ address: data.address });
  };

  // Заглушка для определения местоположения
  const handleDetectLocation = async () => {
    setIsDetecting(true);
    
    try {
      // Здесь будет логика определения местоположения
      await new Promise(resolve => setTimeout(resolve, 2000)); // Имитация запроса
      
      // Заглушка - устанавливаем тестовый адрес
      const detectedAddress = "г. Москва, ул. Тверская, д. 1";
      setCurrentAddress(detectedAddress);
      
      if (onAddressChange) {
        await onAddressChange(detectedAddress);
      }
      
      console.log("Местоположение определено (заглушка):", detectedAddress);
    } catch (error) {
      console.error("Ошибка определения местоположения:", error);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleOpen = () => {
    setIsEditing(true);
    withDelay(() => setIsInputVisible(true));
  };

  const handleClose = () => {
    setIsInputVisible(false);
    setShowSuggestions(false);
    withDelay(() => {
      setIsEditing(false);
      // Возвращаем предыдущее значение если отменили
      const previousValue = currentAddress === DEFAULT_ADDRESS ? "" : currentAddress;
      reset({ address: previousValue });
    });
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

  const LoadingSpinner = () => (
    <div className="absolute top-1/2 right-12 -translate-y-1/2">
      <div className="border-foreground/20 border-t-foreground h-4 w-4 animate-spin rounded-full border-2" />
    </div>
  );

  const DropdownIcon = () => (
    <ChevronDownIcon className="text-foreground/60 absolute top-1/2 right-12 h-4 w-4 -translate-y-1/2" />
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
    <>
      {/* Обычное состояние */}
      <div className="space-y-2 relative">
        {/* Заголовок секции */}
        <div className="flex items-center gap-2">
          <MapPinIcon className="text-foreground h-4 w-4" />
          <h4 className="text-foreground text-base font-semibold">
            Адрес доставки
          </h4>
        </div>

        {/* Отображение текущего адреса */}
        <div className="flex w-full flex-col gap-2">
          <p className="text-foreground/80 text-sm">{currentAddress}</p>
          
          {/* Кнопки управления */}
          <div className="flex gap-2 w-full">
            {enableGeolocation && (
              <Button
                onClick={handleDetectLocation}
                variant="default"
                size="sm"
                className="flex-1 gap-2"
                disabled={isDetecting}
              >
                {isDetecting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <MapPinIcon className="h-4 w-4" />
                )}
                {isDetecting ? "Определяем..." : "Определить"}
              </Button>
            )}
            
            <Button
              onClick={handleOpen}
              variant="secondary"
              size="sm"
              className="flex-1 gap-2"
            >
              <EditIcon className="h-4 w-4" />
              Изменить
            </Button>
          </div>
        </div>
      </div>

      {/* Полноэкранный режим редактирования */}
      {isEditing && (
        <div
          className={cn(
            "bg-foreground/90 fixed inset-0 z-[100] flex h-screen w-screen flex-col items-center justify-center transition-opacity duration-300",
            isEditing ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="container flex w-full items-center justify-center px-4">
            <div className="flex w-[90%] max-w-2xl items-center justify-center">
              <form 
                onSubmit={handleSubmit(handleFormSubmit)}
                className={cn(
                  "bg-card relative flex w-full flex-col rounded-md border transition-all duration-300",
                  isInputVisible ? "opacity-100" : "opacity-0",
                )}
              >
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <div className="flex items-center px-4 py-3">
                        <MapPinIcon
                          size={20}
                          className="text-foreground/60 mr-3 shrink-0"
                        />
                        <input
                          {...field}
                          type="text"
                          placeholder="Введите адрес доставки..."
                          className="placeholder:text-foreground/60 h-full w-full bg-transparent text-base outline-none"
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                          autoFocus
                        />

                        {/* Индикатор загрузки */}
                        {isLoadingSuggestions && <LoadingSpinner />}

                        {/* Иконка выпадающего списка */}
                        {!isLoadingSuggestions && suggestions.length > 0 && <DropdownIcon />}

                        <button
                          type="button"
                          onClick={handleClose}
                          className="hover:bg-foreground/5 ml-4 rounded-full p-2 transition-colors"
                        >
                          <X size={20} className="text-foreground/80" />
                        </button>
                      </div>

                      {/* Выпадающий список подсказок */}
                      {showSuggestions && suggestions.length > 0 && <SuggestionsDropdown />}
                    </div>
                  )}
                />

                {/* Кнопки и ошибки */}
                <div className="border-t border-foreground/10 px-4 py-3 space-y-3">
                  {/* Сообщения об ошибках */}
                  {errors.address && (
                    <p className="text-sm text-red-500">{errors.address.message}</p>
                  )}

                  {suggestError && (
                    <p className="text-xs text-orange-500">
                      Подсказки недоступны: {(suggestError as Error).message}
                    </p>
                  )}

                  {/* Кнопки управления */}
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      Сохранить
                    </Button>
                    <Button
                      type="button"
                      onClick={handleClose}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Отмена
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          {/* Кликабельная область для закрытия */}
          <div className="absolute inset-0 -z-10" onClick={handleClose}></div>
        </div>
      )}
    </>
  );
};
