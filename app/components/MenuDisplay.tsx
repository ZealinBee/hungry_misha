"use client";

import { SodexoWeeklyMenu, SodexoCourse, Restaurant } from "../types/sodexo";
import { JamixResponse } from "../types/juvenes";
import { useEffect, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useMealTypeFilter } from "../contexts/MealTypeFilterContext";
import { useBlacklist } from "../contexts/BlacklistContext";
import { useFavorites, NotificationSettings } from "../contexts/FavoritesContext";
import { MealTypeBadge } from "./MealTypeFilterSettings";
import FavoriteModal from "./FavoriteModal";

interface MenuDisplayProps {
  restaurant: Restaurant;
}

// Normalized course interface for both providers
interface NormalizedCourse {
  name: string;
  category?: string;
  dietCodes: string[];
  allergens?: string;
}

// Blacklist modal for entering reason
function BlacklistModal({
  foodName,
  restaurantName,
  onConfirm,
  onCancel,
}: {
  foodName: string;
  restaurantName: string;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
}) {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          Blacklist Food
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          Blacklisting &quot;{foodName}&quot; from <span className="font-medium text-zinc-700 dark:text-zinc-300">{restaurantName}</span>
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Reason (optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Allergic, don't like it, etc."
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
            rows={3}
          />
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason || undefined)}
            className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Blacklist
          </button>
        </div>
      </div>
    </div>
  );
}

// Blacklist badge shown on blacklisted items
function BlacklistBadge({ reason }: { reason?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200"
      title={reason ? `Reason: ${reason}` : "Blacklisted"}
    >
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
      Blacklisted
    </span>
  );
}

function DietBadge({ code }: { code: string }) {
  const badges: Record<string, { label: string; className: string }> = {
    G: {
      label: "Gluten-free",
      className: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
    },
    L: {
      label: "Lactose-free",
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
    },
    M: {
      label: "Milk-free",
      className: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200",
    },
    VL: {
      label: "Low lactose",
      className: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-200",
    },
    Veg: {
      label: "Vegan",
      className: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
    },
    VEG: {
      label: "Vegetarian",
      className: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
    },
    Mu: {
      label: "Contains Mustard",
      className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200",
    },
  };

  const badge = badges[code.trim()];
  if (!badge) return null;

  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${badge.className}`}
    >
      {badge.label}
    </span>
  );
}

function CourseCard({
  course,
  language,
  showCategory = false,
  onHideType,
  isBlacklisted,
  blacklistReason,
  onBlacklist,
  onRestore,
  isFavorite,
  onFavorite,
  onUnfavorite,
}: {
  course: SodexoCourse;
  language: "en" | "fi";
  showCategory?: boolean;
  onHideType?: (type: string) => void;
  isBlacklisted?: boolean;
  blacklistReason?: string;
  onBlacklist?: () => void;
  onRestore?: () => void;
  isFavorite?: boolean;
  onFavorite?: () => void;
  onUnfavorite?: () => void;
}) {
  const dietCodes = course.dietcodes
    ? course.dietcodes.split(",").map((c) => c.trim())
    : [];

  const primaryTitle =
    language === "en"
      ? course.title_en || course.title_fi
      : course.title_fi || course.title_en;

  const mealType = course.category || course.meal_category;

  return (
    <div className={`p-3 rounded-lg border relative group ${
      isBlacklisted
        ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30"
        : course.additionalDietInfo?.allergens
          ? "border-2 border-emerald-500 dark:border-emerald-400 bg-white dark:bg-zinc-800"
          : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
    }`}>
      {/* Meal type badge - only shown when not grouped */}
      {showCategory && mealType && (
        <div className="flex items-center justify-between mb-2">
          <MealTypeBadge type={mealType} />
          {onHideType && (
            <button
              onClick={() => onHideType(mealType)}
              className="opacity-0 group-hover:opacity-100 text-xs text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-opacity"
              title={`Hide all "${mealType}" items`}
            >
              Hide type
            </button>
          )}
        </div>
      )}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* Favorite button */}
          <button
            onClick={isFavorite ? onUnfavorite : onFavorite}
            className={`shrink-0 transition-colors ${
              isFavorite
                ? "text-pink-500 hover:text-pink-600"
                : "opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-pink-500"
            }`}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <svg className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <h4 className={`font-medium text-sm ${
            isBlacklisted
              ? "text-zinc-500 dark:text-zinc-500 line-through"
              : "text-zinc-900 dark:text-zinc-100"
          }`}>
            {primaryTitle}
          </h4>
        </div>
        {/* Blacklist/Restore button */}
        {isBlacklisted ? (
          <button
            onClick={onRestore}
            className="opacity-0 group-hover:opacity-100 text-xs text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-opacity shrink-0"
            title="Restore this food"
          >
            Restore
          </button>
        ) : (
          <button
            onClick={onBlacklist}
            className="opacity-0 group-hover:opacity-100 text-xs text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-opacity shrink-0"
            title="Blacklist this food"
          >
            Blacklist
          </button>
        )}
      </div>
      {/* Blacklist badge */}
      {isBlacklisted && (
        <div className="mt-2">
          <BlacklistBadge reason={blacklistReason} />
        </div>
      )}
      {/* Diet badges */}
      {dietCodes.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {dietCodes.map((code, i) => (
            <DietBadge key={i} code={code} />
          ))}
        </div>
      )}
      {course.additionalDietInfo?.allergens && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">
          Allergens: {course.additionalDietInfo.allergens}
        </p>
      )}
    </div>
  );
}

// Group Sodexo courses by category
function groupSodexoCoursesByCategory(courses: SodexoCourse[]): Map<string, SodexoCourse[]> {
  const groups = new Map<string, SodexoCourse[]>();

  for (const course of courses) {
    const category = course.category || course.meal_category || "Other";
    if (!groups.has(category)) {
      groups.set(category, []);
    }
    groups.get(category)!.push(course);
  }

  return groups;
}

function SodexoCategorySection({
  category,
  courses,
  language,
  onHideType,
  isBlacklisted,
  getBlacklistReason,
  onBlacklist,
  onRestore,
  isFavorite,
  onFavorite,
  onUnfavorite,
}: {
  category: string;
  courses: SodexoCourse[];
  language: "en" | "fi";
  onHideType?: (type: string) => void;
  isBlacklisted: (name: string) => boolean;
  getBlacklistReason: (name: string) => string | undefined;
  onBlacklist: (name: string) => void;
  onRestore: (name: string) => void;
  isFavorite: (name: string) => boolean;
  onFavorite: (name: string, category: string) => void;
  onUnfavorite: (name: string) => void;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-200 dark:border-zinc-700">
        <MealTypeBadge type={category} />
        {onHideType && (
          <button
            onClick={() => onHideType(category)}
            className="text-xs text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            title={`Hide all "${category}" items`}
          >
            Hide
          </button>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {courses.map((course, index) => {
          const title = language === "en"
            ? course.title_en || course.title_fi
            : course.title_fi || course.title_en;
          return (
            <CourseCard
              key={index}
              course={course}
              language={language}
              isBlacklisted={isBlacklisted(title)}
              blacklistReason={getBlacklistReason(title)}
              onBlacklist={() => onBlacklist(title)}
              onRestore={() => onRestore(title)}
              isFavorite={isFavorite(title)}
              onFavorite={() => onFavorite(title, category)}
              onUnfavorite={() => onUnfavorite(title)}
            />
          );
        })}
      </div>
    </div>
  );
}

function NormalizedCourseCard({
  course,
  showCategory = false,
  onHideType,
  isBlacklisted,
  blacklistReason,
  onBlacklist,
  onRestore,
  isFavorite,
  onFavorite,
  onUnfavorite,
}: {
  course: NormalizedCourse;
  showCategory?: boolean;
  onHideType?: (type: string) => void;
  isBlacklisted?: boolean;
  blacklistReason?: string;
  onBlacklist?: () => void;
  onRestore?: () => void;
  isFavorite?: boolean;
  onFavorite?: () => void;
  onUnfavorite?: () => void;
}) {
  return (
    <div className={`p-3 rounded-lg border relative group ${
      isBlacklisted
        ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30"
        : course.allergens
          ? "border-2 border-emerald-500 dark:border-emerald-400 bg-white dark:bg-zinc-800"
          : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
    }`}>
      {/* Meal type badge - only shown when not grouped */}
      {showCategory && course.category && (
        <div className="flex items-center justify-between mb-2">
          <MealTypeBadge type={course.category} />
          {onHideType && (
            <button
              onClick={() => onHideType(course.category!)}
              className="opacity-0 group-hover:opacity-100 text-xs text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-opacity"
              title={`Hide all "${course.category}" items`}
            >
              Hide type
            </button>
          )}
        </div>
      )}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* Favorite button */}
          <button
            onClick={isFavorite ? onUnfavorite : onFavorite}
            className={`shrink-0 transition-colors ${
              isFavorite
                ? "text-pink-500 hover:text-pink-600"
                : "opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-pink-500"
            }`}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <svg className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <h4 className={`font-medium text-sm ${
            isBlacklisted
              ? "text-zinc-500 dark:text-zinc-500 line-through"
              : "text-zinc-900 dark:text-zinc-100"
          }`}>
            {course.name}
          </h4>
        </div>
        {/* Blacklist/Restore button */}
        {isBlacklisted ? (
          <button
            onClick={onRestore}
            className="opacity-0 group-hover:opacity-100 text-xs text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-opacity shrink-0"
            title="Restore this food"
          >
            Restore
          </button>
        ) : (
          <button
            onClick={onBlacklist}
            className="opacity-0 group-hover:opacity-100 text-xs text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-opacity shrink-0"
            title="Blacklist this food"
          >
            Blacklist
          </button>
        )}
      </div>
      {/* Blacklist badge */}
      {isBlacklisted && (
        <div className="mt-2">
          <BlacklistBadge reason={blacklistReason} />
        </div>
      )}
      {/* Diet badges */}
      {course.dietCodes.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {course.dietCodes.map((code, i) => (
            <DietBadge key={i} code={code} />
          ))}
        </div>
      )}
      {course.allergens && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">
          Allergens: {course.allergens}
        </p>
      )}
    </div>
  );
}

// Group courses by category
function groupCoursesByCategory(courses: NormalizedCourse[]): Map<string, NormalizedCourse[]> {
  const groups = new Map<string, NormalizedCourse[]>();

  for (const course of courses) {
    const category = course.category || "Other";
    if (!groups.has(category)) {
      groups.set(category, []);
    }
    groups.get(category)!.push(course);
  }

  return groups;
}

function CategorySection({
  category,
  courses,
  onHideType,
  isBlacklisted,
  getBlacklistReason,
  onBlacklist,
  onRestore,
  isFavorite,
  onFavorite,
  onUnfavorite,
}: {
  category: string;
  courses: NormalizedCourse[];
  onHideType?: (type: string) => void;
  isBlacklisted: (name: string) => boolean;
  getBlacklistReason: (name: string) => string | undefined;
  onBlacklist: (name: string) => void;
  onRestore: (name: string) => void;
  isFavorite: (name: string) => boolean;
  onFavorite: (name: string, category: string) => void;
  onUnfavorite: (name: string) => void;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-200 dark:border-zinc-700">
        <MealTypeBadge type={category} />
        {onHideType && (
          <button
            onClick={() => onHideType(category)}
            className="text-xs text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            title={`Hide all "${category}" items`}
          >
            Hide
          </button>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {courses.map((course, index) => (
          <NormalizedCourseCard
            key={index}
            course={course}
            isBlacklisted={isBlacklisted(course.name)}
            blacklistReason={getBlacklistReason(course.name)}
            onBlacklist={() => onBlacklist(course.name)}
            onRestore={() => onRestore(course.name)}
            isFavorite={isFavorite(course.name)}
            onFavorite={() => onFavorite(course.name, category)}
            onUnfavorite={() => onUnfavorite(course.name)}
          />
        ))}
      </div>
    </div>
  );
}

// Parse Juvenes/JAMIX data to normalized courses
// API structure: JamixKitchen[] -> menuTypes[] -> menus[] -> days[] -> mealoptions[] -> menuItems[]
function parseJamixTodayMenu(data: JamixResponse): { courses: NormalizedCourse[]; displayDate: string; isToday: boolean } {
  const courses: NormalizedCourse[] = [];
  let displayDate = "";
  let isToday = false;

  // Data is an array of kitchens directly
  if (!Array.isArray(data) || data.length === 0) {
    return { courses, displayDate, isToday };
  }

  const kitchen = data[0];
  if (!kitchen.menuTypes || kitchen.menuTypes.length === 0) {
    return { courses, displayDate, isToday };
  }

  // Get today's date in YYYYMMDD format
  const today = new Date();
  const todayNum =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  let foundDate: number | null = null;

  // Search through all menuTypes and their menus to find today's meals
  for (const menuType of kitchen.menuTypes) {
    if (!menuType.menus) continue;

    for (const menu of menuType.menus) {
      if (!menu.days) continue;

      // Find today's day or the closest future day
      let targetDay = menu.days.find((day) => day.date === todayNum);

      // If today not found, use the first available day
      if (!targetDay && menu.days.length > 0) {
        // Find the next available day
        targetDay = menu.days.find((day) => day.date >= todayNum) || menu.days[0];
      }

      if (!targetDay || !targetDay.mealoptions) continue;

      // Track the date we're showing
      if (!foundDate) {
        foundDate = targetDay.date;
        isToday = foundDate === todayNum;

        // Format the date for display (YYYYMMDD -> readable date)
        const year = Math.floor(foundDate / 10000);
        const month = Math.floor((foundDate % 10000) / 100) - 1;
        const day = foundDate % 100;
        const dateObj = new Date(year, month, day);

        const weekday = dateObj.toLocaleDateString("en-US", { weekday: "long" });
        const monthName = dateObj.toLocaleDateString("en-US", { month: "long" });
        displayDate = `${weekday}, ${day} ${monthName}`;
      }

      // Extract courses from mealoptions
      for (const mealoption of targetDay.mealoptions) {
        if (!mealoption.menuItems) continue;

        for (const item of mealoption.menuItems) {
          // Skip items without a name
          if (!item.name) continue;

          // Parse diet codes from string like "G, M, Mu, *, SIS.LUOMUA"
          const dietCodes: string[] = [];
          if (item.diets) {
            const codes = item.diets.split(",").map((c) => c.trim());
            for (const code of codes) {
              // Skip non-diet markers like "*" and "SIS.LUOMUA"
              if (code && code !== "*" && !code.startsWith("SIS.")) {
                dietCodes.push(code);
              }
            }
          }

          // Extract allergens from ingredients (marked with <strong> tags)
          let allergens = "";
          if (item.ingredients) {
            const allergenMatches = item.ingredients.match(/<strong>\(([^)]+)\)<\/strong>/g);
            if (allergenMatches) {
              const allergenSet = new Set<string>();
              for (const match of allergenMatches) {
                const content = match.replace(/<\/?strong>/g, "").replace(/[()]/g, "");
                content.split(",").forEach((a) => allergenSet.add(a.trim()));
              }
              allergens = Array.from(allergenSet).join(", ");
            }
          }

          courses.push({
            name: item.name,
            category: mealoption.name, // e.g., "LUNCH", "VEGETARIAN LUNCH"
            dietCodes,
            allergens: allergens || undefined,
          });
        }
      }
    }
  }

  return { courses, displayDate, isToday };
}

export default function MenuDisplay({ restaurant }: MenuDisplayProps) {
  const { language } = useLanguage();
  const { isTypeHidden, hideType, addKnownType, hiddenTypes } = useMealTypeFilter();
  const { isBlacklisted, getBlacklistReason, blacklistItem, restoreItem } = useBlacklist();
  const { isFavorite, addFavorite, removeFavorite, requestNotificationPermission, notificationPermission } = useFavorites();
  const [menu, setMenu] = useState<SodexoWeeklyMenu | null>(null);
  const [juvenesMenu, setJuvenesMenu] = useState<{ courses: NormalizedCourse[]; displayDate: string; isToday: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayIndex, setTodayIndex] = useState(0);
  const [blacklistModalFood, setBlacklistModalFood] = useState<string | null>(null);
  const [favoriteModalFood, setFavoriteModalFood] = useState<{ name: string; category: string } | null>(null);

  // Get restaurant ID - use unique identifier based on provider
  const restaurantId = restaurant.provider === "juvenes"
    ? `juvenes-${restaurant.customerId}-${restaurant.kitchenId}`
    : `sodexo-${restaurant.id}`;

  const handleBlacklist = (name: string) => {
    setBlacklistModalFood(name);
  };

  const handleConfirmBlacklist = (reason?: string) => {
    if (blacklistModalFood) {
      blacklistItem(blacklistModalFood, restaurantId, restaurant.name, reason);
      setBlacklistModalFood(null);
    }
  };

  const handleCancelBlacklist = () => {
    setBlacklistModalFood(null);
  };

  const handleRestore = (name: string) => {
    restoreItem(name, restaurantId);
  };

  // Favorite handlers
  const handleFavorite = (name: string, category: string) => {
    setFavoriteModalFood({ name, category });
  };

  const handleConfirmFavorite = (notification: NotificationSettings) => {
    if (favoriteModalFood) {
      addFavorite(
        favoriteModalFood.name,
        restaurantId,
        restaurant.name,
        favoriteModalFood.category,
        notification
      );
      setFavoriteModalFood(null);
    }
  };

  const handleCancelFavorite = () => {
    setFavoriteModalFood(null);
  };

  const handleUnfavorite = (name: string) => {
    removeFavorite(name, restaurantId);
  };

  // Wrapper functions to include restaurant ID
  const checkIsBlacklisted = (name: string) => isBlacklisted(name, restaurantId);
  const getBlacklistReasonForRestaurant = (name: string) => getBlacklistReason(name, restaurantId);
  const checkIsFavorite = (name: string) => isFavorite(name, restaurantId);

  useEffect(() => {
    async function fetchMenu() {
      setLoading(true);
      setError(null);
      setMenu(null);
      setJuvenesMenu(null);

      try {
        if (restaurant.provider === "juvenes") {
          // Fetch from Juvenes/JAMIX API
          const response = await fetch(
            `/api/juvenes/${restaurant.customerId}/${restaurant.kitchenId}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch Juvenes menu");
          }
          const data: JamixResponse = await response.json();
          const parsed = parseJamixTodayMenu(data);
          setJuvenesMenu(parsed);
        } else {
          // Fetch from Sodexo API
          const response = await fetch(`/api/menu/${restaurant.id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch menu");
          }
          const data = await response.json();
          setMenu(data);

          // Set today as default selected day
          const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
          const foundIndex = data.mealdates?.findIndex(
            (d: { date: string }) => d.date.toLowerCase() === today.toLowerCase()
          );
          if (foundIndex >= 0) {
            setTodayIndex(foundIndex);
          } else {
            setTodayIndex(0);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, [restaurant.id, restaurant.provider, restaurant.customerId, restaurant.kitchenId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 dark:text-red-400">{error}</p>
        <p className="text-sm text-zinc-500 mt-2">
          The menu may not be available for this restaurant at the moment.
        </p>
      </div>
    );
  }

  // Render Juvenes menu
  if (restaurant.provider === "juvenes") {
    if (!juvenesMenu || juvenesMenu.courses.length === 0) {
      return (
        <div className="p-6 text-center">
          <p className="text-zinc-500 dark:text-zinc-400">
            No menu available for today.
          </p>
        </div>
      );
    }

    // Register discovered types and filter
    juvenesMenu.courses.forEach((course) => {
      if (course.category) {
        addKnownType(course.category);
      }
    });

    const filteredCourses = juvenesMenu.courses.filter(
      (course) => !course.category || !isTypeHidden(course.category)
    );

    const hiddenCount = juvenesMenu.courses.length - filteredCourses.length;

    return (
      <div className="w-full">
        {/* Blacklist Modal */}
        {blacklistModalFood && (
          <BlacklistModal
            foodName={blacklistModalFood}
            restaurantName={restaurant.name}
            onConfirm={handleConfirmBlacklist}
            onCancel={handleCancelBlacklist}
          />
        )}

        {/* Favorite Modal */}
        {favoriteModalFood && (
          <FavoriteModal
            foodName={favoriteModalFood.name}
            restaurantName={restaurant.name}
            category={favoriteModalFood.category}
            onConfirm={handleConfirmFavorite}
            onCancel={handleCancelFavorite}
            requestNotificationPermission={requestNotificationPermission}
            notificationPermission={notificationPermission}
          />
        )}

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              {restaurant.name}
            </h2>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${restaurant.name} ${restaurant.address} ${restaurant.city}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              title="Open in Google Maps"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Map
            </a>
          </div>
          {juvenesMenu.displayDate && (
            <p className="text-sm text-zinc-900 dark:text-zinc-100 font-medium">
              {juvenesMenu.isToday ? "Today" : juvenesMenu.displayDate}
              {juvenesMenu.isToday && (
                <span className="text-zinc-500 dark:text-zinc-400 font-normal">
                  {" "}· {juvenesMenu.displayDate}
                </span>
              )}
            </p>
          )}
          <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
            Powered by Juvenes
          </p>
        </div>

        {hiddenCount > 0 && (
          <div className="mb-4 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm text-zinc-600 dark:text-zinc-400">
            {hiddenCount} item{hiddenCount !== 1 ? "s" : ""} hidden by filter
          </div>
        )}

        {filteredCourses.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from(groupCoursesByCategory(filteredCourses)).map(([category, courses]) => (
              <CategorySection
                key={category}
                category={category}
                courses={courses}
                onHideType={hideType}
                isBlacklisted={checkIsBlacklisted}
                getBlacklistReason={getBlacklistReasonForRestaurant}
                onBlacklist={handleBlacklist}
                onRestore={handleRestore}
                isFavorite={checkIsFavorite}
                onFavorite={handleFavorite}
                onUnfavorite={handleUnfavorite}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-zinc-500 dark:text-zinc-400 py-8">
            All menu items are hidden by your filter settings.
          </p>
        )}
      </div>
    );
  }

  // Render Sodexo menu
  if (!menu || !menu.mealdates || menu.mealdates.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-zinc-500 dark:text-zinc-400">
          No menu available for this week.
        </p>
      </div>
    );
  }

  const todayMenu = menu.mealdates[todayIndex];
  const allCourses = todayMenu?.courses
    ? Object.values(todayMenu.courses)
    : [];

  // Check if we're showing today's menu
  const todayWeekday = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const isShowingToday = todayMenu?.date?.toLowerCase() === todayWeekday.toLowerCase();

  // Format display date
  const today = new Date();
  const displayDate = `${todayWeekday}, ${today.getDate()} ${today.toLocaleDateString("en-US", { month: "long" })}`;

  // Register discovered types
  allCourses.forEach((course) => {
    const mealType = course.category || course.meal_category;
    if (mealType) {
      addKnownType(mealType);
    }
  });

  // Filter courses based on hidden types
  const courses = allCourses.filter((course) => {
    const mealType = course.category || course.meal_category;
    return !mealType || !isTypeHidden(mealType);
  });

  const hiddenCount = allCourses.length - courses.length;

  return (
    <div className="w-full">
      {/* Blacklist Modal */}
      {blacklistModalFood && (
        <BlacklistModal
          foodName={blacklistModalFood}
          restaurantName={restaurant.name}
          onConfirm={handleConfirmBlacklist}
          onCancel={handleCancelBlacklist}
        />
      )}

      {/* Favorite Modal */}
      {favoriteModalFood && (
        <FavoriteModal
          foodName={favoriteModalFood.name}
          restaurantName={restaurant.name}
          category={favoriteModalFood.category}
          onConfirm={handleConfirmFavorite}
          onCancel={handleCancelFavorite}
          requestNotificationPermission={requestNotificationPermission}
          notificationPermission={notificationPermission}
        />
      )}

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {restaurant.name}
          </h2>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${restaurant.name} ${restaurant.address} ${restaurant.city}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            title="Open in Google Maps"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Map
          </a>
        </div>
        <p className="text-sm text-zinc-900 dark:text-zinc-100 font-medium">
          {isShowingToday ? "Today" : todayMenu?.date || ""}
          {isShowingToday && (
            <span className="text-zinc-500 dark:text-zinc-400 font-normal">
              {" "}· {displayDate}
            </span>
          )}
        </p>
      </div>

      {hiddenCount > 0 && (
        <div className="mb-4 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm text-zinc-600 dark:text-zinc-400">
          {hiddenCount} item{hiddenCount !== 1 ? "s" : ""} hidden by filter
        </div>
      )}

      {/* Menu items */}
      {courses.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from(groupSodexoCoursesByCategory(courses)).map(([category, categoryCourses]) => (
            <SodexoCategorySection
              key={category}
              category={category}
              courses={categoryCourses}
              language={language}
              onHideType={hideType}
              isBlacklisted={checkIsBlacklisted}
              getBlacklistReason={getBlacklistReasonForRestaurant}
              onBlacklist={handleBlacklist}
              onRestore={handleRestore}
              isFavorite={checkIsFavorite}
              onFavorite={handleFavorite}
              onUnfavorite={handleUnfavorite}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-zinc-500 dark:text-zinc-400 py-8">
          {allCourses.length > 0
            ? "All menu items are hidden by your filter settings."
            : "No menu items available for today."}
        </p>
      )}
    </div>
  );
}
