import { ref, computed, type Ref, type ComputedRef } from "vue";
import { FILTER_CONFIG } from "@/utils/constants";
import type { Product, UserPreferences } from "@/types";

/**
 * Tipos para el composable useFilters
 */
interface FiltersReturn {
  selectedCategories: Ref<string[]>;
  minPrice: Ref<number>;
  maxPrice: Ref<number>;
  hasActiveFilters: ComputedRef<boolean>;
  toggleCategory: (category: string) => void;
  updateMinPrice: (value: number) => void;
  updateMaxPrice: (value: number) => void;
  clearFilters: () => void;
  filterProducts: (products: Product[]) => Product[];
  setFiltersFromPreferences: (preferences: UserPreferences) => void;
  getFiltersState: () => {
    selectedCategories: string[];
    minPrice: number;
    maxPrice: number;
  };
}

/**
 * Composable para manejo de filtros de productos
 */
export function useFilters(): FiltersReturn {
  // Estados reactivos de filtros
  const selectedCategories: Ref<string[]> = ref([]);
  const minPrice: Ref<number> = ref(FILTER_CONFIG.defaultMinPrice);
  const maxPrice: Ref<number> = ref(FILTER_CONFIG.defaultMaxPrice);

  // Computed para detectar filtros activos
  const hasActiveFilters: ComputedRef<boolean> = computed(() => {
    return (
      selectedCategories.value.length > 0 ||
      minPrice.value > FILTER_CONFIG.defaultMinPrice ||
      maxPrice.value < FILTER_CONFIG.defaultMaxPrice
    );
  });

  // Función para alternar categoría
  const toggleCategory = (category: string): void => {
    const index: number = selectedCategories.value.indexOf(category);
    if (index > -1) {
      selectedCategories.value.splice(index, 1);
    } else {
      selectedCategories.value.push(category);
    }
  };

  // Función para actualizar precio mínimo
  const updateMinPrice = (value: number): void => {
    minPrice.value = value;
  };

  // Función para actualizar precio máximo
  const updateMaxPrice = (value: number): void => {
    maxPrice.value = value;
  };

  // Función para limpiar todos los filtros
  const clearFilters = (): void => {
    selectedCategories.value = [];
    minPrice.value = FILTER_CONFIG.defaultMinPrice;
    maxPrice.value = FILTER_CONFIG.defaultMaxPrice;
  };

  // Función para filtrar productos
  const filterProducts = (products: Product[]): Product[] => {
    return products.filter((product: Product): boolean => {
      const categoryMatch: boolean =
        selectedCategories.value.length === 0 ||
        selectedCategories.value.includes(product.category);

      const priceMatch: boolean =
        product.priceValue >= minPrice.value &&
        product.priceValue <= maxPrice.value;

      return categoryMatch && priceMatch;
    });
  };

  // Función para establecer filtros desde preferencias
  const setFiltersFromPreferences = (preferences: UserPreferences): void => {
    selectedCategories.value = preferences.selectedCategories || [];
    minPrice.value = preferences.minPrice || FILTER_CONFIG.defaultMinPrice;
    maxPrice.value = preferences.maxPrice || FILTER_CONFIG.defaultMaxPrice;
  };

  // Función para obtener filtros actuales como objeto
  const getFiltersState = () => ({
    selectedCategories: selectedCategories.value,
    minPrice: minPrice.value,
    maxPrice: maxPrice.value,
  });

  return {
    // Estados
    selectedCategories,
    minPrice,
    maxPrice,
    hasActiveFilters,

    // Métodos
    toggleCategory,
    updateMinPrice,
    updateMaxPrice,
    clearFilters,
    filterProducts,
    setFiltersFromPreferences,
    getFiltersState,
  };
}
