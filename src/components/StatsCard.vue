<template>
  <div
    class="stats-card bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
  >
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <component :is="icon" :class="iconClass" class="h-8 w-8" />
      </div>
      <div class="ml-3">
        <p class="text-sm font-medium text-gray-500">{{ title }}</p>
        <p class="stats-number text-2xl font-semibold text-gray-900">
          {{ value }}
        </p>
        <p v-if="subtitle" class="text-xs text-gray-400">{{ subtitle }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  subtitle: {
    type: String,
    default: null,
  },
  icon: {
    type: Object,
    required: true,
  },
  iconClass: {
    type: String,
    default: "text-gray-500",
  },
});
</script>

