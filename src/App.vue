<script setup lang="ts">
import "./style/app.css";
import "./style/components.css";
import { ref, computed, onMounted, watch, h } from "vue";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  TagIcon,
  ShoppingBagIcon,
} from "@heroicons/vue/24/outline";

// Importar API services
import {
  fetchProducts as apiGetProducts,
  updateProductsPricesVES,
} from "@/api/products";
import { fetchCategories as apiGetCategories } from "@/api/categories";
import { fetchExchangeRate } from "@/api/exchange";

// Importar composables
import { useFilters } from "@/composables/useFilters";
import { usePagination } from "@/composables/usePagination";
import { usePreferences } from "@/composables/usePreferences";
import { useStatistics } from "@/composables/useStatistics";

// Importar constantes
import {
  USER_DATA,
  NAVIGATION_ITEMS,
  USER_NAVIGATION,
} from "@/utils/constants";

// Importar tipos
import type { Product, Category } from "@/types";

// Importar componentes
import DashboardLayout from "@/components/DashboardLayout.vue";
import FilterSection from "@/components/FilterSection.vue";
import LoadingSkeleton from "@/components/LoadingSkeleton.vue";
import NotificationToast from "@/components/NotificationToast.vue";
import PaginationControls from "@/components/PaginationControls.vue";
import ProductCard from "@/components/ProductCard.vue";
import StatsCard from "@/components/StatsCard.vue";

// Estados principales
const allProducts = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const dollarRate = ref<number>(1);
const isLoading = ref<boolean>(true);

// Composables
const filters = useFilters();
const pagination = usePagination();
const preferences = usePreferences();

// Productos filtrados usando el composable
const filteredProducts = computed(() => {
  return filters.filterProducts(allProducts.value);
});

// Productos paginados usando el composable
const paginatedProducts = computed(() => {
  return pagination.paginateProducts(
    filteredProducts.value,
    filters.hasActiveFilters.value
  );
});

// Estadísticas usando el composable
const { statistics } = useStatistics(
  allProducts,
  filteredProducts,
  categories,
  dollarRate
);

// Computeds para paginación
const totalPages = computed(() =>
  pagination.getTotalPages(
    filteredProducts.value.length,
    filters.hasActiveFilters.value
  )
);

const startItem = computed(() =>
  pagination.getStartItem(
    filteredProducts.value.length,
    filters.hasActiveFilters.value
  )
);

const endItem = computed(() =>
  pagination.getEndItem(
    filteredProducts.value.length,
    filters.hasActiveFilters.value
  )
);

const visiblePages = computed(() =>
  pagination.getVisiblePages(totalPages.value)
);

// Handlers para DashboardLayout
const handleNavigation = (item: any) => {
  console.log("Navigating to:", item);
  NAVIGATION_ITEMS.forEach((navItem) => {
    navItem.current = navItem.name === item.name;
  });
};

const handleUserMenuClick = (item: any) => {
  console.log("User menu clicked:", item);
  if (item.name === "Sign out") {
    console.log("User signing out...");
  }
};

const handleNotificationClick = () => {
  console.log("Notification clicked");
};

// Función para inicializar la aplicación
const initializeApp = async (): Promise<void> => {
  try {
    // Cargar datos en paralelo
    const [productsData, categoriesData, exchangeRate] = await Promise.all([
      apiGetProducts(),
      apiGetCategories(),
      fetchExchangeRate(),
    ]);

    // Establecer datos
    categories.value = categoriesData;
    dollarRate.value = exchangeRate;

    // Actualizar productos con precios VES
    allProducts.value = updateProductsPricesVES(productsData, exchangeRate);

    // Cargar preferencias del usuario
    preferences.loadAndApplyPreferences(filters, pagination);
  } catch (error) {
    console.error("Error initializing app:", error);
  } finally {
    isLoading.value = false;
  }
};

// Función para guardar preferencias
const savePreferences = (): void => {
  preferences.saveCurrentPreferences(filters, pagination);
};

// Handlers para filtros
const handleToggleCategory = (category: string): void => {
  filters.toggleCategory(category);
  pagination.resetPage();
  savePreferences();
};

const handleClearFilters = (): void => {
  filters.clearFilters();
  pagination.resetPage();
  savePreferences();
};

const handleUpdateMinPrice = (value: number): void => {
  filters.updateMinPrice(value);
  pagination.resetPage();
  savePreferences();
};

const handleUpdateMaxPrice = (value: number): void => {
  filters.updateMaxPrice(value);
  pagination.resetPage();
  savePreferences();
};

// Handlers para paginación
const handleGoToPage = async (page: number): Promise<void> => {
  await pagination.goToPage(page);
  preferences.saveCurrentPreferencesSilent(filters, pagination);
};

const handleGoToPrevious = async (): Promise<void> => {
  await pagination.goToPrevious(totalPages.value);
  preferences.saveCurrentPreferencesSilent(filters, pagination);
};

const handleGoToNext = async (): Promise<void> => {
  await pagination.goToNext(totalPages.value);
  preferences.saveCurrentPreferencesSilent(filters, pagination);
};

// Watchers para auto-guardar preferencias
watch([filters.selectedCategories, filters.minPrice, filters.maxPrice], () => {
  pagination.resetPage();
  savePreferences();
});

// Inicializar al montar
onMounted(() => {
  initializeApp();
});

// Icono para notificación de éxito
const successIcon = {
  render: () => {
    return h(
      "svg",
      {
        fill: "currentColor",
        viewBox: "0 0 20 20",
        class: "h-5 w-5",
      },
      [
        h("path", {
          "fill-rule": "evenodd",
          d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
          "clip-rule": "evenodd",
        }),
      ]
    );
  },
};
</script>

<template>
  <DashboardLayout
    :user="USER_DATA"
    :navigation="NAVIGATION_ITEMS"
    :user-navigation="USER_NAVIGATION"
    page-title="Dashboard"
    page-subtitle="Gestión de productos y estadísticas en tiempo real"
    @navigate="handleNavigation"
    @user-menu-click="handleUserMenuClick"
    @notification-click="handleNotificationClick"
  >
    <!-- Notifications Slot -->
    <template #notifications>
      <NotificationToast
        :show="preferences.showPreferencesSaved.value"
        title="Preferencias guardadas"
        message="Tus filtros se mantendrán al recargar"
        :icon="successIcon"
        icon-class="text-green-400"
      />
    </template>

    <!-- Main Content -->
    <div>
      <div
        class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8"
      >
        <!-- Estadísticas Básicas -->
        <LoadingSkeleton v-if="isLoading" type="stats" />
        <div
          v-else
          class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          <StatsCard
            title="Total Productos"
            :value="statistics.totalProducts"
            :icon="ShoppingBagIcon"
            icon-class="icon-blue"
          />
          <StatsCard
            title="Filtrados"
            :value="statistics.filteredProducts"
            :subtitle="`${Math.round(
              (statistics.filteredProducts / statistics.totalProducts) * 100
            )}% del total`"
            :icon="ChartBarIcon"
            icon-class="icon-green"
          />
          <StatsCard
            title="Precio Promedio USD"
            :value="statistics.filteredAveragePriceFormatted"
            subtitle="Productos filtrados"
            :icon="CurrencyDollarIcon"
            icon-class="icon-yellow"
          />
          <StatsCard
            title="Categoría Popular"
            :value="statistics.mostPopularCategory"
            :subtitle="`${statistics.mostPopularCategoryCount} productos`"
            :icon="TagIcon"
            icon-class="icon-purple"
          />
          <StatsCard
            title="Tasa BCV"
            :value="statistics.dollarRateFormatted"
            subtitle="USD/VES"
            :icon="CurrencyDollarIcon"
            icon-class="icon-red"
          />
        </div>

        <!-- Filtros y Búsqueda -->
        <FilterSection
          :categories="categories"
          :selected-categories="filters.selectedCategories.value"
          :min-price="filters.minPrice.value"
          :max-price="filters.maxPrice.value"
          :all-products="allProducts"
          :filtered-count="filteredProducts.length"
          :has-active-filters="filters.hasActiveFilters.value"
          :is-loading="isLoading"
          @toggle-category="handleToggleCategory"
          @clear-filters="handleClearFilters"
          @update:minPrice="handleUpdateMinPrice"
          @update:maxPrice="handleUpdateMaxPrice"
        />

        <!-- Lista de Productos -->
        <div class="mt-6">
          <LoadingSkeleton v-if="isLoading" type="products" />
          <div v-else>
            <div
              class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
            >
              <ProductCard
                v-for="product in paginatedProducts"
                :key="product.id"
                :product="product"
                :dollar-rate="dollarRate"
                :is-transitioning="pagination.isTransitioning.value"
              />
            </div>

            <!-- Mensaje cuando no hay productos -->
            <div v-if="filteredProducts.length === 0" class="text-center py-12">
              <div class="text-gray-400 text-lg">
                No se encontraron productos con los filtros seleccionados
              </div>
            </div>
          </div>
        </div>

        <!-- Paginación -->
        <PaginationControls
          v-if="!isLoading && filteredProducts.length > 0"
          :current-page="pagination.currentPage.value"
          :total-pages="totalPages"
          :start-item="startItem"
          :end-item="endItem"
          :total-items="filteredProducts.length"
          :visible-pages="visiblePages"
          :has-active-filters="filters.hasActiveFilters.value"
          :is-transitioning="pagination.isTransitioning.value"
          @go-to-page="handleGoToPage"
          @go-to-previous="handleGoToPrevious"
          @go-to-next="handleGoToNext"
        />
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
/* === ANIMACIONES DE PÁGINA === */
.product-list-enter-active,
.product-list-leave-active {
  transition: all 0.3s ease;
}

.product-list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.product-list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.transitioning-next .product-list-enter-from {
  transform: translateX(30px);
}

.transitioning-next .product-list-leave-to {
  transform: translateX(-30px);
}

.transitioning-prev .product-list-enter-from {
  transform: translateX(-30px);
}

.transitioning-prev .product-list-leave-to {
  transform: translateX(30px);
}

/* Accesibilidad - reduced motion */
@media (prefers-reduced-motion: reduce) {
  .product-list-enter-active,
  .product-list-leave-active {
    animation: none;
    transition: none;
  }
}
</style>
