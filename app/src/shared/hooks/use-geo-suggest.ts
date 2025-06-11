import { useQuery } from "@tanstack/react-query";

export interface AddressSuggestion {
  text: string;
  subtitle?: string;
}

interface UseGeoSuggestOptions {
  maxResults?: number;
  types?: string[];
}

/**
 * Получает подсказки адресов через наш API роут (который проксирует запросы к Яндекс API)
 * @param query - поисковый запрос (минимум 3 символа)
 * @param options - опции поиска (количество результатов, типы объектов)
 */
const fetchAddressSuggestions = async (
  query: string,
  options: UseGeoSuggestOptions = {},
): Promise<AddressSuggestion[]> => {
  const { maxResults = 5, types = ["house", "street"] } = options;

  if (!query || query.length < 3) {
    return [];
  }

  const searchParams = new URLSearchParams({
    text: query,
    results: maxResults.toString(),
  });

  if (types.length > 0) {
    searchParams.append("types", types.join(","));
  }

  const apiUrl = `/api/geo-suggest?${searchParams.toString()}`;
  
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    const suggestions = data.results?.map((item: any) => ({
      text: item.title?.text || item.text,
      subtitle: item.subtitle?.text,
    })) || [];

    return suggestions;
  } catch (error) {
    console.error("Geo suggest API error:", error);
    return [];
  }
};

/**
 * Хук для получения подсказок адресов с автоматическим кэшированием
 * @param query - поисковый запрос
 * @param options - опции поиска
 */
export const useGeoSuggest = (
  query: string,
  options: UseGeoSuggestOptions = {},
) => {
  return useQuery({
    queryKey: ["geo-suggest", query, options],
    queryFn: () => fetchAddressSuggestions(query, options),
    enabled: Boolean(query && query.length >= 3),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
};
