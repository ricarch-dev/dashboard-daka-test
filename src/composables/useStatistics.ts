import { computed, type Ref, type ComputedRef } from "vue";
import { formatUSDPrice, formatExchangeRate } from "@/utils/formatters";
import type { Product, Statistics, Category } from "@/types";

/**
 * Tipos para el composable useStatistics
 */
interface StatisticsReturn {
  statistics: ComputedRef<Statistics>;
}

/**
 * Composable para cálculo de estadísticas de productos
 */
export function useStatistics(
  allProducts: Ref<Product[]>,
  filteredProducts: Ref<Product[]>,
  categories: Ref<Category[]>,
  dollarRate: Ref<number>
): StatisticsReturn {
  // Estadísticas calculadas
  const statistics: ComputedRef<Statistics> = computed(() => {
    const all: Product[] = allProducts.value;
    const filtered: Product[] = filteredProducts.value;

    // Precio promedio de todos los productos
    const averagePrice: number =
      all.length > 0
        ? all.reduce(
            (sum: number, product: Product) => sum + product.priceValue,
            0
          ) / all.length
        : 0;

    // Precio promedio de productos filtrados
    const filteredAveragePrice: number =
      filtered.length > 0
        ? filtered.reduce(
            (sum: number, product: Product) => sum + product.priceValue,
            0
          ) / filtered.length
        : 0;

    // Contar productos por categoría (solo filtrados)
    const categoryCount: Record<string, number> = {};
    filtered.forEach((product: Product) => {
      categoryCount[product.category] =
        (categoryCount[product.category] || 0) + 1;
    });

    // Encontrar categoría más popular
    const mostPopularCategory: [string, number] = Object.entries(
      categoryCount
    ).reduce(
      (a: [string, number], b: [string, number]) =>
        categoryCount[a[0]] > categoryCount[b[0]] ? a : b,
      ["Ninguna", 0]
    );

    return {
      // Contadores
      totalProducts: all.length,
      filteredProducts: filtered.length,
      categoriesCount: categories.value.length,

      // Precios promedio
      averagePrice: averagePrice.toFixed(2),
      filteredAveragePrice: filteredAveragePrice.toFixed(2),
      filteredAveragePriceFormatted: formatUSDPrice(filteredAveragePrice),

      // Categoría más popular
      mostPopularCategory: mostPopularCategory[0],
      mostPopularCategoryCount: mostPopularCategory[1],

      // Tasa de cambio
      dollarRate: dollarRate.value,
      dollarRateFormatted: formatExchangeRate(dollarRate.value),
    };
  });

  return {
    statistics,
  };
}
