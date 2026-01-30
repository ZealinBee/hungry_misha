"use client";

import { SodexoWeeklyMenu, SodexoCourse, Restaurant } from "../types/sodexo";
import { useEffect, useState } from "react";

interface MenuDisplayProps {
  restaurant: Restaurant;
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

function CourseCard({ course }: { course: SodexoCourse }) {
  const dietCodes = course.dietcodes
    ? course.dietcodes.split(",").map((c) => c.trim())
    : [];

  return (
    <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
      <div className="flex flex-wrap gap-1 mb-2">
        {dietCodes.map((code, i) => (
          <DietBadge key={i} code={code} />
        ))}
      </div>
      <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">
        {course.title_en || course.title_fi}
      </h4>
      {course.title_en && course.title_fi && course.title_en !== course.title_fi && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
          {course.title_fi}
        </p>
      )}
      {course.additionalDietInfo?.allergens && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">
          Allergens: {course.additionalDietInfo.allergens}
        </p>
      )}
    </div>
  );
}

export default function MenuDisplay({ restaurant }: MenuDisplayProps) {
  const [menu, setMenu] = useState<SodexoWeeklyMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayIndex, setTodayIndex] = useState(0);

  useEffect(() => {
    async function fetchMenu() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/menu/${restaurant.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch menu");
        }
        const data = await response.json();
        setMenu(data);

        // Set today as default selected day
        const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
        const todayIndex = data.mealdates?.findIndex(
          (d: { date: string }) => d.date.toLowerCase() === today.toLowerCase()
        );
        if (todayIndex >= 0) {
          setTodayIndex(todayIndex);
        } else {
          setTodayIndex(0);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, [restaurant.id]);

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
  const courses = todayMenu?.courses
    ? Object.values(todayMenu.courses)
    : [];

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
          {restaurant.name}
        </h2>
        {menu.timeperiod && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {menu.timeperiod}
          </p>
        )}
      </div>


      {/* Menu items */}
      {courses.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {courses.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>
      ) : (
        <p className="text-center text-zinc-500 dark:text-zinc-400 py-8">
          No menu items available for today.
        </p>
      )}
    </div>
  );
}
