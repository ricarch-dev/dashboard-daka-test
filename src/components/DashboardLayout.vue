<template>
  <div class="min-h-full">
    <!-- Sección de encabezado -->
    <div class="bg-gray-800 pb-32 shadow-xl">
      <Disclosure as="nav" class="bg-gray-800" v-slot="{ open }">
        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div class="border-b border-gray-700">
            <div class="flex h-16 items-center justify-between px-4 sm:px-0">
              <!-- Logo y navegación -->
              <div class="flex items-center">
                <div class="shrink-0">
                  <img :src="logo.src" :alt="logo.alt" class="size-8" />
                </div>
                <div class="hidden md:block">
                  <div class="ml-10 flex items-baseline space-x-4">
                    <a
                      v-for="item in navigation"
                      :key="item.name"
                      :href="item.href"
                      :class="[
                        item.current
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium',
                      ]"
                      :aria-current="item.current ? 'page' : undefined"
                      @click="$emit('navigate', item)"
                    >
                      {{ item.name }}
                    </a>
                  </div>
                </div>
              </div>

              <!-- Sección de usuario -->
              <div class="hidden md:block">
                <div class="ml-4 flex items-center md:ml-6">
                  <!-- Notificaciones -->
                  <button
                    type="button"
                    class="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                    @click="$emit('notification-click')"
                  >
                    <span class="absolute -inset-1.5" />
                    <span class="sr-only">Ver notificaciones</span>
                    <BellIcon class="size-6" aria-hidden="true" />
                  </button>

                  <!-- Perfil -->
                  <Menu as="div" class="relative ml-3">
                    <MenuButton
                      class="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800"
                    >
                      <span class="absolute -inset-1.5" />
                      <span class="sr-only">Abrir menú de usuario</span>
                      <img
                        class="size-8 rounded-full"
                        :src="user.imageUrl"
                        :alt="user.name"
                      />
                    </MenuButton>

                    <transition
                      enter-active-class="transition ease-out duration-100"
                      enter-from-class="transform opacity-0 scale-95"
                      enter-to-class="transform opacity-100 scale-100"
                      leave-active-class="transition ease-in duration-75"
                      leave-from-class="transform opacity-100 scale-100"
                      leave-to-class="transform opacity-0 scale-95"
                    >
                      <MenuItems
                        class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-hidden"
                      >
                        <MenuItem
                          v-for="item in userNavigation"
                          :key="item.name"
                          v-slot="{ active }"
                        >
                          <a
                            :href="item.href"
                            :class="[
                              active ? 'bg-gray-100 outline-hidden' : '',
                              'block px-4 py-2 text-sm text-gray-700',
                            ]"
                            @click="$emit('user-menu-click', item)"
                          >
                            {{ item.name }}
                          </a>
                        </MenuItem>
                      </MenuItems>
                    </transition>
                  </Menu>
                </div>
              </div>

              <!-- Botón de menú móvil -->
              <div class="-mr-2 flex md:hidden">
                <DisclosureButton
                  class="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                >
                  <span class="absolute -inset-0.5" />
                  <span class="sr-only">Abrir menú principal</span>
                  <Bars3Icon
                    v-if="!open"
                    class="block size-6"
                    aria-hidden="true"
                  />
                  <XMarkIcon v-else class="block size-6" aria-hidden="true" />
                </DisclosureButton>
              </div>
            </div>
          </div>
        </div>

        <!-- Panel de navegación móvil -->
        <DisclosurePanel class="border-b border-gray-700 md:hidden">
          <div class="space-y-1 px-2 py-3 sm:px-3">
            <DisclosureButton
              v-for="item in navigation"
              :key="item.name"
              as="a"
              :href="item.href"
              :class="[
                item.current
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium',
              ]"
              :aria-current="item.current ? 'page' : undefined"
              @click="$emit('navigate', item)"
            >
              {{ item.name }}
            </DisclosureButton>
          </div>

          <!-- Sección de usuario móvil -->
          <div class="border-t border-gray-700 pt-4 pb-3">
            <div class="flex items-center px-5">
              <div class="shrink-0">
                <img
                  class="size-10 rounded-full"
                  :src="user.imageUrl"
                  :alt="user.name"
                />
              </div>
              <div class="ml-3">
                <div class="text-base/5 font-medium text-white">
                  {{ user.name }}
                </div>
                <div class="text-sm font-medium text-gray-400">
                  {{ user.email }}
                </div>
              </div>
              <button
                type="button"
                class="relative ml-auto shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                @click="$emit('notification-click')"
              >
                <span class="absolute -inset-1.5" />
                <span class="sr-only">Ver notificaciones</span>
                <BellIcon class="size-6" aria-hidden="true" />
              </button>
            </div>
            <div class="mt-3 space-y-1 px-2">
              <DisclosureButton
                v-for="item in userNavigation"
                :key="item.name"
                as="a"
                :href="item.href"
                class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                @click="$emit('user-menu-click', item)"
              >
                {{ item.name }}
              </DisclosureButton>
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>

      <!-- Encabezado de página -->
      <header class="py-10">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <h1 class="text-3xl font-bold tracking-tight text-white">
              {{ pageTitle }}
            </h1>
            <!-- Slot de acciones del encabezado -->
            <div
              v-if="$slots.headerActions"
              class="flex items-center space-x-4"
            >
              <slot name="headerActions" />
            </div>
          </div>
          <!-- Subtítulo del encabezado -->
          <p v-if="pageSubtitle" class="mt-2 text-lg text-gray-300">
            {{ pageSubtitle }}
          </p>
        </div>
      </header>
    </div>

    <!-- Slot de notificaciones -->
    <div v-if="$slots.notifications">
      <slot name="notifications" />
    </div>

    <!-- Contenido principal -->
    <main class="-mt-32">
      <div class="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div class="rounded-lg bg-slate-100 px-5 py-6 shadow-sm sm:px-6">
          <!-- Slot de contenido principal -->
          <slot />
        </div>
      </div>
    </main>

    <!-- Slot de pie de página -->
    <footer v-if="$slots.footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<script setup>
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/vue/24/outline";

// Props
defineProps({
  user: {
    type: Object,
    required: true,
    validator: (user) => {
      return user.name && user.email && user.imageUrl;
    },
  },
  navigation: {
    type: Array,
    required: true,
  },
  userNavigation: {
    type: Array,
    required: true,
  },
  logo: {
    type: Object,
    default: () => ({
      src: "https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500",
      alt: "Company Logo",
    }),
  },
  pageTitle: {
    type: String,
    required: true,
  },
  pageSubtitle: {
    type: String,
    default: null,
  },
});

// Events
defineEmits(["navigate", "user-menu-click", "notification-click"]);
</script>
