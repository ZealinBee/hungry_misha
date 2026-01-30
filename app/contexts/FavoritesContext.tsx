"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export interface NotificationSettings {
  enabled: boolean;
  time: string; // HH:MM format
  daysOfWeek: number[]; // 0-6, Sunday to Saturday
}

export interface FavoriteItem {
  name: string;
  restaurantId: string;
  restaurantName: string;
  category?: string;
  notification: NotificationSettings;
  favoritedAt: number;
}

interface FavoritesContextValue {
  favorites: Map<string, FavoriteItem>;
  addFavorite: (
    name: string,
    restaurantId: string,
    restaurantName: string,
    category?: string,
    notification?: NotificationSettings
  ) => void;
  removeFavorite: (name: string, restaurantId: string) => void;
  updateNotification: (name: string, restaurantId: string, notification: NotificationSettings) => void;
  isFavorite: (name: string, restaurantId: string) => boolean;
  getFavorite: (name: string, restaurantId: string) => FavoriteItem | undefined;
  favoritesCount: number;
  requestNotificationPermission: () => Promise<boolean>;
  notificationPermission: NotificationPermission | "default";
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

const STORAGE_KEY = "student-hungry-favorites";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Map<string, FavoriteItem>>(new Map());
  const [isLoaded, setIsLoaded] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | "default">("default");

  // Check notification permission on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: [string, FavoriteItem][] = JSON.parse(stored);
        setFavorites(new Map(parsed));
      }
    } catch (e) {
      console.error("Failed to load favorites:", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when favorites change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
      } catch (e) {
        console.error("Failed to save favorites:", e);
      }
    }
  }, [favorites, isLoaded]);

  // Schedule notifications for all favorites
  useEffect(() => {
    if (!isLoaded || notificationPermission !== "granted") return;

    const checkAndNotify = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
      const currentDay = now.getDay();

      favorites.forEach((favorite) => {
        if (
          favorite.notification.enabled &&
          favorite.notification.time === currentTime &&
          favorite.notification.daysOfWeek.includes(currentDay)
        ) {
          new Notification(`Don't forget: ${favorite.name}`, {
            body: `Available at ${favorite.restaurantName}`,
            icon: "/favicon.ico",
            tag: `favorite-${favorite.restaurantId}-${favorite.name}`,
          });
        }
      });
    };

    // Check every minute
    const interval = setInterval(checkAndNotify, 60000);

    // Also check immediately
    checkAndNotify();

    return () => clearInterval(interval);
  }, [favorites, isLoaded, notificationPermission]);

  const createKey = (name: string, restaurantId: string) => {
    return `${restaurantId}:${name.toLowerCase().trim()}`;
  };

  const requestNotificationPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return false;
    }

    if (Notification.permission === "granted") {
      setNotificationPermission("granted");
      return true;
    }

    if (Notification.permission === "denied") {
      setNotificationPermission("denied");
      return false;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    return permission === "granted";
  }, []);

  const addFavorite = (
    name: string,
    restaurantId: string,
    restaurantName: string,
    category?: string,
    notification?: NotificationSettings
  ) => {
    const key = createKey(name, restaurantId);
    setFavorites((prev) => {
      const next = new Map(prev);
      next.set(key, {
        name,
        restaurantId,
        restaurantName,
        category,
        notification: notification || {
          enabled: false,
          time: "11:00",
          daysOfWeek: [1, 2, 3, 4, 5], // Weekdays by default
        },
        favoritedAt: Date.now(),
      });
      return next;
    });
  };

  const removeFavorite = (name: string, restaurantId: string) => {
    const key = createKey(name, restaurantId);
    setFavorites((prev) => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  };

  const updateNotification = (name: string, restaurantId: string, notification: NotificationSettings) => {
    const key = createKey(name, restaurantId);
    setFavorites((prev) => {
      const next = new Map(prev);
      const existing = next.get(key);
      if (existing) {
        next.set(key, { ...existing, notification });
      }
      return next;
    });
  };

  const isFavorite = (name: string, restaurantId: string) => {
    const key = createKey(name, restaurantId);
    return favorites.has(key);
  };

  const getFavorite = (name: string, restaurantId: string) => {
    const key = createKey(name, restaurantId);
    return favorites.get(key);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        updateNotification,
        isFavorite,
        getFavorite,
        favoritesCount: favorites.size,
        requestNotificationPermission,
        notificationPermission,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
