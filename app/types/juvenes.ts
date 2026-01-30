// Juvenes uses the JAMIX menu system
// API: https://fi.jamix.cloud/apps/menuservice/rest/haku/menu/{customerId}/{kitchenId}

export interface JamixMenuItem {
  name: string;
  orderNumber: number;
  portionSize?: number;
  diets?: string; // Comma-separated string like "G, M, Mu, *, SIS.LUOMUA"
  ingredients?: string;
  images?: string[];
}

export interface JamixMealOption {
  name: string; // e.g., "LUNCH", "VEGETARIAN LUNCH", "SALAD", "SNACK"
  orderNumber: number;
  id: number;
  menuItems: JamixMenuItem[];
}

export interface JamixDay {
  date: number; // YYYYMMDD format as number, e.g., 20260130
  weekday: number; // 1=Monday, 2=Tuesday, etc.
  mealoptions: JamixMealOption[];
  lang?: string;
}

export interface JamixMenu {
  menuName: string;
  menuAdditionalName?: string;
  menuId: number;
  days: JamixDay[];
}

export interface JamixMenuType {
  menuTypeId: number;
  menuTypeName: string;
  menus: JamixMenu[];
}

export interface JamixKitchen {
  kitchenName: string;
  kitchenId: number;
  info?: string;
  address?: string;
  city?: string;
  email?: string;
  phone?: string;
  menuTypes: JamixMenuType[];
}

// The API returns an array of kitchen objects directly
export type JamixResponse = JamixKitchen[];
