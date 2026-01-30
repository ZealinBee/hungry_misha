"use client";

import { SodexoWeeklyMenu, SodexoCourse, Restaurant } from "../types/sodexo";
import { JamixResponse } from "../types/juvenes";
import { useEffect, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useMealTypeFilter } from "../contexts/MealTypeFilterContext";
import { MealTypeBadge } from "./MealTypeFilterSettings";

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
  onHideType,
}: {
  course: SodexoCourse;
  language: "en" | "fi";
  onHideType?: (type: string) => void;
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
    <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 relative group">
      {/* Meal type badge */}
      {mealType && (
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
      {/* Diet badges */}
      <div className="flex flex-wrap gap-1 mb-2">
        {dietCodes.map((code, i) => (
          <DietBadge key={i} code={code} />
        ))}
      </div>
      <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">
        {primaryTitle}
      </h4>
      {course.additionalDietInfo?.allergens && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">
          Allergens: {course.additionalDietInfo.allergens}
        </p>
      )}
    </div>
  );
}

function NormalizedCourseCard({
  course,
  onHideType,
}: {
  course: NormalizedCourse;
  onHideType?: (type: string) => void;
}) {
  return (
    <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 relative group">
      {/* Meal type badge */}
      {course.category && (
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
      {/* Diet badges */}
      <div className="flex flex-wrap gap-1 mb-2">
        {course.dietCodes.map((code, i) => (
          <DietBadge key={i} code={code} />
        ))}
      </div>
      <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">
        {course.name}
      </h4>
      {course.allergens && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">
          Allergens: {course.allergens}
        </p>
      )}
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
            name: item.name || "Unknown dish",
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
  const [menu, setMenu] = useState<SodexoWeeklyMenu | null>(null);
  const [juvenesMenu, setJuvenesMenu] = useState<{ courses: NormalizedCourse[]; displayDate: string; isToday: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayIndex, setTodayIndex] = useState(0);

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
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            {restaurant.name}
          </h2>
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
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredCourses.map((course, index) => (
              <NormalizedCourseCard key={index} course={course} onHideType={hideType} />
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
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
          {restaurant.name}
        </h2>
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
        <div className="grid gap-4 sm:grid-cols-2">
          {courses.map((course, index) => (
            <CourseCard key={index} course={course} language={language} onHideType={hideType} />
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
