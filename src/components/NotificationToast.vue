<template>
  <transition name="notification">
    <div
      v-if="show"
      class="fixed top-20 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4 toast"
    >
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <component :is="icon" :class="iconClass" class="h-5 w-5" />
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-gray-900">
            {{ title }}
          </p>
          <p v-if="message" class="text-xs text-gray-500">
            {{ message }}
          </p>
        </div>
        <button
          v-if="closable"
          @click="$emit('close')"
          class="ml-auto text-gray-400 hover:text-gray-600"
        >
          <span class="sr-only">Cerrar</span>
          <XMarkIcon class="h-4 w-4" />
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { XMarkIcon } from "@heroicons/vue/24/outline";

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: null,
  },
  icon: {
    type: Object,
    required: true,
  },
  iconClass: {
    type: String,
    default: "text-gray-400",
  },
  closable: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["close"]);
</script>


