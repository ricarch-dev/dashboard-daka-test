/**
 * Constantes y configuración de la aplicación
 */

import type {
  PaginationConfig,
  FilterConfig,
  StorageKeys,
  User,
  NavigationItem,
  NotificationConfig,
  TransitionConfig,
} from "@/types";

// Configuración de paginación
export const PAGINATION_CONFIG: PaginationConfig = {
  itemsPerPage: 5,
  maxVisiblePages: 7,
};

// Configuración de filtros
export const FILTER_CONFIG: FilterConfig = {
  defaultMinPrice: 0,
  defaultMaxPrice: 1000,
  priceStep: 1,
};

// Claves de LocalStorage
export const STORAGE_KEYS: StorageKeys = {
  selectedCategories: "dashboard_selected_categories",
  priceRange: "dashboard_price_range",
  currentPage: "dashboard_current_page",
  preferences: "dashboard_preferences",
};

// Datos del usuario (mock)
export const USER_DATA: User = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

// Navegación del dashboard
export const NAVIGATION_ITEMS: NavigationItem[] = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Equipo", href: "#", current: false },
  { name: "Proyectos", href: "#", current: false },
  { name: "Calendario", href: "#", current: false },
  { name: "Reportes", href: "#", current: false },
];

// Navegación del usuario
export const USER_NAVIGATION: NavigationItem[] = [
  { name: "Tu Perfil", href: "#" },
  { name: "Configuraciones", href: "#" },
  { name: "Cerrar Sesión", href: "#" },
];

// Configuración de notificaciones
export const NOTIFICATION_CONFIG: NotificationConfig = {
  duration: 2000, // 2 segundos
  defaultTitle: "Notificación",
};

// Configuración de transiciones
export const TRANSITION_CONFIG: TransitionConfig = {
  duration: 150, // 150ms
  directions: {
    next: "next",
    prev: "prev",
  },
};
