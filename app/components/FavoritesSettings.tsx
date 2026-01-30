"use client";

import { useState } from "react";
import { useFavorites, FavoriteItem, NotificationSettings } from "../contexts/FavoritesContext";

const DAYS_OF_WEEK = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

export default function FavoritesSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const { favorites, removeFavorite, updateNotification, favoritesCount, requestNotificationPermission, notificationPermission } = useFavorites();

  const items = Array.from(favorites.values()).sort((a, b) => b.favoritedAt - a.favoritedAt);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <span className="hidden sm:inline">Favorites</span>
        {favoritesCount > 0 && (
          <span className="px-1.5 py-0.5 text-xs bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 rounded-full">
            {favoritesCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="fixed inset-x-4 top-20 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 z-50 sm:w-96 max-h-[80vh] overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-lg">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Favorite Foods</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Foods you love and want to be reminded about
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 -m-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {notificationPermission === "denied" && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                  Notifications are blocked. Enable them in browser settings.
                </p>
              )}
            </div>

            <div className="p-2">
              {items.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 p-4 text-center">
                  No favorite foods yet.
                  <br />
                  <span className="text-xs">Click the heart icon on a food item to add it.</span>
                </p>
              ) : (
                <div className="space-y-2">
                  {items.map((item) => (
                    <FavoriteItemCard
                      key={`${item.restaurantId}:${item.name.toLowerCase()}`}
                      item={item}
                      onRemove={() => removeFavorite(item.name, item.restaurantId)}
                      onUpdateNotification={(notification) =>
                        updateNotification(item.name, item.restaurantId, notification)
                      }
                      requestNotificationPermission={requestNotificationPermission}
                      notificationPermission={notificationPermission}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function FavoriteItemCard({
  item,
  onRemove,
  onUpdateNotification,
  requestNotificationPermission,
  notificationPermission,
}: {
  item: FavoriteItem;
  onRemove: () => void;
  onUpdateNotification: (notification: NotificationSettings) => void;
  requestNotificationPermission: () => Promise<boolean>;
  notificationPermission: NotificationPermission | "default";
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const dateStr = new Date(item.favoritedAt).toLocaleDateString();

  const handleToggleNotification = async () => {
    if (!item.notification.enabled) {
      if (notificationPermission !== "granted") {
        const granted = await requestNotificationPermission();
        if (!granted) return;
      }
    }
    onUpdateNotification({
      ...item.notification,
      enabled: !item.notification.enabled,
    });
  };

  const handleTimeChange = (time: string) => {
    onUpdateNotification({
      ...item.notification,
      time,
    });
  };

  const handleDayToggle = (day: number) => {
    const newDays = item.notification.daysOfWeek.includes(day)
      ? item.notification.daysOfWeek.filter((d) => d !== day)
      : [...item.notification.daysOfWeek, day].sort();
    onUpdateNotification({
      ...item.notification,
      daysOfWeek: newDays,
    });
  };

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
      <div className="flex items-start gap-3 p-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{item.name}</p>
          <p className="text-xs text-pink-600 dark:text-pink-400 mt-0.5 truncate" title={item.restaurantName}>
            @ {item.restaurantName}
          </p>
          {item.category && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{item.category}</p>
          )}
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Added {dateStr}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            title="Notification settings"
          >
            <svg
              className={`w-4 h-4 ${item.notification.enabled ? "text-blue-500" : ""}`}
              fill={item.notification.enabled ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
          <button
            onClick={onRemove}
            className="p-1.5 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            title="Remove from favorites"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-3 pb-3 pt-0 border-t border-zinc-200 dark:border-zinc-700 mt-0">
          <div className="pt-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Enable notifications</span>
              <button
                onClick={handleToggleNotification}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  item.notification.enabled ? "bg-blue-500" : "bg-zinc-300 dark:bg-zinc-600"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    item.notification.enabled ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>

            {item.notification.enabled && (
              <>
                <div>
                  <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">Reminder time</label>
                  <input
                    type="time"
                    value={item.notification.time}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">Days</label>
                  <div className="flex gap-1">
                    {DAYS_OF_WEEK.map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => handleDayToggle(value)}
                        className={`flex-1 py-1 text-xs font-medium rounded transition-colors ${
                          item.notification.daysOfWeek.includes(value)
                            ? "bg-blue-500 text-white"
                            : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
