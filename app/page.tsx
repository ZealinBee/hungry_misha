"use client";

import { useState } from "react";
import { Restaurant } from "./types/sodexo";
import RestaurantSelector from "./components/RestaurantSelector";
import MenuDisplay from "./components/MenuDisplay";

export default function Home() {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Student Hungry
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Find student restaurant menus across Finland
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          {/* Sidebar - Restaurant Selection */}
          <aside>
            <RestaurantSelector
              selectedRestaurant={selectedRestaurant}
              onSelectRestaurant={setSelectedRestaurant}
            />
          </aside>

          {/* Main content - Menu Display */}
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
          Data provided by Sodexo Finland. Prices and availability may vary.
        </div>
      </footer>
    </div>
  );
}
