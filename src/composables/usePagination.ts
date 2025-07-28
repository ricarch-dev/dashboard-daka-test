import { ref, type Ref } from "vue";
import { PAGINATION_CONFIG, TRANSITION_CONFIG } from "@/utils/constants";
import type {
  Product,
  UserPreferences,
  VisiblePage,
  TransitionDirection,
} from "@/types";

/**
 * Tipos para el composable usePagination
 */
interface PaginationReturn {
  currentPage: Ref<number>;
  isTransitioning: Ref<boolean>;
  transitionDirection: Ref<TransitionDirection>;
  paginateProducts: (
    filteredProducts: Product[],
    hasActiveFilters: boolean
  ) => Product[];
  getTotalPages: (
    filteredProductsCount: number,
    hasActiveFilters: boolean
  ) => number;
  getStartItem: (
    filteredProductsCount: number,
    hasActiveFilters: boolean
  ) => number;
  getEndItem: (
    filteredProductsCount: number,
    hasActiveFilters: boolean
  ) => number;
  getVisiblePages: (totalPages: number) => VisiblePage[];
  goToPage: (page: number) => Promise<void>;
  goToPrevious: (totalPages: number) => Promise<void>;
  goToNext: (totalPages: number) => Promise<void>;
  resetPage: () => void;
  setPageFromPreferences: (preferences: UserPreferences) => void;
}

/**
 * Composable para manejo de paginación
 */
export function usePagination(): PaginationReturn {
  // Estados reactivos
  const currentPage: Ref<number> = ref(1);
  const isTransitioning: Ref<boolean> = ref(false);
  const transitionDirection: Ref<TransitionDirection> = ref(
    TRANSITION_CONFIG.directions.next as TransitionDirection
  );

  // Función para paginar productos con lógica inteligente
  const paginateProducts = (
    filteredProducts: Product[],
    hasActiveFilters: boolean
  ): Product[] => {
    // Si hay filtros activos, mostrar TODOS los productos filtrados
    if (hasActiveFilters) {
      return filteredProducts;
    }

    // Si NO hay filtros, usar paginación normal
    const startIndex: number =
      (currentPage.value - 1) * PAGINATION_CONFIG.itemsPerPage;
    const endIndex: number = startIndex + PAGINATION_CONFIG.itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };

  // Calculated properties
  const getTotalPages = (
    filteredProductsCount: number,
    hasActiveFilters: boolean
  ): number => {
    // Si hay filtros activos, siempre es 1 página (muestra todos)
    if (hasActiveFilters) {
      return 1;
    }
    // Si NO hay filtros, calcular páginas normalmente
    return Math.ceil(filteredProductsCount / PAGINATION_CONFIG.itemsPerPage);
  };

  const getStartItem = (
    filteredProductsCount: number,
    hasActiveFilters: boolean
  ): number => {
    // Si hay filtros activos, empieza desde 1
    if (hasActiveFilters) {
      return filteredProductsCount > 0 ? 1 : 0;
    }
    // Si NO hay filtros, cálculo normal
    return (currentPage.value - 1) * PAGINATION_CONFIG.itemsPerPage + 1;
  };

  const getEndItem = (
    filteredProductsCount: number,
    hasActiveFilters: boolean
  ): number => {
    // Si hay filtros activos, termina en el total de filtrados
    if (hasActiveFilters) {
      return filteredProductsCount;
    }
    // Si NO hay filtros, cálculo normal
    return Math.min(
      currentPage.value * PAGINATION_CONFIG.itemsPerPage,
      filteredProductsCount
    );
  };

  // Páginas visibles para la paginación
  const getVisiblePages = (totalPages: number): VisiblePage[] => {
    const pages: VisiblePage[] = [];
    const current: number = currentPage.value;

    if (totalPages <= PAGINATION_CONFIG.maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (current >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          current - 1,
          current,
          current + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  // Funciones de navegación con animaciones
  const goToPage = async (page: number): Promise<void> => {
    if (isTransitioning.value) return;

    transitionDirection.value =
      page > currentPage.value
        ? (TRANSITION_CONFIG.directions.next as TransitionDirection)
        : (TRANSITION_CONFIG.directions.prev as TransitionDirection);

    isTransitioning.value = true;

    await new Promise<void>((resolve) =>
      setTimeout(resolve, TRANSITION_CONFIG.duration)
    );
    currentPage.value = page;
    await new Promise<void>((resolve) =>
      setTimeout(resolve, TRANSITION_CONFIG.duration)
    );

    isTransitioning.value = false;
  };

  const goToPrevious = async (_totalPages: number): Promise<void> => {
    if (currentPage.value > 1 && !isTransitioning.value) {
      await goToPage(currentPage.value - 1);
    }
  };

  const goToNext = async (totalPages: number): Promise<void> => {
    if (currentPage.value < totalPages && !isTransitioning.value) {
      await goToPage(currentPage.value + 1);
    }
  };

  // Resetear página a 1
  const resetPage = (): void => {
    currentPage.value = 1;
  };

  // Establecer página desde preferencias
  const setPageFromPreferences = (preferences: UserPreferences): void => {
    currentPage.value = preferences.currentPage || 1;
  };

  return {
    // Estados
    currentPage,
    isTransitioning,
    transitionDirection,

    // Métodos de paginación
    paginateProducts,
    getTotalPages,
    getStartItem,
    getEndItem,
    getVisiblePages,

    // Métodos de navegación
    goToPage,
    goToPrevious,
    goToNext,
    resetPage,
    setPageFromPreferences,
  };
}
