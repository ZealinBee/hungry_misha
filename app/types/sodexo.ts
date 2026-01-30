export interface SodexoMeta {
  generated_timestamp: number;
  ref_url: string;
  ref_title: string;
  restaurant_mashie_id: string;
}

export interface SodexoAdditionalDietInfo {
  dietcodeImages: string[];
  allergens: string;
}

export interface SodexoRecipe {
  name: string;
  ingredients: string;
  nutrients: string;
  hideAll?: {
    dietcodes: string;
  };
}

export interface SodexoCourse {
  title_fi: string;
  title_en: string;
  category: string;
  meal_category: string | null;
  dietcodes: string;
  properties: string;
  additionalDietInfo: SodexoAdditionalDietInfo;
  price: string;
  recipes: Record<string, SodexoRecipe>;
}

export interface SodexoMealDay {
  date: string;
  courses: Record<string, SodexoCourse>;
}

export interface SodexoWeeklyMenu {
  meta: SodexoMeta;
  timeperiod: string;
  mealdates: SodexoMealDay[];
}

export interface Restaurant {
  id: string;
  name: string;
  city: string;
  address: string;
  provider: "sodexo" | "juvenes" | "campusravita";
  // JAMIX API fields (used by Juvenes and Campusravita)
  customerId?: number;
  kitchenId?: number;
}
