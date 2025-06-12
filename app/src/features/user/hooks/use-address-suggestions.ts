"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import {
  useGeoSuggest,
  AddressSuggestion,
} from "@/shared/hooks/use-geo-suggest";

export interface UseAddressSuggestionsProps {
  query: string;
  isEnabled: boolean;
  maxResults?: number;
  types?: string[];
}

export interface UseAddressSuggestionsReturn {
  suggestions: AddressSuggestion[];
  isLoading: boolean;
  error: Error | null;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  handleSuggestionClick: (
    suggestion: AddressSuggestion,
    onSelect: (text: string) => void,
  ) => void;
}

export const useAddressSuggestions = ({
  query,
  isEnabled,
  maxResults = 5,
  types = ["house", "street"],
}: UseAddressSuggestionsProps): UseAddressSuggestionsReturn => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedQuery] = useDebounce(query || "", 300);

  const {
    data: suggestions = [],
    isLoading,
    error,
  } = useGeoSuggest(debouncedQuery, {
    maxResults,
    types,
  });

  useEffect(() => {
    const shouldShow =
      isEnabled &&
      suggestions.length > 0 &&
      Boolean(query) &&
      query.length >= 3;

    setShowSuggestions(shouldShow);
  }, [suggestions, isEnabled, query]);

  const handleSuggestionClick = (
    suggestion: AddressSuggestion,
    onSelect: (text: string) => void,
  ) => {
    onSelect(suggestion.text);
    setShowSuggestions(false);
  };

  return {
    suggestions,
    isLoading,
    error,
    showSuggestions,
    setShowSuggestions,
    handleSuggestionClick,
  };
};
