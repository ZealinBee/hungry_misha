"use client";

import { useState } from "react";
import { useMealTypeFilter, MEAL_TYPE_CATEGORIES } from "../contexts/MealTypeFilterContext";

function getMealTypeStyle(type: string): { bg: string; text: string; border: string } {
  const category = MEAL_TYPE_CATEGORIES[type as keyof typeof MEAL_TYPE_CATEGORIES];

  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    blue: { bg: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-700 dark:text-blue-300", border: "border-blue-300 dark:border-blue-700" },
    green: { bg: "bg-green-100 dark:bg-green-900/40", text: "text-green-700 dark:text-green-300", border: "border-green-300 dark:border-green-700" },
    emerald: { bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-300 dark:border-emerald-700" },
    pink: { bg: "bg-pink-100 dark:bg-pink-900/40", text: "text-pink-700 dark:text-pink-300", border: "border-pink-300 dark:border-pink-700" },
    lime: { bg: "bg-lime-100 dark:bg-lime-900/40", text: "text-lime-700 dark:text-lime-300", border: "border-lime-300 dark:border-lime-700" },
    orange: { bg: "bg-orange-100 dark:bg-orange-900/40", text: "text-orange-700 dark:text-orange-300", border: "border-orange-300 dark:border-orange-700" },
    purple: { bg: "bg-purple-100 dark:bg-purple-900/40", text: "text-purple-700 dark:text-purple-300", border: "border-purple-300 dark:border-purple-700" },
    red: { bg: "bg-red-100 dark:bg-red-900/40", text: "text-red-700 dark:text-red-300", border: "border-red-300 dark:border-red-700" },
    amber: { bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-700 dark:text-amber-300", border: "border-amber-300 dark:border-amber-700" },
    yellow: { bg: "bg-yellow-100 dark:bg-yellow-900/40", text: "text-yellow-700 dark:text-yellow-300", border: "border-yellow-300 dark:border-yellow-700" },
  };

  if (category) {
    return colorMap[category.color] || colorMap.blue;
  }

  return { bg: "bg-zinc-100 dark:bg-zinc-800", text: "text-zinc-700 dark:text-zinc-300", border: "border-zinc-300 dark:border-zinc-600" };
}

export function getMealTypeLabel(type: string): string {
  const category = MEAL_TYPE_CATEGORIES[type as keyof typeof MEAL_TYPE_CATEGORIES];
  return category?.label || type;
}

export function MealTypeBadge({ type, size = "sm" }: { type: string; size?: "sm" | "md" }) {
  const style = getMealTypeStyle(type);
  const label = getMealTypeLabel(type);

  const sizeClasses = size === "sm"
    ? "px-2 py-0.5 text-xs"
    : "px-3 py-1 text-sm";

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${style.bg} ${style.text} ${style.border} ${sizeClasses}`}>
      {label}
    </span>
  );
}

export default function MealTypeFilterSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const { hiddenTypes, toggleType, showAllTypes, knownTypes } = useMealTypeFilter();

  // Combine predefined categories with dynamically discovered types
  const allTypes = [...new Set([...Object.keys(MEAL_TYPE_CATEGORIES), ...knownTypes])].sort();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filter
        {hiddenTypes.size > 0 && (
          <span className="px-1.5 py-0.5 text-xs bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-full">
            {hiddenTypes.size}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 w-80 max-h-96 overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-lg">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Filter Meal Types
                </h3>
                {hiddenTypes.size > 0 && (
                  <button
                    onClick={showAllTypes}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Show all
                  </button>
                )}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Unchecked types will be hidden from the menu
              </p>
            </div>

            <div className="p-2">
              {allTypes.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 p-2 text-center">
                  Browse some menus to discover meal types
                </p>
              ) : (
                <div className="space-y-1">
                  {allTypes.map((type) => {
                    const isHidden = hiddenTypes.has(type);
                    const style = getMealTypeStyle(type);
                    const label = getMealTypeLabel(type);

                    return (
                      <label
                        key={type}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                          isHidden
                            ? "bg-zinc-100 dark:bg-zinc-700/50 opacity-60"
                            : "hover:bg-zinc-50 dark:hover:bg-zinc-700/30"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={!isHidden}
                          onChange={() => toggleType(type)}
                          className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 dark:bg-zinc-700"
                        />
                        <span className={`flex-1 text-sm ${isHidden ? "line-through text-zinc-400 dark:text-zinc-500" : "text-zinc-700 dark:text-zinc-300"}`}>
                          {label}
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded-full border ${style.bg} ${style.text} ${style.border}`}>
                          {type !== label ? type : ""}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
