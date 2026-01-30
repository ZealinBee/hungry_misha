"use client";

import { useState } from "react";
import { Restaurant } from "./types/sodexo";
import RestaurantSelector from "./components/RestaurantSelector";
import MenuDisplay from "./components/MenuDisplay";
import LanguageToggle from "./components/LanguageToggle";
import MealTypeFilterSettings from "./components/MealTypeFilterSettings";
import { LanguageProvider } from "./contexts/LanguageContext";
import { MealTypeFilterProvider } from "./contexts/MealTypeFilterContext";
import { BlacklistProvider } from "./contexts/BlacklistContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import BlacklistSettings from "./components/BlacklistSettings";
import FavoritesSettings from "./components/FavoritesSettings";

export default function Home() {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);

  return (
    <LanguageProvider>
      <MealTypeFilterProvider>
        <BlacklistProvider>
          <FavoritesProvider>
          <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    Misha Hungry
                  </h1>
                  <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mt-0.5 sm:mt-1">
                    Find student restaurant menus across Finland
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <FavoritesSettings />
                  <BlacklistSettings />
                  <MealTypeFilterSettings />
                  <LanguageToggle />
                </div>
              </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
              <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
                <aside>
                  <RestaurantSelector
                    selectedRestaurant={selectedRestaurant}
                    onSelectRestaurant={setSelectedRestaurant}
                  />
                </aside>

                <section className="min-h-[400px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
                  {selectedRestaurant ? (
                    <MenuDisplay restaurant={selectedRestaurant} />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-16">
                      <div className="text-6xl mb-4">🍽️</div>
                      <h2 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                        Select a restaurant
                      </h2>
                      <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
                        Choose a student restaurant from the list to see this week&apos;s
                        menu.
                      </p>
                    </div>
                  )}
                </section>
              </div>
            </main>

            <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-auto">
              <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                Data provided by Sodexo Finland and Juvenes. Prices and availability may vary.
              </div>
            </footer>
          </div>
          </FavoritesProvider>
        </BlacklistProvider>
      </MealTypeFilterProvider>
    </LanguageProvider>
  );
}
