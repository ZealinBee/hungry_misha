"use client";

import { useState } from "react";
import { NotificationSettings } from "../contexts/FavoritesContext";

const DAYS_OF_WEEK = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

interface FavoriteModalProps {
  foodName: string;
  restaurantName: string;
  category?: string;
  onConfirm: (notification: NotificationSettings) => void;
  onCancel: () => void;
  requestNotificationPermission: () => Promise<boolean>;
  notificationPermission: NotificationPermission | "default";
}

export default function FavoriteModal({
  foodName,
  restaurantName,
  category,
  onConfirm,
  onCancel,
  requestNotificationPermission,
  notificationPermission,
}: FavoriteModalProps) {
  const [wantNotifications, setWantNotifications] = useState(false);
  const [time, setTime] = useState("11:00");
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]); // Weekdays

  const handleDayToggle = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const handleConfirm = async () => {
    if (wantNotifications) {
      if (notificationPermission !== "granted") {
        const granted = await requestNotificationPermission();
        if (!granted) {
          // If permission denied, save without notifications
          onConfirm({
            enabled: false,
            time: "11:00",
            daysOfWeek: [1, 2, 3, 4, 5],
          });
          return;
        }
      }
    }

    onConfirm({
      enabled: wantNotifications,
      time,
      daysOfWeek: selectedDays,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center">
            <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Add to Favorites
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {foodName}
            </p>
          </div>
        </div>

        <div className="mb-4 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">{restaurantName}</span>
            {category && (
              <span className="text-zinc-500 dark:text-zinc-500"> · {category}</span>
            )}
          </p>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Want to be reminded?
              </span>
            </div>
            <button
              onClick={() => setWantNotifications(!wantNotifications)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                wantNotifications ? "bg-blue-500" : "bg-zinc-300 dark:bg-zinc-600"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  wantNotifications ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>

          {notificationPermission === "denied" && wantNotifications && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 px-1">
              Notifications are blocked in your browser. Please enable them in browser settings.
            </p>
          )}
        </div>

        {wantNotifications && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Reminder time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Which days?
              </label>
              <div className="flex gap-1">
                {DAYS_OF_WEEK.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => handleDayToggle(value)}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
                      selectedDays.includes(value)
                        ? "bg-blue-500 text-white"
                        : "bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-600"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            Add to Favorites
          </button>
        </div>
      </div>
    </div>
  );
}
