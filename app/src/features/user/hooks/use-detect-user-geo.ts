"use client";

import { useState } from "react";

export interface GeolocationPosition {
  latitude: number;
  longitude: number;
}

export interface GeocodeResponse {
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  formatted: string;
}

export interface UseDetectUserGeoReturn {
  isDetecting: boolean;
  error: string | null;
  detectLocation: () => Promise<string | null>;
}

export const useDetectUserGeo = (): UseDetectUserGeoReturn => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectLocation = async (): Promise<string | null> => {
    setIsDetecting(true);
    setError(null);

    try {
      if (!navigator.geolocation) {
        throw new Error("Геолокация не поддерживается браузером");
      }

      const position = await getCurrentPosition();
      const address = await reverseGeocode(position);
      
      return address;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Неизвестная ошибка";
      setError(errorMessage);
      console.error("Ошибка определения местоположения:", err);
      return null;
    } finally {
      setIsDetecting(false);
    }
  };

  return {
    isDetecting,
    error,
    detectLocation,
  };
};

const getCurrentPosition = async (): Promise<GeolocationPosition> => {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => {
        let errorMessage = "Ошибка получения местоположения";
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = "Доступ к геолокации запрещен. Разрешите доступ в настройках браузера";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Местоположение недоступно";
            break;
          case err.TIMEOUT:
            errorMessage = "Время ожидания определения местоположения истекло";
            break;
        }
        
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000, // 5 минут
      }
    );
  });
};

const reverseGeocode = async (position: GeolocationPosition): Promise<string> => {
  const params = new URLSearchParams({
    lat: position.latitude.toString(),
    lon: position.longitude.toString(),
  });

  const response = await fetch(`/api/geo-reverse?${params.toString()}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Ошибка получения адреса");
  }

  const data: GeocodeResponse = await response.json();
  return data.address;
};
