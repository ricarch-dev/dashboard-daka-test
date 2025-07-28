import { ref, type Ref } from "vue";
import {
  loadPreferences,
  savePreferences as saveToStorage,
} from "@/services/storage";
import { NOTIFICATION_CONFIG } from "@/utils/constants";
import type { UserPreferences } from "@/types";

/**
 * Tipos para el composable usePreferences
 */
interface FiltersComposable {
  selectedCategories?: Ref<string[]>;
  minPrice?: Ref<number>;
  maxPrice?: Ref<number>;
  setFiltersFromPreferences?: (preferences: UserPreferences) => void;
}

interface PaginationComposable {
  currentPage?: Ref<number>;
  setPageFromPreferences?: (preferences: UserPreferences) => void;
}

interface PreferencesReturn {
  showPreferencesSaved: Ref<boolean>;
  showSavedNotification: () => void;
  loadAndApplyPreferences: (
    filters?: FiltersComposable,
    pagination?: PaginationComposable
  ) => UserPreferences;
  saveCurrentPreferences: (
    filters?: FiltersComposable,
    pagination?: PaginationComposable
  ) => void;
  saveCurrentPreferencesSilent: (
    filters?: FiltersComposable,
    pagination?: PaginationComposable
  ) => void;
}

/**
 * Composable para manejo de preferencias del usuario
 */
export function usePreferences(): PreferencesReturn {
  // Estado para mostrar notificación de guardado
  const showPreferencesSaved: Ref<boolean> = ref(false);

  // Función para mostrar notificación de preferencias guardadas
  const showSavedNotification = (): void => {
    showPreferencesSaved.value = true;
    setTimeout(() => {
      showPreferencesSaved.value = false;
    }, NOTIFICATION_CONFIG.duration);
  };

  // Función para cargar preferencias y aplicarlas
  const loadAndApplyPreferences = (
    filters?: FiltersComposable,
    pagination?: PaginationComposable
  ): UserPreferences => {
    const preferences: UserPreferences = loadPreferences();

    if (filters && filters.setFiltersFromPreferences) {
      filters.setFiltersFromPreferences(preferences);
    }

    if (pagination && pagination.setPageFromPreferences) {
      pagination.setPageFromPreferences(preferences);
    }

    return preferences;
  };

  // Función para guardar preferencias actuales
  const saveCurrentPreferences = (
    filters?: FiltersComposable,
    pagination?: PaginationComposable
  ): void => {
    const preferences: UserPreferences = {
      selectedCategories: filters?.selectedCategories?.value || [],
      minPrice: filters?.minPrice?.value || 0,
      maxPrice: filters?.maxPrice?.value || 1000,
      currentPage: pagination?.currentPage?.value || 1,
    };

    saveToStorage(preferences);
    showSavedNotification();
  };

  // Función para guardar preferencias actuales sin notificación
  const saveCurrentPreferencesSilent = (
    filters?: FiltersComposable,
    pagination?: PaginationComposable
  ): void => {
    const preferences: UserPreferences = {
      selectedCategories: filters?.selectedCategories?.value || [],
      minPrice: filters?.minPrice?.value || 0,
      maxPrice: filters?.maxPrice?.value || 1000,
      currentPage: pagination?.currentPage?.value || 1,
    };

    saveToStorage(preferences);
  };

  return {
    // Estados
    showPreferencesSaved,

    // Métodos
    showSavedNotification,
    loadAndApplyPreferences,
    saveCurrentPreferences,
    saveCurrentPreferencesSilent,
  };
}
