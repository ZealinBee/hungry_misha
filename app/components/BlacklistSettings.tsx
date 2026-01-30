"use client";

import { useState } from "react";
import { useBlacklist, BlacklistedItem } from "../contexts/BlacklistContext";

export default function BlacklistSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const { blacklistedItems, restoreItem, restoreAllItems, blacklistedCount } = useBlacklist();

  // Convert Map to sorted array
  const items = Array.from(blacklistedItems.values()).sort((a, b) =>
    b.blacklistedAt - a.blacklistedAt
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
        <span className="hidden sm:inline">Blacklist</span>
        {blacklistedCount > 0 && (
          <span className="px-1.5 py-0.5 text-xs bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-full">
            {blacklistedCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-x-4 top-20 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 z-50 sm:w-80 max-h-96 overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-lg">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Blacklisted Foods
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Foods you&apos;ve hidden (per restaurant)
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
              {blacklistedCount > 0 && (
                <button
                  onClick={restoreAllItems}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2"
                >
                  Restore all
                </button>
              )}
            </div>

            <div className="p-2">
              {items.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 p-4 text-center">
                  No blacklisted foods yet.
                  <br />
                  <span className="text-xs">Hover over a food item and click &quot;Blacklist&quot; to hide it.</span>
                </p>
              ) : (
                <div className="space-y-1">
                  {items.map((item) => (
                    <BlacklistItem
                      key={`${item.restaurantId}:${item.name.toLowerCase()}`}
                      item={item}
                      onRestore={() => restoreItem(item.name, item.restaurantId)}
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

function BlacklistItem({
  item,
  onRestore,
}: {
  item: BlacklistedItem;
  onRestore: () => void;
}) {
  const dateStr = new Date(item.blacklistedAt).toLocaleDateString();

  return (
    <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700/30 group">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
          {item.name}
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5 truncate" title={item.restaurantName}>
          @ {item.restaurantName}
        </p>
        {item.reason && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate" title={item.reason}>
            Reason: {item.reason}
          </p>
        )}
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
          Added {dateStr}
        </p>
      </div>
      <button
        onClick={onRestore}
        className="opacity-0 group-hover:opacity-100 px-2 py-1 text-xs font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-all"
      >
        Restore
      </button>
    </div>
  );
}
