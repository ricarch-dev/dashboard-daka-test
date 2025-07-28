<template>
  <div
    v-if="totalPages > 1"
    class="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-10"
  >
    <!-- Mobile pagination -->
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        @click="$emit('go-to-previous')"
        :disabled="currentPage === 1"
        :class="[
          'relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium pagination-mobile',
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-50 cursor-pointer',
        ]"
      >
        Anterior
      </button>
      <button
        @click="$emit('go-to-next')"
        :disabled="currentPage === totalPages"
        :class="[
          'relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium pagination-mobile',
          currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-50 cursor-pointer',
        ]"
      >
        Siguiente
      </button>
    </div>

    <!-- Desktop pagination -->
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Mostrando
          <span class="font-medium">{{ startItem }}</span>
          a
          <span class="font-medium">{{ endItem }}</span>
          de
          <span class="font-medium">{{ totalItems }}</span>
          resultados
        </p>
      </div>
      <div>
        <nav
          class="isolate inline-flex -space-x-px rounded-md shadow-xs bg-white"
          aria-label="Pagination"
        >
          <!-- Previous Button -->
          <button
            @click="$emit('go-to-previous')"
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

          <!-- Page Numbers -->
          <template v-for="(page, index) in visiblePages" :key="index">
            <span
              v-if="page === '...'"
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0"
            >
              ...
            </span>
            <button
              v-else
              @click="$emit('go-to-page', page)"
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

          <!-- Next Button -->
          <button
            @click="$emit('go-to-next')"
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
</template>

<script setup>
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/20/solid";

defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  startItem: {
    type: Number,
    required: true,
  },
  endItem: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  visiblePages: {
    type: Array,
    required: true,
  },
});

defineEmits(["go-to-page", "go-to-previous", "go-to-next"]);
</script>

