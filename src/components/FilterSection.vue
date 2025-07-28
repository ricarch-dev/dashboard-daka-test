<template>
  <div class="mt-8 bg-gray-50 rounded-lg p-6">
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
            class="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded"
          >
            <input
              type="checkbox"
              :checked="selectedCategories.includes(category)"
              @change="$emit('toggle-category', category)"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span class="ml-2 text-sm text-gray-700 capitalize">{{
              category
            }}</span>
            <span class="ml-auto text-xs text-gray-500">
              ({{ allProducts.filter((p) => p.category === category).length }})
            </span>
          </label>
        </div>
      </div>

      <!-- Filtro por Precio -->
      <div>
        <h4 class="text-sm font-medium text-gray-900 mb-3">Precio</h4>
        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <div class="flex-1">
              <label class="block text-xs text-gray-600 mb-1">Mínimo</label>
              <input
                :value="minPrice"
                @input="$emit('update:minPrice', Number($event.target.value))"
                type="number"
                min="0"
                max="1000"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="$0"
              />
            </div>
            <div class="flex-1">
              <label class="block text-xs text-gray-600 mb-1">Máximo</label>
              <input
                :value="maxPrice"
                @input="$emit('update:maxPrice', Number($event.target.value))"
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
                :value="minPrice"
                @input="$emit('update:minPrice', Number($event.target.value))"
                type="range"
                min="0"
                max="1000"
                class="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <input
                :value="maxPrice"
                @input="$emit('update:maxPrice', Number($event.target.value))"
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
    <div v-if="hasActiveFilters" class="mt-4 pt-4 border-t border-gray-200">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-sm text-gray-600">Filtros activos:</span>
        <span
          v-for="category in selectedCategories"
          :key="category"
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
        >
          {{ category }}
          <button
            @click="$emit('toggle-category', category)"
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
          ({{ filteredCount }} productos)
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { FunnelIcon } from "@heroicons/vue/24/outline";

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

defineEmits([
  "clear-filters",
  "toggle-category",
  "update:minPrice",
  "update:maxPrice",
]);
</script>
