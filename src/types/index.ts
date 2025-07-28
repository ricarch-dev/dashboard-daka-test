/**
 * Tipos e interfaces centralizadas de la aplicación
 */

// Producto de la API externa
export interface RawProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

// Producto procesado para la aplicación
export interface Product {
  id: number;
  name: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  price: string; // Precio formateado USD
  priceValue: number; // Precio numérico original
  priceVES: string; // Precio formateado VES
  color: string;
  category: string;
  description: string;
}

// Categoría de productos
export type Category = string;

// Usuario del sistema
export interface User {
  name: string;
  email: string;
  imageUrl: string;
}

// Item de navegación
export interface NavigationItem {
  name: string;
  href: string;
  current: boolean;
}

// Preferencias del usuario
export interface UserPreferences {
  selectedCategories: string[];
  minPrice: number;
  maxPrice: number;
  currentPage: number;
}

// Estadísticas calculadas
export interface Statistics {
  totalProducts: number;
  filteredProducts: number;
  categoriesCount: number;
  averagePrice: string;
  filteredAveragePrice: string;
  filteredAveragePriceFormatted: string;
  mostPopularCategory: string;
  mostPopularCategoryCount: number;
  dollarRate: number;
  dollarRateFormatted: string;
}

// Configuración de paginación
export interface PaginationConfig {
  itemsPerPage: number;
  maxVisiblePages: number;
}

// Configuración de filtros
export interface FilterConfig {
  defaultMinPrice: number;
  defaultMaxPrice: number;
  priceStep: number;
}

// Configuración de transiciones
export interface TransitionConfig {
  duration: number;
  directions: {
    next: string;
    prev: string;
  };
}

// Configuración de notificaciones
export interface NotificationConfig {
  duration: number;
  defaultTitle: string;
}

// Claves de localStorage
export interface StorageKeys {
  selectedCategories: string;
  priceRange: string;
  currentPage: string;
  preferences: string;
}

// Opciones para formateo venezolano
export interface VenezuelanFormatOptions {
  currency?: string;
  decimals?: number;
  showCurrency?: boolean;
  showDecimals?: boolean;
}

// Respuesta de la API de tasa de cambio
export interface ExchangeRateResponse {
  monitors: {
    usd: {
      price: number;
      change: number;
      color: string;
      percent: number;
      symbol: string;
      title: string;
    };
  };
}

// Tipos para páginas visibles en paginación
export type VisiblePage = number | string;

// Direcciones de transición
export type TransitionDirection = "next" | "prev";

// Tipos de skeleton loading
export type SkeletonType = "stats" | "products";

// Clases de iconos para StatsCard
export type IconClass =
  | "icon-blue"
  | "icon-green"
  | "icon-yellow"
  | "icon-purple"
  | "icon-red"
  | "icon-indigo";
