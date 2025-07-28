import { STORAGE_KEYS } from "@/utils/constants";
import type { UserPreferences } from "@/types";

/**
 * Servicio para manejo de localStorage
 */

/**
 * Carga las preferencias guardadas desde localStorage
 * @returns {UserPreferences} Objeto con las preferencias cargadas
 */
export const loadPreferences = (): UserPreferences => {
  try {
    const preferences: UserPreferences = {
      selectedCategories: [],
      minPrice: 0,
      maxPrice: 1000,
      currentPage: 1,
    };

    // Cargar categorías seleccionadas
    const savedCategories: string | null = localStorage.getItem(
      STORAGE_KEYS.selectedCategories
    );
    if (savedCategories) {
      preferences.selectedCategories = JSON.parse(savedCategories) as string[];
    }

    // Cargar rango de precios
    const savedPriceRange: string | null = localStorage.getItem(
      STORAGE_KEYS.priceRange
    );
    if (savedPriceRange) {
      const { min, max }: { min: number; max: number } =
        JSON.parse(savedPriceRange);
      preferences.minPrice = min;
      preferences.maxPrice = max;
    }

    // Cargar página actual
    const savedPage: string | null = localStorage.getItem(
      STORAGE_KEYS.currentPage
    );
    if (savedPage) {
      preferences.currentPage = parseInt(savedPage, 10);
    }

    console.log("✅ Preferencias cargadas desde localStorage");
    return preferences;
  } catch (error) {
    console.error("Error loading preferences:", error);
    return {
      selectedCategories: [],
      minPrice: 0,
      maxPrice: 1000,
      currentPage: 1,
    };
  }
};

/**
 * Guarda las preferencias en localStorage
 * @param {UserPreferences} preferences - Objeto con las preferencias a guardar
 */
export const savePreferences = (preferences: UserPreferences): void => {
  try {
    const { selectedCategories, minPrice, maxPrice, currentPage } = preferences;

    localStorage.setItem(
      STORAGE_KEYS.selectedCategories,
      JSON.stringify(selectedCategories)
    );

    localStorage.setItem(
      STORAGE_KEYS.priceRange,
      JSON.stringify({
        min: minPrice,
        max: maxPrice,
      })
    );

    localStorage.setItem(STORAGE_KEYS.currentPage, currentPage.toString());

    console.log("💾 Preferencias guardadas en localStorage");
  } catch (error) {
    console.error("Error saving preferences:", error);
  }
};

/**
 * Limpia todas las preferencias del localStorage
 */
export const clearPreferences = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach((key: string) => {
      localStorage.removeItem(key);
    });
    console.log("🗑️ Preferencias eliminadas del localStorage");
  } catch (error) {
    console.error("Error clearing preferences:", error);
  }
};
