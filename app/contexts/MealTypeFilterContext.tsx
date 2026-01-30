"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Common meal type categories that might appear
export const MEAL_TYPE_CATEGORIES = {
  // Finnish meal types
  "Lounas": { label: "Lunch", color: "blue" },
  "Kasvislounas": { label: "Vegetarian Lunch", color: "green" },
  "Vegan lounas": { label: "Vegan Lunch", color: "emerald" },
  "Jälkiruoka": { label: "Dessert", color: "pink" },
  "Salaatti": { label: "Salad", color: "lime" },
  "Keitto": { label: "Soup", color: "orange" },
  "Erikoisannos": { label: "Special", color: "purple" },
  // Sodexo categories
  "Koko Linja": { label: "Main Line", color: "blue" },
  "Salaattilinjasto": { label: "Salad Bar", color: "lime" },
  "Grill": { label: "Grill", color: "red" },
  "Deli": { label: "Deli", color: "amber" },
  "Dessert": { label: "Dessert", color: "pink" },
  "Pizza": { label: "Pizza", color: "red" },
  "Pasta": { label: "Pasta", color: "yellow" },
  "Wok": { label: "Wok", color: "orange" },
  "Soup": { label: "Soup", color: "orange" },
} as const;

interface MealTypeFilterContextValue {
  hiddenTypes: Set<string>;
  toggleType: (type: string) => void;
  hideType: (type: string) => void;
  showType: (type: string) => void;
  showAllTypes: () => void;
  isTypeHidden: (type: string) => boolean;
  knownTypes: string[];
  addKnownType: (type: string) => void;
}

const MealTypeFilterContext = createContext<MealTypeFilterContextValue | null>(null);

const STORAGE_KEY = "student-hungry-hidden-meal-types";
const KNOWN_TYPES_KEY = "student-hungry-known-meal-types";

export function MealTypeFilterProvider({ children }: { children: ReactNode }) {
  const [hiddenTypes, setHiddenTypes] = useState<Set<string>>(new Set());
  const [knownTypes, setKnownTypes] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHiddenTypes(new Set(parsed));
      }

      const storedKnown = localStorage.getItem(KNOWN_TYPES_KEY);
      if (storedKnown) {
        setKnownTypes(JSON.parse(storedKnown));
      }
    } catch (e) {
      console.error("Failed to load meal type filter settings:", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when hiddenTypes changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...hiddenTypes]));
      } catch (e) {
        console.error("Failed to save meal type filter settings:", e);
      }
    }
  }, [hiddenTypes, isLoaded]);

  // Save known types to localStorage
  useEffect(() => {
    if (isLoaded && knownTypes.length > 0) {
      try {
        localStorage.setItem(KNOWN_TYPES_KEY, JSON.stringify(knownTypes));
      } catch (e) {
        console.error("Failed to save known meal types:", e);
      }
    }
  }, [knownTypes, isLoaded]);

  const toggleType = (type: string) => {
    setHiddenTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const hideType = (type: string) => {
    setHiddenTypes((prev) => new Set([...prev, type]));
  };

  const showType = (type: string) => {
    setHiddenTypes((prev) => {
      const next = new Set(prev);
      next.delete(type);
      return next;
    });
  };

  const showAllTypes = () => {
    setHiddenTypes(new Set());
  };

  const isTypeHidden = (type: string) => {
    return hiddenTypes.has(type);
  };

  const addKnownType = (type: string) => {
    if (type && !knownTypes.includes(type)) {
      setKnownTypes((prev) => [...prev, type].sort());
    }
  };

  return (
    <MealTypeFilterContext.Provider
      value={{
        hiddenTypes,
        toggleType,
        hideType,
        showType,
        showAllTypes,
        isTypeHidden,
        knownTypes,
        addKnownType,
      }}
    >
      {children}
    </MealTypeFilterContext.Provider>
  );
}

export function useMealTypeFilter() {
  const context = useContext(MealTypeFilterContext);
  if (!context) {
    throw new Error("useMealTypeFilter must be used within a MealTypeFilterProvider");
  }
  return context;
}
