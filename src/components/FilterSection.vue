<template>
  <div class="mt-8 bg-gray-50 shadow-sm rounded-lg p-6">
    <div class="flex items-center gap-2 mb-4">
      <FunnelIcon class="h-5 w-5 text-gray-500" />
      <h3 class="text-lg font-medium text-gray-900">Filtros</h3>
      <button
        @click="$emit('clear-filters')"
        class="ml-auto text-sm text-indigo-600 hover:text-indigo-500"
      >
        Limpiar filtros
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Filtro por Categoría -->
      <div>
        <h4 class="text-sm font-medium text-gray-900 mb-3">Categoría</h4>
        <div v-if="isLoading" class="space-y-2">
          <div v-for="i in 4" :key="i" class="flex items-center animate-pulse">
            <div class="h-4 w-4 bg-gray-300 rounded"></div>
            <div class="ml-2 h-4 bg-gray-300 rounded w-24"></div>
            <div class="ml-auto h-3 bg-gray-300 rounded w-8"></div>
          </div>
        </div>
        <div v-else class="space-y-2">
          <label
            v-for="category in categories"
            :key="category"
            class="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors"
          >
            <input
              type="checkbox"
              :checked="selectedCategories.includes(category)"
              @change="$emit('toggle-category', category)"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span class="ml-3 text-sm text-gray-700 capitalize flex-1">
              {{ category }}
            </span>
            <span
              class="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full"
            >
              {{ allProducts.filter((p) => p.category === category).length }}
            </span>
          </label>
        </div>
      </div>

      <!-- Filtro por Precio -->
      <div>
        <h4 class="text-sm font-medium text-gray-900 mb-3">Rango de Precio</h4>
        <div class="space-y-4">
          <!-- Inputs de precio -->
          <div class="flex items-center space-x-4">
            <div class="flex-1">
              <label class="block text-xs text-gray-600 mb-1">Mínimo</label>
              <div class="relative">
                <span
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"
                  >$</span
                >
                <input
                  :value="minPrice"
                  @input="updateMinPrice(Number($event.target.value))"
                  type="number"
                  min="0"
                  :max="maxPrice - 1"
                  class="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0"
                />
              </div>
            </div>
            <div class="flex items-center justify-center py-6">
              <div class="w-3 h-px bg-gray-300"></div>
            </div>
            <div class="flex-1">
              <label class="block text-xs text-gray-600 mb-1">Máximo</label>
              <div class="relative">
                <span
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"
                  >$</span
                >
                <input
                  :value="maxPrice"
                  @input="updateMaxPrice(Number($event.target.value))"
                  type="number"
                  :min="minPrice + 1"
                  max="1000"
                  class="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="1000"
                />
              </div>
            </div>
          </div>

          <!-- Range Visual -->
          <div class="space-y-3">
            <div class="flex justify-between text-xs text-gray-500">
              <span>$0</span>
              <span>$1000</span>
            </div>

            <!-- Custom Dual Range Slider -->
            <div class="relative h-8 flex items-center">
              <!-- Track de fondo -->
              <div
                class="absolute w-full h-2 bg-gray-200 rounded-full cursor-pointer"
                @click="handleTrackClick"
                ref="trackRef"
              ></div>

              <!-- Track activo -->
              <div
                class="absolute h-2 bg-indigo-500 rounded-full pointer-events-none"
                :style="{
                  left: `${(minPrice / 1000) * 100}%`,
                  width: `${((maxPrice - minPrice) / 1000) * 100}%`,
                }"
              ></div>

              <!-- Thumb MÍNIMO (Verde) -->
              <div
                class="absolute w-5 h-5 bg-green-500 border-2 border-white rounded-full cursor-grab active:cursor-grabbing shadow-md hover:scale-110 transition-transform z-20 custom-slider-thumb"
                :class="{ 'z-30': isDraggingMin }"
                :style="{
                  left: `calc(${(minPrice / 1000) * 100}% - 10px)`,
                }"
                @mousedown="startDragMin"
                @touchstart="startDragMin"
              >
                <div
                  class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap transition-opacity"
                  :class="{
                    'opacity-100': isDraggingMin,
                    'opacity-0': !isDraggingMin,
                  }"
                >
                  ${{ minPrice }}
                </div>
              </div>

              <!-- Thumb MÁXIMO (Azul) -->
              <div
                class="absolute w-5 h-5 bg-blue-500 border-2 border-white rounded-full cursor-grab active:cursor-grabbing shadow-md hover:scale-110 transition-transform z-20 custom-slider-thumb"
                :class="{ 'z-30': isDraggingMax }"
                :style="{
                  left: `calc(${(maxPrice / 1000) * 100}% - 10px)`,
                }"
                @mousedown="startDragMax"
                @touchstart="startDragMax"
              >
                <div
                  class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap transition-opacity"
                  :class="{
                    'opacity-100': isDraggingMax,
                    'opacity-0': !isDraggingMax,
                  }"
                >
                  ${{ maxPrice }}
                </div>
              </div>
            </div>

            <div
              class="flex justify-between text-xs font-medium text-indigo-600"
            >
              <span>${{ minPrice }}</span>
              <span>${{ maxPrice }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Resumen de filtros activos -->
    <div v-if="hasActiveFilters" class="mt-6 pt-4 border-t border-gray-200">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-sm font-medium text-gray-700">Filtros activos:</span>
        <span
          v-for="category in selectedCategories"
          :key="category"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
        >
          {{ category }}
          <button
            @click="$emit('toggle-category', category)"
            class="ml-2 text-indigo-600 hover:text-indigo-800"
          >
            ×
          </button>
        </span>
        <span
          v-if="minPrice > 0 || maxPrice < 1000"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
        >
          ${{ minPrice }} - ${{ maxPrice }}
        </span>
        <div class="flex items-center gap-1 text-sm text-gray-500">
          <span class="font-medium">{{ filteredCount }}</span>
          <span>productos encontrados</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onUnmounted } from "vue";
import { FunnelIcon } from "@heroicons/vue/24/outline";

// Referencias del DOM
const trackRef = ref(null);

// Estados de arrastre
const isDraggingMin = ref(false);
const isDraggingMax = ref(false);

const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
  selectedCategories: {
    type: Array,
    required: true,
  },
  minPrice: {
    type: Number,
    required: true,
  },
  maxPrice: {
    type: Number,
    required: true,
  },
  allProducts: {
    type: Array,
    required: true,
  },
  filteredCount: {
    type: Number,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const hasActiveFilters = computed(() => {
  return (
    props.selectedCategories.length > 0 ||
    props.minPrice > 0 ||
    props.maxPrice < 1000
  );
});

// Emits
const emit = defineEmits([
  "clear-filters",
  "toggle-category",
  "update:minPrice",
  "update:maxPrice",
]);

// Funciones para obtener valor desde posición
const getValueFromPosition = (clientX) => {
  if (!trackRef.value) return 0;

  const rect = trackRef.value.getBoundingClientRect();
  const percentage = Math.max(
    0,
    Math.min(1, (clientX - rect.left) / rect.width)
  );
  return Math.round(percentage * 1000);
};

// Funciones de arrastre para slider mínimo
const startDragMin = (event) => {
  event.preventDefault();
  isDraggingMin.value = true;

  const handleMouseMove = (e) => {
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    if (clientX) {
      const newValue = getValueFromPosition(clientX);
      if (newValue < props.maxPrice - 1) {
        emit("update:minPrice", Math.max(0, newValue));
      }
    }
  };

  const handleMouseUp = () => {
    isDraggingMin.value = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("touchmove", handleMouseMove);
    document.removeEventListener("touchend", handleMouseUp);
  };

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("touchmove", handleMouseMove, { passive: false });
  document.addEventListener("touchend", handleMouseUp);
};

// Funciones de arrastre para slider máximo
const startDragMax = (event) => {
  event.preventDefault();
  isDraggingMax.value = true;

  const handleMouseMove = (e) => {
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    if (clientX) {
      const newValue = getValueFromPosition(clientX);
      if (newValue > props.minPrice + 1) {
        emit("update:maxPrice", Math.min(1000, newValue));
      }
    }
  };

  const handleMouseUp = () => {
    isDraggingMax.value = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("touchmove", handleMouseMove);
    document.removeEventListener("touchend", handleMouseUp);
  };

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("touchmove", handleMouseMove, { passive: false });
  document.addEventListener("touchend", handleMouseUp);
};

// Función para hacer clic en el track
const handleTrackClick = (event) => {
  if (isDraggingMin.value || isDraggingMax.value) return;

  const newValue = getValueFromPosition(event.clientX);

  // Determinar cuál slider está más cerca
  const distanceToMin = Math.abs(newValue - props.minPrice);
  const distanceToMax = Math.abs(newValue - props.maxPrice);

  if (distanceToMin < distanceToMax && newValue < props.maxPrice - 1) {
    emit("update:minPrice", Math.max(0, newValue));
  } else if (newValue > props.minPrice + 1) {
    emit("update:maxPrice", Math.min(1000, newValue));
  }
};

// Funciones para inputs numéricos
const updateMinPrice = (value) => {
  const newMin = Math.min(value, props.maxPrice - 1);
  emit("update:minPrice", Math.max(0, newMin));
};

const updateMaxPrice = (value) => {
  const newMax = Math.max(value, props.minPrice + 1);
  emit("update:maxPrice", Math.min(1000, newMax));
};

// Limpiar event listeners al desmontar
onUnmounted(() => {
  document.removeEventListener("mousemove", () => {});
  document.removeEventListener("mouseup", () => {});
  document.removeEventListener("touchmove", () => {});
  document.removeEventListener("touchend", () => {});
});
</script>
