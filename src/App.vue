<script setup>
import "./style/app.css";
import "./style/components.css";
import { ref, computed, onMounted, watch, h } from "vue";
import axios from "axios";
import { FunnelIcon } from "@heroicons/vue/24/outline";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  TagIcon,
  ShoppingBagIcon,
} from "@heroicons/vue/24/outline";

// Importar utilidades de formateo
import {
  formatVenezuelanPrice,
  formatExchangeRate,
  formatUSDPrice,
} from "@/utils/formatters";

// Importar componentes
import StatsCard from "./components/StatsCard.vue";
import ProductCard from "./components/ProductCard.vue";
import FilterSection from "./components/FilterSection.vue";
import PaginationControls from "./components/PaginationControls.vue";
import NotificationToast from "./components/NotificationToast.vue";
import LoadingSkeleton from "./components/LoadingSkeleton.vue";
import DashboardLayout from "./components/DashboardLayout.vue";

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Equipo", href: "#", current: false },
  { name: "Proyectos", href: "#", current: false },
  { name: "Calendario", href: "#", current: false },
  { name: "Reportes", href: "#", current: false },
];
const userNavigation = [
  { name: "Tu Perfil", href: "#" },
  { name: "Configuraciones", href: "#" },
  { name: "Cerrar Sesión", href: "#" },
];

// Estados reactivos
const allProducts = ref([]);
const categories = ref([]);
const selectedCategories = ref([]);
const minPrice = ref(0);
const maxPrice = ref(1000);
const currentPage = ref(1);
const itemsPerPage = 5; // Vuelvo a 5 productos por página
const isLoading = ref(true);
const dollarRate = ref(1);

// Estados para animaciones y transiciones
const isTransitioning = ref(false);
const transitionDirection = ref("next");
const showPreferencesSaved = ref(false);

// LocalStorage keys
const STORAGE_KEYS = {
  selectedCategories: "dashboard_selected_categories",
  priceRange: "dashboard_price_range",
  currentPage: "dashboard_current_page",
  preferences: "dashboard_preferences",
};

// Computed para detectar filtros activos
const hasActiveFilters = computed(() => {
  return (
    selectedCategories.value.length > 0 ||
    minPrice.value > 0 ||
    maxPrice.value < 1000
  );
});

// Handlers for DashboardLayout
const handleNavigation = (item) => {
  console.log("Navigating to:", item);
  // Update navigation state
  navigation.forEach((navItem) => {
    navItem.current = navItem.name === item.name;
  });
};

const handleUserMenuClick = (item) => {
  console.log("User menu clicked:", item);
  // Implement user menu logic if needed
  if (item.name === "Sign out") {
    // Handle logout
    console.log("User signing out...");
  }
};

const handleNotificationClick = () => {
  console.log("Notification clicked");
  // Implement notification logic if needed
  // Could open a notifications panel, etc.
};

// Mostrar notificación de preferencias guardadas
const showSavedNotification = () => {
  showPreferencesSaved.value = true;
  setTimeout(() => {
    showPreferencesSaved.value = false;
  }, 2000);
};

// Cargar preferencias desde LocalStorage
const loadPreferences = () => {
  try {
    const savedCategories = localStorage.getItem(
      STORAGE_KEYS.selectedCategories
    );
    if (savedCategories) {
      selectedCategories.value = JSON.parse(savedCategories);
    }

    const savedPriceRange = localStorage.getItem(STORAGE_KEYS.priceRange);
    if (savedPriceRange) {
      const { min, max } = JSON.parse(savedPriceRange);
      minPrice.value = min;
      maxPrice.value = max;
    }

    const savedPage = localStorage.getItem(STORAGE_KEYS.currentPage);
    if (savedPage) {
      currentPage.value = parseInt(savedPage, 10);
    }

    console.log("✅ Preferencias cargadas desde LocalStorage");
  } catch (error) {
    console.error("Error loading preferences:", error);
  }
};

// Guardar preferencias en LocalStorage
const savePreferences = () => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.selectedCategories,
      JSON.stringify(selectedCategories.value)
    );
    localStorage.setItem(
      STORAGE_KEYS.priceRange,
      JSON.stringify({
        min: minPrice.value,
        max: maxPrice.value,
      })
    );
    localStorage.setItem(
      STORAGE_KEYS.currentPage,
      currentPage.value.toString()
    );

    showSavedNotification();
    console.log("💾 Preferencias guardadas en LocalStorage");
  } catch (error) {
    console.error("Error saving preferences:", error);
  }
};

// Fetch datos iniciales
onMounted(async () => {
  await Promise.all([fetchProducts(), fetchCategories(), fetchDollarRate()]);
  isLoading.value = false;
  loadPreferences();
});

// Obtener productos de la API usando axios
const fetchProducts = async () => {
  try {
    const response = await axios.get("https://fakestoreapi.com/products");
    const products = response.data;

    allProducts.value = products.map((product) => ({
      id: product.id,
      name: product.title,
      href: "#",
      imageSrc: product.image,
      imageAlt: product.title,
      price: formatUSDPrice(product.price),
      priceValue: product.price,
      priceVES: 0,
      color: product.category,
      category: product.category,
      description: product.description,
    }));

    allProducts.value.forEach((product) => {
      product.priceVES = formatVenezuelanPrice(
        product.priceValue * dollarRate.value
      );
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

// Obtener categorías de la API usando axios
const fetchCategories = async () => {
  try {
    const response = await axios.get(
      "https://fakestoreapi.com/products/categories"
    );
    categories.value = response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    categories.value = [
      "electronics",
      "jewelery",
      "men's clothing",
      "women's clothing",
    ];
  }
};

// Obtener tasa de cambio USD/VES usando axios
const fetchDollarRate = async () => {
  try {
    const response = await axios.get(
      "https://pydolarve.org/api/v1/dollar?page=bcv"
    );
    dollarRate.value = response.data.monitors.usd.price || 36.5;
  } catch (error) {
    console.error("Error fetching dollar rate:", error);
    dollarRate.value = 36.5;
  }
};

// Productos filtrados
const filteredProducts = computed(() => {
  let filtered = allProducts.value.filter((product) => {
    const categoryMatch =
      selectedCategories.value.length === 0 ||
      selectedCategories.value.includes(product.category);
    const priceMatch =
      product.priceValue >= minPrice.value &&
      product.priceValue <= maxPrice.value;
    return categoryMatch && priceMatch;
  });

  return filtered;
});

// Productos paginados con lógica inteligente
const paginatedProducts = computed(() => {
  // Si hay filtros activos, mostrar TODOS los productos filtrados
  if (hasActiveFilters.value) {
    return filteredProducts.value;
  }

  // Si NO hay filtros, usar paginación normal (5 por página)
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredProducts.value.slice(startIndex, endIndex);
});

// Cálculos de paginación inteligente
const totalPages = computed(() => {
  // Si hay filtros activos, siempre es 1 página (muestra todos)
  if (hasActiveFilters.value) {
    return 1;
  }

  // Si NO hay filtros, calcular páginas normalmente
  return Math.ceil(filteredProducts.value.length / itemsPerPage);
});

const startItem = computed(() => {
  // Si hay filtros activos, empieza desde 1
  if (hasActiveFilters.value) {
    return filteredProducts.value.length > 0 ? 1 : 0;
  }

  // Si NO hay filtros, cálculo normal
  return (currentPage.value - 1) * itemsPerPage + 1;
});

const endItem = computed(() => {
  // Si hay filtros activos, termina en el total de filtrados
  if (hasActiveFilters.value) {
    return filteredProducts.value.length;
  }

  // Si NO hay filtros, cálculo normal
  return Math.min(
    currentPage.value * itemsPerPage,
    filteredProducts.value.length
  );
});

// Resetear página cuando cambian los filtros
watch([selectedCategories, minPrice, maxPrice], () => {
  currentPage.value = 1;
  savePreferences();
});

// Estadísticas calculadas
const statistics = computed(() => {
  const all = allProducts.value;
  const filtered = filteredProducts.value;

  const averagePrice =
    all.length > 0
      ? all.reduce((sum, product) => sum + product.priceValue, 0) / all.length
      : 0;

  const filteredAveragePrice =
    filtered.length > 0
      ? filtered.reduce((sum, product) => sum + product.priceValue, 0) /
        filtered.length
      : 0;

  const categoryCount = {};
  filtered.forEach((product) => {
    categoryCount[product.category] =
      (categoryCount[product.category] || 0) + 1;
  });

  const mostPopularCategory = Object.entries(categoryCount).reduce(
    (a, b) => (categoryCount[a[0]] > categoryCount[b[0]] ? a : b),
    ["Ninguna", 0]
  );

  return {
    totalProducts: all.length,
    filteredProducts: filtered.length,
    averagePrice: averagePrice.toFixed(2),
    filteredAveragePrice: filteredAveragePrice.toFixed(2),
    filteredAveragePriceFormatted: formatUSDPrice(filteredAveragePrice),
    mostPopularCategory: mostPopularCategory[0],
    mostPopularCategoryCount: mostPopularCategory[1],
    categoriesCount: categories.value.length,
    dollarRate: dollarRate.value,
    dollarRateFormatted: formatExchangeRate(dollarRate.value),
  };
});

// Funciones de filtros
const toggleCategory = (category) => {
  const index = selectedCategories.value.indexOf(category);
  if (index > -1) {
    selectedCategories.value.splice(index, 1);
  } else {
    selectedCategories.value.push(category);
  }
};

const clearFilters = () => {
  selectedCategories.value = [];
  minPrice.value = 0;
  maxPrice.value = 1000;
  currentPage.value = 1;
  savePreferences();
};

const updateMinPrice = (value) => {
  minPrice.value = value;
};

const updateMaxPrice = (value) => {
  maxPrice.value = value;
};

// Funciones de paginación con animaciones
const goToPage = async (page) => {
  if (isTransitioning.value) return;

  transitionDirection.value = page > currentPage.value ? "next" : "prev";
  isTransitioning.value = true;

  await new Promise((resolve) => setTimeout(resolve, 150));

  currentPage.value = page;
  savePreferences();

  await new Promise((resolve) => setTimeout(resolve, 150));
  isTransitioning.value = false;
};

const goToPrevious = async () => {
  if (currentPage.value > 1 && !isTransitioning.value) {
    transitionDirection.value = "prev";
    isTransitioning.value = true;

    await new Promise((resolve) => setTimeout(resolve, 150));
    currentPage.value--;
    savePreferences();
    await new Promise((resolve) => setTimeout(resolve, 150));
    isTransitioning.value = false;
  }
};

const goToNext = async () => {
  if (currentPage.value < totalPages.value && !isTransitioning.value) {
    transitionDirection.value = "next";
    isTransitioning.value = true;

    await new Promise((resolve) => setTimeout(resolve, 150));
    currentPage.value++;
    savePreferences();
    await new Promise((resolve) => setTimeout(resolve, 150));
    isTransitioning.value = false;
  }
};

// Páginas visibles para la paginación
const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", total);
    } else if (current >= total - 3) {
      pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
    } else {
      pages.push(1, "...", current - 1, current, current + 1, "...", total);
    }
  }

  return pages;
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
    :user="user"
    :navigation="navigation"
    :user-navigation="userNavigation"
    page-title="Dashboard"
    page-subtitle="Gestión de productos y estadísticas en tiempo real"
    @navigate="handleNavigation"
    @user-menu-click="handleUserMenuClick"
    @notification-click="handleNotificationClick"
  >
    <!-- Notifications Slot -->
    <template #notifications>
      <NotificationToast
        :show="showPreferencesSaved"
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
            :subtitle="`${
              statistics.totalProducts > 0
                ? (
                    (statistics.filteredProducts / statistics.totalProducts) *
                    100
                  ).toFixed(0)
                : 0
            }% del total`"
            :icon="FunnelIcon"
            icon-class="icon-green"
          />
          <StatsCard
            title="Categorías Únicas"
            :value="statistics.categoriesCount"
            subtitle="Disponibles"
            :icon="TagIcon"
            icon-class="icon-purple"
          />
          <StatsCard
            title="Precio Promedio USD"
            :value="statistics.filteredAveragePriceFormatted"
            subtitle="Productos filtrados"
            :icon="CurrencyDollarIcon"
            icon-class="icon-yellow"
          />
          <StatsCard
            title="Tasa BCV"
            :value="statistics.dollarRateFormatted"
            subtitle="USD/VES actual"
            :icon="ChartBarIcon"
            icon-class="icon-indigo"
          />
        </div>

        <!-- Filtros -->
        <FilterSection
          :categories="categories"
          :selected-categories="selectedCategories"
          :min-price="minPrice"
          :max-price="maxPrice"
          :all-products="allProducts"
          :filtered-count="filteredProducts.length"
          :is-loading="isLoading"
          @clear-filters="clearFilters"
          @toggle-category="toggleCategory"
          @update:min-price="updateMinPrice"
          @update:max-price="updateMaxPrice"
        />

        <!-- Productos -->
        <LoadingSkeleton v-if="isLoading" type="products" :count="8" />
        <div
          v-else-if="paginatedProducts.length === 0"
          class="mt-6 text-center py-12"
        >
          <ShoppingBagIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">
            No hay productos
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            No se encontraron productos con los filtros seleccionados.
          </p>
          <div class="mt-6">
            <button
              @click="clearFilters"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
        <div v-else>
          <!-- Indicador cuando se muestran todos los resultados filtrados -->
          <div
            v-if="hasActiveFilters"
            class="mt-6 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <div class="flex items-center">
              <svg
                class="h-5 w-5 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              </svg>
              <div class="ml-3">
                <p class="text-sm text-blue-700">
                  <span class="font-medium"
                    >Mostrando todos los resultados filtrados</span
                  >
                  <span class="ml-1"
                    >({{ filteredProducts.length }} productos encontrados)</span
                  >
                </p>
              </div>
            </div>
          </div>

          <div
            class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5 xl:gap-x-8"
          >
            <transition-group
              name="product-list"
              tag="div"
              class="contents"
              :class="{
                'transitioning-next':
                  isTransitioning && transitionDirection === 'next',
                'transitioning-prev':
                  isTransitioning && transitionDirection === 'prev',
              }"
            >
              <ProductCard
                v-for="product in paginatedProducts"
                :key="`${currentPage}-${product.id}`"
                :product="product"
                :dollar-rate="dollarRate"
                :is-transitioning="isTransitioning"
              />
            </transition-group>
          </div>
        </div>

        <!-- Paginación - Solo mostrar cuando NO hay filtros activos o hay más de 1 página -->
        <PaginationControls
          v-if="!hasActiveFilters && totalPages > 1"
          :current-page="currentPage"
          :total-pages="totalPages"
          :start-item="startItem"
          :end-item="endItem"
          :total-items="filteredProducts.length"
          :visible-pages="visiblePages"
          @go-to-page="goToPage"
          @go-to-previous="goToPrevious"
          @go-to-next="goToNext"
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
