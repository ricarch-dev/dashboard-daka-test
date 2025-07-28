<template>
  <div>
    <!-- Stats Loading -->
    <div
      v-if="type === 'stats'"
      class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
    >
      <div
        v-for="i in 5"
        :key="i"
        class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm animate-pulse shimmer"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0 w-8 h-8 bg-gray-300 rounded"></div>
          <div class="ml-3 flex-1">
            <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div class="h-6 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Products Loading -->
    <div
      v-else-if="type === 'products'"
      class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
    >
      <div
        v-for="i in count"
        :key="i"
        class="group relative animate-pulse shimmer"
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

    <!-- Filters Loading -->
    <div v-else-if="type === 'filters'" class="mt-8 bg-gray-50 rounded-lg p-6">
      <div class="flex items-center gap-2 mb-4 animate-pulse">
        <div class="h-5 w-5 bg-gray-300 rounded"></div>
        <div class="h-6 bg-gray-300 rounded w-20"></div>
        <div class="ml-auto h-4 bg-gray-300 rounded w-24"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="animate-pulse">
          <div class="h-5 bg-gray-300 rounded w-20 mb-3"></div>
          <div class="space-y-2">
            <div v-for="i in 4" :key="i" class="flex items-center">
              <div class="h-4 w-4 bg-gray-300 rounded"></div>
              <div class="ml-2 h-4 bg-gray-300 rounded w-24"></div>
              <div class="ml-auto h-3 bg-gray-300 rounded w-8"></div>
            </div>
          </div>
        </div>

        <div class="animate-pulse">
          <div class="h-5 bg-gray-300 rounded w-16 mb-3"></div>
          <div class="space-y-4">
            <div class="flex space-x-4">
              <div class="flex-1">
                <div class="h-3 bg-gray-300 rounded w-16 mb-1"></div>
                <div class="h-10 bg-gray-300 rounded"></div>
              </div>
              <div class="flex-1">
                <div class="h-3 bg-gray-300 rounded w-16 mb-1"></div>
                <div class="h-10 bg-gray-300 rounded"></div>
              </div>
            </div>
            <div class="h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Generic Loading -->
    <div v-else class="animate-pulse">
      <div class="space-y-4">
        <div v-for="i in count || 3" :key="i" :class="skeletonClass">
          <div class="h-4 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
    </div>

    <!-- Loading message with dots -->
    <div v-if="showMessage" class="text-center mt-4">
      <p class="text-sm text-gray-500 loading-dots">
        {{ message || "Cargando" }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: "generic",
    validator: (value) =>
      ["stats", "products", "filters", "generic"].includes(value),
  },
  count: {
    type: Number,
    default: 8,
  },
  showMessage: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: "Cargando",
  },
  skeletonClass: {
    type: String,
    default: "p-4",
  },
});
</script>
