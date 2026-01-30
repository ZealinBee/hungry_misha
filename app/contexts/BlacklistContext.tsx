"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface BlacklistedItem {
  name: string;
  restaurantId: string;
  restaurantName: string;
  reason?: string;
  blacklistedAt: number;
}

interface BlacklistContextValue {
  blacklistedItems: Map<string, BlacklistedItem>;
  blacklistItem: (name: string, restaurantId: string, restaurantName: string, reason?: string) => void;
  restoreItem: (name: string, restaurantId: string) => void;
  restoreAllItems: () => void;
  isBlacklisted: (name: string, restaurantId: string) => boolean;
  getBlacklistReason: (name: string, restaurantId: string) => string | undefined;
  blacklistedCount: number;
}

const BlacklistContext = createContext<BlacklistContextValue | null>(null);

const STORAGE_KEY = "student-hungry-blacklisted-foods";

export function BlacklistProvider({ children }: { children: ReactNode }) {
  const [blacklistedItems, setBlacklistedItems] = useState<Map<string, BlacklistedItem>>(new Map());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: [string, BlacklistedItem][] = JSON.parse(stored);
        setBlacklistedItems(new Map(parsed));
      }
    } catch (e) {
      console.error("Failed to load blacklist settings:", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when blacklist changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...blacklistedItems]));
      } catch (e) {
        console.error("Failed to save blacklist settings:", e);
      }
    }
  }, [blacklistedItems, isLoaded]);

  // Create a composite key from restaurant ID and food name
  const createKey = (name: string, restaurantId: string) => {
    return `${restaurantId}:${name.toLowerCase().trim()}`;
  };

  const blacklistItem = (name: string, restaurantId: string, restaurantName: string, reason?: string) => {
    const key = createKey(name, restaurantId);
    setBlacklistedItems((prev) => {
      const next = new Map(prev);
      next.set(key, {
        name,
        restaurantId,
        restaurantName,
        reason,
        blacklistedAt: Date.now(),
      });
      return next;
    });
  };

  const restoreItem = (name: string, restaurantId: string) => {
    const key = createKey(name, restaurantId);
    setBlacklistedItems((prev) => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  };

  const restoreAllItems = () => {
    setBlacklistedItems(new Map());
  };

  const isBlacklisted = (name: string, restaurantId: string) => {
    const key = createKey(name, restaurantId);
    return blacklistedItems.has(key);
  };

  const getBlacklistReason = (name: string, restaurantId: string) => {
    const key = createKey(name, restaurantId);
    return blacklistedItems.get(key)?.reason;
  };

  return (
    <BlacklistContext.Provider
      value={{
        blacklistedItems,
        blacklistItem,
        restoreItem,
        restoreAllItems,
        isBlacklisted,
        getBlacklistReason,
        blacklistedCount: blacklistedItems.size,
      }}
    >
      {children}
    </BlacklistContext.Provider>
  );
}

export function useBlacklist() {
  const context = useContext(BlacklistContext);
  if (!context) {
    throw new Error("useBlacklist must be used within a BlacklistProvider");
  }
  return context;
}
