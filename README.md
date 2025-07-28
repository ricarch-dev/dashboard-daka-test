# 🚀 Dashboard Daka Test - Vue 3 + Tailwind CSS

Una aplicación completa de dashboard con filtros, paginación, estadísticas en tiempo real y arquitectura de componentes modular.

## ✨ Características Principales

### 📊 **Dashboard Completo**

- **Estadísticas en tiempo real** basadas en productos filtrados
- **Conversión automática USD → VES** usando API de pyDolarVenezuela
- **Indicadores visuales** con iconos con gradientes

### 🔍 **Sistema de Filtros Avanzado**

- **Filtros por categoría** con contadores dinámicos
- **Rango de precios** con sliders duales
- **Filtros reactivos** que actualizan estadísticas
- **Resumen de filtros activos** con badges removibles

### 📄 **Paginación Inteligente**

- **Navegación numérica** con puntos suspensivos
- **Estados disabled** para botones
- **Animaciones de transición** entre páginas
- **Responsive** para móvil y escritorio

### 💾 **Persistencia de Datos**

- **LocalStorage** para guardar preferencias
- **Filtros persistentes** al recargar la página
- **Notificaciones** de confirmación

### 🎨 **UI/UX Profesional**

- **Loading skeletons** animados
- **Transiciones suaves** con Vue Transitions
- **Responsive design** completo
- **Accesibilidad** mejorada

## 🏗️ Arquitectura de Componentes

### 📁 **Estructura Modular**

```
src/
├── components/
│   ├── DashboardLayout.vue      # Layout principal reutilizable
│   ├── StatsCard.vue           # Tarjetas de estadísticas reutilizables
│   ├── ProductCard.vue         # Tarjetas de productos individuales
│   ├── FilterSection.vue       # Sistema completo de filtros
│   ├── PaginationControls.vue  # Controles de paginación
│   ├── NotificationToast.vue   # Sistema de notificaciones
│   ├── LoadingSkeleton.vue     # Estados de carga animados
│   └── IconWithGradient.vue    # Iconos con gradientes reutilizables
├── style/
│   ├── app.css                 # Estilos globales de Tailwind
│   └── components.css          # Estilos centralizados de componentes
├── App.vue                     # Componente principal refactorizado
└── main.js                     # Punto de entrada
```

### 🔧 **Componentes Detallados**

#### **DashboardLayout.vue** 🏗️

```vue
<DashboardLayout
  :user="user"
  :navigation="navigation"
  :user-navigation="userNavigation"
  page-title="Dashboard"
  page-subtitle="Gestión de productos y estadísticas"
  @navigate="handleNavigation"
  @user-menu-click="handleUserMenuClick"
  @notification-click="handleNotificationClick"
>
  <!-- Notifications Slot -->
  <template #notifications>
    <NotificationToast />
  </template>
  
  <!-- Header Actions Slot -->
  <template #headerActions>
    <button>Action Button</button>
  </template>

  <!-- Main Content -->
  <div>Your page content here</div>
  
  <!-- Footer Slot -->
  <template #footer>
    <footer>Footer content</footer>
  </template>
</DashboardLayout>
```

**Características:**

- **Props**: user, navigation, userNavigation, logo, pageTitle, pageSubtitle
- **Eventos**: navigate, user-menu-click, notification-click
- **Slots**: notifications, headerActions, default, footer
- **Responsive**: Header colapsible en móviles
- **Accesible**: Navegación por teclado y ARIA labels

#### **StatsCard.vue**

```vue
<StatsCard
  title="Total Productos"
  :value="statistics.totalProducts"
  :icon="ShoppingBagIcon"
  icon-class="icon-blue"
  subtitle="Descripción opcional"
/>
```

#### **ProductCard.vue**

```vue
<ProductCard
  :product="product"
  :dollar-rate="dollarRate"
  :is-transitioning="isTransitioning"
/>
```

#### **FilterSection.vue**

```vue
<FilterSection
  :categories="categories"
  :selected-categories="selectedCategories"
  :min-price="minPrice"
  :max-price="maxPrice"
  :all-products="allProducts"
  :filtered-count="filteredProducts.length"
  :is-loading="isLoading"
  @clear-filters="clearFilters"
  @toggle-category="toggleCategory"
  @update:min-price="updateMinPrice"
  @update:max-price="updateMaxPrice"
/>
```

#### **PaginationControls.vue**

```vue
<PaginationControls
  :current-page="currentPage"
  :total-pages="totalPages"
  :start-item="startItem"
  :end-item="endItem"
  :total-items="filteredProducts.length"
  :visible-pages="visiblePages"
  @go-to-page="goToPage"
  @go-to-previous="goToPrevious"
  @go-to-next="goToNext"
/>
```

#### **LoadingSkeleton.vue**

```vue
<LoadingSkeleton type="stats" />
<LoadingSkeleton type="products" :count="8" />
<LoadingSkeleton type="filters" />
<LoadingSkeleton type="generic" show-message message="Cargando datos..." />
```

## 🛠️ Tecnologías

### **Frontend**

- **Vue 3** - Composition API con `<script setup>`
- **Tailwind CSS** - Framework CSS utilitario
- **HeadlessUI** - Componentes accesibles sin estilos
- **Heroicons** - Iconos SVG optimizados

### **HTTP & APIs**

- **Axios** - Cliente HTTP para requests
- **Fake Store API** - Datos de productos
- **pyDolarVenezuela** - Tasa de cambio BCV

### **Herramientas**

- **Vite** - Build tool y dev server
- **Bun** - Package manager rápido

## 🚀 Instalación y Uso

### **1. Clonar el repositorio**

```bash
git clone <repository-url>
cd dashboard-daka-test
```

### **2. Instalar dependencias**

```bash
bun install
# o
npm install
```

### **3. Ejecutar en desarrollo**

```bash
bun run dev
# o
npm run dev
```

### **4. Build para producción**

```bash
bun run build
# o
npm run build
```

## 📦 Dependencias

### **Principales**

```json
{
  "@headlessui/vue": "^1.7.23",
  "@heroicons/vue": "^2.2.0",
  "@tailwindcss/vite": "^4.1.11",
  "axios": "^1.11.0",
  "tailwindcss": "^4.1.11",
  "vue": "^3.5.18"
}
```

### **Desarrollo**

```json
{
  "@vitejs/plugin-vue": "^6.0.1",
  "vite": "^7.0.6",
  "vite-plugin-vue-devtools": "^8.0.0"
}
```

## 🎯 Funcionalidades Implementadas

### ✅ **Requisitos Básicos**

- [x] Listado de productos desde API real
- [x] Filtros por categoría y precio
- [x] Paginación funcional (5 productos por página)
- [x] Estadísticas en tiempo real
- [x] Conversión USD/VES automática

### ✅ **Extras Opcionales**

- [x] **Diseño responsive** para móviles
- [x] **Animaciones** al cambiar página
- [x] **LocalStorage** para guardar preferencias

### ✅ **Mejoras Adicionales**

- [x] **Arquitectura modular** con componentes reutilizables
- [x] **Loading states** con skeletons animados
- [x] **Notificaciones** de confirmación
- [x] **Accesibilidad** mejorada
- [x] **Performance** optimizada

## 🔥 Beneficios de la Refactorización

### **1. 🧩 Modularidad**

- **Componentes reutilizables** en múltiples proyectos
- **Separación de responsabilidades** clara
- **Mantenimiento** más fácil
- **DashboardLayout** reutilizable para múltiples páginas

### **2. 📈 Escalabilidad**

- **Fácil agregar** nuevas funcionalidades
- **Testing** independiente por componente
- **Desarrollo en equipo** más eficiente
- **Layout consistente** entre páginas

### **3. 🎨 Consistencia**

- **Design system** con componentes base
- **Props tipadas** para mejor DX
- **Estilos centralizados** en `components.css`
- **Tokens de diseño** unificados

### **4. 🚀 Performance**

- **Componentes optimizados** individualmente
- **Tree shaking** automático
- **Bundle size** reducido
- **CSS compartido** entre componentes

## 🎨 Sistema de Estilos

### **📁 Organización de Estilos**

```
src/style/
├── app.css          # Tailwind CSS base + utilidades globales
└── components.css   # Estilos específicos de componentes
```

### **🎯 Estilos Centralizados**

El archivo `components.css` incluye:

- **📊 Stats Cards**: Animaciones `slideInUp` y efectos hover
- **🛍️ Product Cards**: Transiciones y efectos `line-clamp-2`
- **🔍 Filtros**: Estilos para `slider-thumb` y controles
- **📄 Paginación**: Estados disabled y mobile-first
- **🔔 Notificaciones**: Transiciones `notification-*`
- **⏳ Loading**: Animaciones `pulse` y `shimmer`
- **🎨 Gradientes**: Clases `.icon-*` para todos los colores
- **📱 Responsive**: Breakpoints mobile, tablet, desktop
- **♿ Accesibilidad**: `prefers-reduced-motion` y `prefers-contrast`

### **🌈 Sistema de Colores**

```css
.icon-blue    → #3b82f6 → #1d4ed8  /* Productos, información */
.icon-green   → #10b981 → #047857  /* Filtros, éxito */
.icon-yellow  → #f59e0b → #d97706  /* Precios, advertencias */
.icon-purple  → #8b5cf6 → #7c3aed  /* Categorías */
.icon-indigo  → #6366f1 → #4f46e5  /* Estadísticas */
.icon-red     → #ef4444 → #dc2626  /* Errores */
.icon-gray    → #6b7280 → #4b5563; /* Neutrales */
```

## 🔍 Estructura del Código

### **App.vue - Orquestador Principal**
- **Gestión de estado** global de la aplicación
- **Lógica de negocio** y API calls
- **Comunicación** entre componentes
- **Coordinación** con DashboardLayout

### **DashboardLayout.vue - Layout System**
- **Estructura** de navegación y header
- **Sistema de slots** flexible
- **Responsive navigation** móvil/escritorio
- **Event handling** para navigation
- **Reutilizable** en múltiples páginas

### **Componentes - UI Especializada**
- **Props tipadas** para configuración
- **Eventos emitidos** para comunicación
- **Estilos compartidos** desde `components.css`
- **Funcionamiento independiente**

## 🏗️ Uso del DashboardLayout

### **Implementación Básica**
```vue
<template>
  <DashboardLayout
    :user="currentUser"
    :navigation="mainNavigation"
    :user-navigation="userMenuItems"
    page-title="Mi Página"
    page-subtitle="Descripción de la página"
    @navigate="handleNavigation"
    @user-menu-click="handleUserMenu"
    @notification-click="showNotifications"
  >
    <!-- Contenido principal -->
    <div>Mi contenido aquí</div>
  </DashboardLayout>
</template>
```

### **Con Slots Avanzados**
```vue
<template>
  <DashboardLayout>
    <!-- Notificaciones -->
    <template #notifications>
      <NotificationToast :show="showAlert" />
    </template>
    
    <!-- Acciones del header -->
    <template #headerActions>
      <button class="btn-primary">Nueva Acción</button>
      <SearchBox />
    </template>
    
    <!-- Contenido principal -->
    <MyPageContent />
    
    <!-- Footer personalizado -->
    <template #footer>
      <CustomFooter />
    </template>
  </DashboardLayout>
</template>
```

### **Configuración de Props**
```javascript
const user = {
  name: "Usuario",
  email: "usuario@ejemplo.com", 
  imageUrl: "https://ejemplo.com/avatar.jpg"
};

const navigation = [
  { name: "Dashboard", href: "/", current: true },
  { name: "Productos", href: "/productos", current: false },
  { name: "Reportes", href: "/reportes", current: false }
];

const userNavigation = [
  { name: "Perfil", href: "/perfil" },
  { name: "Configuración", href: "/config" },
  { name: "Cerrar Sesión", href: "/logout" }
];
```

## 🎨 Sistema de Diseño

### **Colores de Gradientes**

- `icon-blue` - Azul (productos, información)
- `icon-green` - Verde (filtros, éxito)
- `icon-yellow` - Amarillo (precios, advertencias)
- `icon-purple` - Púrpura (categorías)
- `icon-indigo` - Índigo (estadísticas)

### **Breakpoints Responsive**

- **Móvil**: < 640px
- **Tablet**: 641px - 1024px
- **Desktop**: > 1025px

## 🧪 Testing & QA

### **Casos de Uso Probados**

- ✅ Carga inicial de datos
- ✅ Filtrado por categorías múltiples
- ✅ Rango de precios dinámico
- ✅ Paginación con animaciones
- ✅ Persistencia en LocalStorage
- ✅ Responsive en diferentes dispositivos
- ✅ Estados de carga y error
- ✅ Accesibilidad con lectores de pantalla

## 📄 Licencia

Este proyecto fue desarrollado como prueba técnica para **Daka**.

---

**Desarrollado con ❤️ usando Vue 3 + Tailwind CSS**
