<template>
  <component 
    :is="icon" 
    :class="[baseClass, gradientClass]"
    class="h-8 w-8"
  />
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  icon: {
    type: Object,
    required: true
  },
  color: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'green', 'yellow', 'purple', 'indigo', 'red', 'gray'].includes(value)
  },
  size: {
    type: String,
    default: 'h-8 w-8'
  },
  baseClass: {
    type: String,
    default: ''
  }
});

const gradientClass = computed(() => {
  const gradients = {
    blue: 'icon-blue',
    green: 'icon-green', 
    yellow: 'icon-yellow',
    purple: 'icon-purple',
    indigo: 'icon-indigo',
    red: 'icon-red',
    gray: 'icon-gray'
  };
  
  return gradients[props.color] || 'icon-blue';
});
</script>