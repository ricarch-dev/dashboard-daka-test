<template>
  <div
    class="group relative product-card rounded-md"
    :class="{ 'opacity-75': isTransitioning }"
  >
    <img
      :src="product.imageSrc"
      :alt="product.imageAlt"
      loading="lazy"
      class="aspect-square w-full rounded-md bg-white object-contain group-hover:opacity-75 lg:aspect-auto lg:h-80 transition-all duration-300"
    />
    <div class="mt-4 p-4 rounded-md">
      <div class="mb-2">
        <h3 class="text-sm text-gray-700 font-medium line-clamp-2">
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
          {{ formatUSDPrice(product.priceValue) }}
        </p>
        <p class="text-xs text-gray-600">
          {{ formatVenezuelanPrice(product.priceValue * dollarRate) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatVenezuelanPrice, formatUSDPrice } from "@/utils/formatters";

defineProps({
  product: {
    type: Object,
    required: true,
  },
  dollarRate: {
    type: Number,
    required: true,
  },
  isTransitioning: {
    type: Boolean,
    default: false,
  },
});
</script>
