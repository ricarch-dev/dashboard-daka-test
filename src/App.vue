<script setup>
import "./style/app.css";
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  FunnelIcon,
} from "@heroicons/vue/24/outline";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  TagIcon,
  ShoppingBagIcon,
} from "@heroicons/vue/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/20/solid";

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
  { name: "Reports", href: "#", current: false },
];
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

// Estados reactivos
const allProducts = ref([]);
const categories = ref([]);
const selectedCategories = ref([]);
const minPrice = ref(0);
const maxPrice = ref(1000);
const currentPage = ref(1);
const itemsPerPage = 5;
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
    // Cargar categorías seleccionadas
    const savedCategories = localStorage.getItem(
      STORAGE_KEYS.selectedCategories
    );
    if (savedCategories) {
      selectedCategories.value = JSON.parse(savedCategories);
    }

    // Cargar rango de precios
    const savedPriceRange = localStorage.getItem(STORAGE_KEYS.priceRange);
    if (savedPriceRange) {
      const { min, max } = JSON.parse(savedPriceRange);
      minPrice.value = min;
      maxPrice.value = max;
    }

    // Cargar página actual
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
  loadPreferences(); // Cargar preferencias al montar el componente
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
      price: `$${product.price}`,
      priceValue: product.price,
      priceVES: 0, // Se calculará después
      color: product.category,
      category: product.category,
      description: product.description,
    }));

    // Calcular precios en VES
    allProducts.value.forEach((product) => {
      product.priceVES = (product.priceValue * dollarRate.value).toFixed(2);
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
    dollarRate.value = response.data.monitors.usd.price || 36.5; // Valor por defecto si falla
  } catch (error) {
    console.error("Error fetching dollar rate:", error);
    dollarRate.value = 36.5; // Valor por defecto
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

// Productos paginados
const paginatedProducts = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredProducts.value.slice(startIndex, endIndex);
});

// Cálculos de paginación
const totalPages = computed(() =>
  Math.ceil(filteredProducts.value.length / itemsPerPage)
);
const startItem = computed(() => (currentPage.value - 1) * itemsPerPage + 1);
const endItem = computed(() =>
  Math.min(currentPage.value * itemsPerPage, filteredProducts.value.length)
);

// Resetear página cuando cambian los filtros
watch([selectedCategories, minPrice, maxPrice], () => {
  currentPage.value = 1;
  savePreferences(); // Guardar preferencias al cambiar filtros
});

// Estadísticas calculadas
const statistics = computed(() => {
  const all = allProducts.value;
  const filtered = filteredProducts.value;

  // Precio promedio de todos los productos
  const averagePrice =
    all.length > 0
      ? all.reduce((sum, product) => sum + product.priceValue, 0) / all.length
      : 0;

  // Precio promedio de productos filtrados
  const filteredAveragePrice =
    filtered.length > 0
      ? filtered.reduce((sum, product) => sum + product.priceValue, 0) /
        filtered.length
      : 0;

  // Categoría más popular (en productos filtrados)
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
    mostPopularCategory: mostPopularCategory[0],
    mostPopularCategoryCount: mostPopularCategory[1],
    categoriesCount: categories.value.length,
    dollarRate: dollarRate.value,
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
  savePreferences(); // Guardar preferencias al limpiar filtros
};

// Funciones de paginación con animaciones
const goToPage = async (page) => {
  if (isTransitioning.value) return; // Evitar clicks múltiples durante transición

  transitionDirection.value = page > currentPage.value ? "next" : "prev";
  isTransitioning.value = true;

  // Pequeña pausa para la animación de salida
  await new Promise((resolve) => setTimeout(resolve, 150));

  currentPage.value = page;
  savePreferences();

  // Pausa para la animación de entrada
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
</script>

<template>
  <div class="min-h-full">
    <div class="bg-gray-800 pb-32">
      <Disclosure as="nav" class="bg-gray-800" v-slot="{ open }">
        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div class="border-b border-gray-700">
            <div class="flex h-16 items-center justify-between px-4 sm:px-0">
              <div class="flex items-center">
                <div class="shrink-0">
                  <img
                    class="size-8"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                    alt="Your Company"
                  />
                </div>
                <div class="hidden md:block">
                  <div class="ml-10 flex items-baseline space-x-4">
                    <a
                      v-for="item in navigation"
                      :key="item.name"
                      :href="item.href"
                      :class="[
                        item.current
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium',
                      ]"
                      :aria-current="item.current ? 'page' : undefined"
                      >{{ item.name }}</a
                    >
                  </div>
                </div>
              </div>
              <div class="hidden md:block">
                <div class="ml-4 flex items-center md:ml-6">
                  <button
                    type="button"
                    class="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                  >
                    <span class="absolute -inset-1.5" />
                    <span class="sr-only">View notifications</span>
                    <BellIcon class="size-6" aria-hidden="true" />
                  </button>

                  <!-- Profile dropdown -->
                  <Menu as="div" class="relative ml-3">
                    <MenuButton
                      class="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800"
                    >
                      <span class="absolute -inset-1.5" />
                      <span class="sr-only">Open user menu</span>
                      <img
                        class="size-8 rounded-full"
                        :src="user.imageUrl"
                        alt=""
                      />
                    </MenuButton>

                    <transition
                      enter-active-class="transition ease-out duration-100"
                      enter-from-class="transform opacity-0 scale-95"
                      enter-to-class="transform opacity-100 scale-100"
                      leave-active-class="transition ease-in duration-75"
                      leave-from-class="transform opacity-100 scale-100"
                      leave-to-class="transform opacity-0 scale-95"
                    >
                      <MenuItems
                        class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-hidden"
                      >
                        <MenuItem
                          v-for="item in userNavigation"
                          :key="item.name"
                          v-slot="{ active }"
                        >
                          <a
                            :href="item.href"
                            :class="[
                              active ? 'bg-gray-100 outline-hidden' : '',
                              'block px-4 py-2 text-sm text-gray-700',
                            ]"
                            >{{ item.name }}</a
                          >
                        </MenuItem>
                      </MenuItems>
                    </transition>
                  </Menu>
                </div>
              </div>
              <div class="-mr-2 flex md:hidden">
                <!-- Mobile menu button -->
                <DisclosureButton
                  class="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                >
                  <span class="absolute -inset-0.5" />
                  <span class="sr-only">Open main menu</span>
                  <Bars3Icon
                    v-if="!open"
                    class="block size-6"
                    aria-hidden="true"
                  />
                  <XMarkIcon v-else class="block size-6" aria-hidden="true" />
                </DisclosureButton>
              </div>
            </div>
          </div>
        </div>

        <DisclosurePanel class="border-b border-gray-700 md:hidden">
          <div class="space-y-1 px-2 py-3 sm:px-3">
            <DisclosureButton
              v-for="item in navigation"
              :key="item.name"
              as="a"
              :href="item.href"
              :class="[
                item.current
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium',
              ]"
              :aria-current="item.current ? 'page' : undefined"
              >{{ item.name }}</DisclosureButton
            >
          </div>
          <div class="border-t border-gray-700 pt-4 pb-3">
            <div class="flex items-center px-5">
              <div class="shrink-0">
                <img class="size-10 rounded-full" :src="user.imageUrl" alt="" />
              </div>
              <div class="ml-3">
                <div class="text-base/5 font-medium text-white">
                  {{ user.name }}
                </div>
                <div class="text-sm font-medium text-gray-400">
                  {{ user.email }}
                </div>
              </div>
              <button
                type="button"
                class="relative ml-auto shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
              >
                <span class="absolute -inset-1.5" />
                <span class="sr-only">View notifications</span>
                <BellIcon class="size-6" aria-hidden="true" />
              </button>
            </div>
            <div class="mt-3 space-y-1 px-2">
              <DisclosureButton
                v-for="item in userNavigation"
                :key="item.name"
                as="a"
                :href="item.href"
                class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                >{{ item.name }}</DisclosureButton
              >
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>
      <header class="py-10">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold tracking-tight text-white">
            Dashboard
          </h1>
        </div>
      </header>
    </div>

    <!-- Notificación de Preferencias Guardadas -->
    <transition name="notification">
      <div
        v-if="showPreferencesSaved"
        class="fixed top-20 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900">
              Preferencias guardadas
            </p>
            <p class="text-xs text-gray-500">
              Tus filtros se mantendrán al recargar
            </p>
          </div>
        </div>
      </div>
    </transition>

    <main class="-mt-32">
      <div class="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div class="rounded-lg bg-white px-5 py-6 shadow-sm sm:px-6">
          <!-- Your content -->
          <div class="bg-white">
            <div
              class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8"
            >
              <h2 class="text-2xl font-bold tracking-tight text-gray-900">
                Customers also purchased
              </h2>

              <!-- Estadísticas Básicas -->
              <div
                v-if="isLoading"
                class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
              >
                <div
                  v-for="i in 5"
                  :key="i"
                  class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm animate-pulse"
                >
                  <div class="flex items-center">
                    <div
                      class="flex-shrink-0 w-8 h-8 bg-gray-300 rounded"
                    ></div>
                    <div class="ml-3 flex-1">
                      <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div class="h-6 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-else
                class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
              >
                <!-- Total de Productos -->
                <div
                  class="stats-card bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <ShoppingBagIcon class="h-8 w-8 icon-blue" />
                    </div>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-gray-500">
                        Total Productos
                      </p>
                      <p
                        class="stats-number text-2xl font-semibold text-gray-900"
                      >
                        {{ statistics.totalProducts }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Productos Filtrados -->
                <div
                  class="stats-card bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <FunnelIcon class="h-8 w-8 icon-green" />
                    </div>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-gray-500">Filtrados</p>
                      <p
                        class="stats-number text-2xl font-semibold text-gray-900"
                      >
                        {{ statistics.filteredProducts }}
                      </p>
                      <p class="text-xs text-gray-400">
                        {{
                          statistics.totalProducts > 0
                            ? (
                                (statistics.filteredProducts /
                                  statistics.totalProducts) *
                                100
                              ).toFixed(0)
                            : 0
                        }}% del total
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Categorías Únicas -->
                <div
                  class="stats-card bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <TagIcon class="h-8 w-8 icon-purple" />
                    </div>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-gray-500">
                        Categorías Únicas
                      </p>
                      <p
                        class="stats-number text-2xl font-semibold text-gray-900"
                      >
                        {{ statistics.categoriesCount }}
                      </p>
                      <p class="text-xs text-gray-400">Disponibles</p>
                    </div>
                  </div>
                </div>

                <!-- Precio Promedio USD -->
                <div
                  class="stats-card bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <CurrencyDollarIcon class="h-8 w-8 icon-yellow" />
                    </div>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-gray-500">
                        Precio Promedio USD
                      </p>
                      <p
                        class="stats-number text-2xl font-semibold text-gray-900"
                      >
                        ${{ statistics.filteredAveragePrice }}
                      </p>
                      <p class="text-xs text-gray-400">Productos filtrados</p>
                    </div>
                  </div>
                </div>

                <!-- Tasa de Cambio -->
                <div
                  class="stats-card bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <ChartBarIcon class="h-8 w-8 icon-indigo" />
                    </div>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-gray-500">
                        USD/VES (BCV)
                      </p>
                      <p
                        class="stats-number text-lg font-semibold text-gray-900"
                      >
                        Bs. {{ statistics.dollarRate }}
                      </p>
                      <p class="text-xs text-gray-400">Por 1 USD</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Filtros -->
              <div class="mt-8 bg-gray-50 rounded-lg p-6">
                <div class="flex items-center gap-2 mb-4">
                  <FunnelIcon class="h-5 w-5 text-gray-500" />
                  <h3 class="text-lg font-medium text-gray-900">Filtros</h3>
                  <button
                    @click="clearFilters"
                    class="ml-auto text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    Limpiar filtros
                  </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Filtro por Categoría -->
                  <div>
                    <h4 class="text-sm font-medium text-gray-900 mb-3">
                      Categoría
                    </h4>
                    <div v-if="isLoading" class="space-y-2">
                      <div
                        v-for="i in 4"
                        :key="i"
                        class="flex items-center animate-pulse"
                      >
                        <div class="h-4 w-4 bg-gray-300 rounded"></div>
                        <div class="ml-2 h-4 bg-gray-300 rounded w-24"></div>
                        <div class="ml-auto h-3 bg-gray-300 rounded w-8"></div>
                      </div>
                    </div>
                    <div v-else class="space-y-2">
                      <label
                        v-for="category in categories"
                        :key="category"
                        class="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded"
                      >
                        <input
                          type="checkbox"
                          :checked="selectedCategories.includes(category)"
                          @change="toggleCategory(category)"
                          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span class="ml-2 text-sm text-gray-700 capitalize">{{
                          category
                        }}</span>
                        <span class="ml-auto text-xs text-gray-500">
                          ({{
                            allProducts.filter((p) => p.category === category)
                              .length
                          }})
                        </span>
                      </label>
                    </div>
                  </div>

                  <!-- Filtro por Precio -->
                  <div>
                    <h4 class="text-sm font-medium text-gray-900 mb-3">
                      Precio
                    </h4>
                    <div class="space-y-4">
                      <div class="flex items-center space-x-4">
                        <div class="flex-1">
                          <label class="block text-xs text-gray-600 mb-1"
                            >Mínimo</label
                          >
                          <input
                            v-model.number="minPrice"
                            type="number"
                            min="0"
                            max="1000"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="$0"
                          />
                        </div>
                        <div class="flex-1">
                          <label class="block text-xs text-gray-600 mb-1"
                            >Máximo</label
                          >
                          <input
                            v-model.number="maxPrice"
                            type="number"
                            min="0"
                            max="1000"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="$1000"
                          />
                        </div>
                      </div>

                      <!-- Range Slider -->
                      <div class="space-y-2">
                        <div class="flex justify-between text-xs text-gray-600">
                          <span>${{ minPrice }}</span>
                          <span>${{ maxPrice }}</span>
                        </div>
                        <div class="relative">
                          <input
                            v-model.number="minPrice"
                            type="range"
                            min="0"
                            max="1000"
                            class="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                          />
                          <input
                            v-model.number="maxPrice"
                            type="range"
                            min="0"
                            max="1000"
                            class="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Resumen de filtros activos -->
                <div
                  v-if="
                    selectedCategories.length > 0 ||
                    minPrice > 0 ||
                    maxPrice < 1000
                  "
                  class="mt-4 pt-4 border-t border-gray-200"
                >
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="text-sm text-gray-600">Filtros activos:</span>
                    <span
                      v-for="category in selectedCategories"
                      :key="category"
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {{ category }}
                      <button
                        @click="toggleCategory(category)"
                        class="ml-1 text-indigo-600 hover:text-indigo-500"
                      >
                        ×
                      </button>
                    </span>
                    <span
                      v-if="minPrice > 0 || maxPrice < 1000"
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      ${{ minPrice }} - ${{ maxPrice }}
                    </span>
                    <span class="text-sm text-gray-500">
                      ({{ filteredProducts.length }} productos)
                    </span>
                  </div>
                </div>
              </div>

              <!-- Productos -->
              <div
                v-if="isLoading"
                class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
              >
                <div
                  v-for="i in 8"
                  :key="i"
                  class="group relative animate-pulse"
                >
                  <div
                    class="aspect-square w-full rounded-md bg-gray-300 lg:aspect-auto lg:h-80"
                  ></div>
                  <div class="mt-4 flex justify-between">
                    <div class="flex-1">
                      <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div class="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                    <div class="h-4 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
              </div>

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

              <div
                v-else
                class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
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
                  <div
                    v-for="product in paginatedProducts"
                    :key="`${currentPage}-${product.id}`"
                    class="group relative product-card"
                    :class="{ 'opacity-75': isTransitioning }"
                  >
                    <img
                      :src="product.imageSrc"
                      :alt="product.imageAlt"
                      loading="lazy"
                      class="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80 transition-all duration-300"
                    />
                    <div class="mt-4">
                      <div class="mb-2">
                        <h3
                          class="text-sm text-gray-700 font-medium line-clamp-2"
                        >
                          <a :href="product.href">
                            <span aria-hidden="true" class="absolute inset-0" />
                            {{ product.name }}
                          </a>
                        </h3>
                        <p class="mt-1 text-xs text-gray-500 capitalize">
                          {{ product.category }}
                        </p>
                      </div>
                      <div class="flex flex-col space-y-1">
                        <p class="text-sm font-semibold text-gray-900">
                          {{ product.price }} USD
                        </p>
                        <p class="text-xs text-gray-600">
                          Bs.
                          {{ (product.priceValue * dollarRate).toFixed(2) }} VES
                        </p>
                      </div>
                    </div>
                  </div>
                </transition-group>
              </div>

              <!-- Paginación -->
              <div
                v-if="!isLoading && totalPages > 1"
                class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-10"
              >
                <div class="flex flex-1 justify-between sm:hidden">
                  <button
                    @click="goToPrevious"
                    :disabled="currentPage === 1"
                    :class="[
                      'relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium',
                      currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-50 cursor-pointer',
                    ]"
                  >
                    Anterior
                  </button>
                  <button
                    @click="goToNext"
                    :disabled="currentPage === totalPages"
                    :class="[
                      'relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium',
                      currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-50 cursor-pointer',
                    ]"
                  >
                    Siguiente
                  </button>
                </div>
                <div
                  class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between"
                >
                  <div>
                    <p class="text-sm text-gray-700">
                      Mostrando
                      <span class="font-medium">{{ startItem }}</span>
                      a
                      <span class="font-medium">{{ endItem }}</span>
                      de
                      <span class="font-medium">{{
                        filteredProducts.length
                      }}</span>
                      resultados
                    </p>
                  </div>
                  <div>
                    <nav
                      class="isolate inline-flex -space-x-px rounded-md shadow-xs"
                      aria-label="Pagination"
                    >
                      <button
                        @click="goToPrevious"
                        :disabled="currentPage === 1"
                        :class="[
                          'relative inline-flex items-center rounded-l-md px-2 py-2 ring-1 ring-gray-300 ring-inset focus:z-20 focus:outline-offset-0',
                          currentPage === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-400 hover:bg-gray-50 cursor-pointer',
                        ]"
                      >
                        <span class="sr-only">Anterior</span>
                        <ChevronLeftIcon class="size-5" aria-hidden="true" />
                      </button>

                      <template
                        v-for="(page, index) in visiblePages"
                        :key="index"
                      >
                        <span
                          v-if="page === '...'"
                          class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0"
                        >
                          ...
                        </span>
                        <button
                          v-else
                          @click="goToPage(page)"
                          :class="[
                            'relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0',
                            page === currentPage
                              ? 'z-10 bg-indigo-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                              : 'text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50',
                          ]"
                        >
                          {{ page }}
                        </button>
                      </template>

                      <button
                        @click="goToNext"
                        :disabled="currentPage === totalPages"
                        :class="[
                          'relative inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-gray-300 ring-inset focus:z-20 focus:outline-offset-0',
                          currentPage === totalPages
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-400 hover:bg-gray-50 cursor-pointer',
                        ]"
                      >
                        <span class="sr-only">Siguiente</span>
                        <ChevronRightIcon class="size-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
