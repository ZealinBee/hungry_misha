"use client";

import { Restaurant } from "../types/sodexo";
import { restaurants, citiesWithRestaurants } from "../data/restaurants";
import { useState, useEffect, useCallback } from "react";

interface RestaurantSelectorProps {
  selectedRestaurant: Restaurant | null;
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

export default function RestaurantSelector({
  selectedRestaurant,
  onSelectRestaurant,
}: RestaurantSelectorProps) {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [hiddenRestaurants, setHiddenRestaurants] = useState<string[]>([]);
  const [showHidden, setShowHidden] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCity = localStorage.getItem("defaultCity") || "";
    const savedHidden = JSON.parse(localStorage.getItem("hiddenRestaurants") || "[]");
    setSelectedCity(savedCity);
    setHiddenRestaurants(savedHidden);
    setIsInitialized(true);
  }, []);

  // Save city to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("defaultCity", selectedCity);
    }
  }, [selectedCity, isInitialized]);

  // Save hidden restaurants to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("hiddenRestaurants", JSON.stringify(hiddenRestaurants));
    }
  }, [hiddenRestaurants, isInitialized]);

  // Auto-select default restaurant when city changes
  const selectDefaultRestaurant = useCallback((city: string) => {
    const defaultRestaurantId = localStorage.getItem(`defaultRestaurant_${city}`);
    if (defaultRestaurantId) {
      const restaurant = restaurants.find((r) => r.id === defaultRestaurantId);
      if (restaurant && !hiddenRestaurants.includes(restaurant.id)) {
        onSelectRestaurant(restaurant);
      }
    }
  }, [hiddenRestaurants, onSelectRestaurant]);

  // Load default restaurant on init and city change
  useEffect(() => {
    if (isInitialized && selectedCity) {
      selectDefaultRestaurant(selectedCity);
    }
  }, [isInitialized, selectedCity, selectDefaultRestaurant]);

  // Save selected restaurant as default for the city
  const handleSelectRestaurant = (restaurant: Restaurant) => {
    onSelectRestaurant(restaurant);
    if (selectedCity) {
      localStorage.setItem(`defaultRestaurant_${selectedCity}`, restaurant.id);
    }
  };

  const hideRestaurant = (restaurantId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHiddenRestaurants((prev) => [...prev, restaurantId]);
    if (selectedRestaurant?.id === restaurantId) {
      onSelectRestaurant(null as unknown as Restaurant);
    }
  };

  const restoreRestaurant = (restaurantId: string) => {
    setHiddenRestaurants((prev) => prev.filter((id) => id !== restaurantId));
  };

  const restoreAllRestaurants = () => {
    setHiddenRestaurants([]);
    setShowHidden(false);
  };

  const filteredRestaurants = (selectedCity
    ? restaurants.filter((r) => r.city === selectedCity)
    : restaurants
  ).filter((r) => !hiddenRestaurants.includes(r.id));

  const hiddenRestaurantsList = restaurants.filter((r) =>
    hiddenRestaurants.includes(r.id)
  );

  return (
    <div className="w-full max-w-md space-y-4">
      <div>
        <label
          htmlFor="city-select"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
        >
          Filter by city
        </label>
        <select
          id="city-select"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="">All cities</option>
          {citiesWithRestaurants.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Select a restaurant
        </label>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className={`relative group w-full text-left px-4 py-3 rounded-lg border transition-all cursor-pointer ${
                selectedRestaurant?.id === restaurant.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                  : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 bg-white dark:bg-zinc-800"
              }`}
              onClick={() => handleSelectRestaurant(restaurant)}
            >
              <div className="font-medium text-zinc-900 dark:text-zinc-100 pr-8">
                {restaurant.name}
              </div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">
                {restaurant.address}
              </div>
              <button
                onClick={(e) => hideRestaurant(restaurant.id, e)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded opacity-0 group-hover:opacity-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                title="Hide restaurant"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-zinc-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              </button>
            </div>
          ))}
          {filteredRestaurants.length === 0 && (
            <p className="text-center text-zinc-500 dark:text-zinc-400 py-4">
              No restaurants available.
            </p>
          )}
        </div>
      </div>

      {hiddenRestaurantsList.length > 0 && (
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
          <button
            onClick={() => setShowHidden(!showHidden)}
            className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-transform ${showHidden ? "rotate-90" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            Hidden restaurants ({hiddenRestaurantsList.length})
          </button>

          {showHidden && (
            <div className="mt-3 space-y-2">
              {hiddenRestaurantsList.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="flex items-center justify-between px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800"
                >
                  <div>
                    <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {restaurant.name}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {restaurant.city}
                    </div>
                  </div>
                  <button
                    onClick={() => restoreRestaurant(restaurant.id)}
                    className="text-xs px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                  >
                    Restore
                  </button>
                </div>
              ))}
              <button
                onClick={restoreAllRestaurants}
                className="w-full text-xs py-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Restore all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
