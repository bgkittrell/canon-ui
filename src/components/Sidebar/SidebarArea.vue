<script setup lang="ts">
import { useSidebarStore } from '@/stores/sidebar'
import { useAuthStore } from '@/stores/auth'
import { onClickOutside } from '@vueuse/core'
import { onMounted, ref } from 'vue'

import SidebarItem from './SidebarItem.vue'
import {
  HomeIcon,
  BookOpenIcon,
  UserIcon,
  SpeakerWaveIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/vue/24/solid'

const target = ref(null)

const sidebarStore = useSidebarStore()
const authStore = useAuthStore()

onClickOutside(target, () => {
  sidebarStore.isSidebarOpen = false
})

const menuGroups = ref([
  {
    name: 'MENU',
    menuItems: [
      {
        icon: HomeIcon,
        label: 'Home',
        route: '/'
      },
      {
        icon: SpeakerWaveIcon,
        label: 'Podcasts',
        route: '/feeds'
      },
      {
        icon: BookOpenIcon,
        label: 'Source Material',
        route: '/source-material'
      },
      {
        icon: ChatBubbleLeftRightIcon,
        label: 'Assistant',
        route: '/assistant'
      }
    ]
  }
])

onMounted(() => {
  if (authStore.user && authStore.isLoaded && authStore.profile.isAdmin) {
    menuGroups.value.push({
      name: 'ADMIN',
      menuItems: [
        {
          icon: UserIcon,
          label: 'Users',
          route: '/admin/users'
        }
      ]
    })
  }
})
</script>

<template>
  <aside
    class="absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-sidebar duration-300 ease-linear dark:bg-sidebardark lg:static lg:translate-x-0"
    :class="{
      'translate-x-0': sidebarStore.isSidebarOpen,
      '-translate-x-full': !sidebarStore.isSidebarOpen
    }"
    ref="target"
  >
    <!-- SIDEBAR HEADER -->
    <div class="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
      <router-link to="/">
        <div class="flex items-center space-x-0">
          <span class="text-title-xl text-primary text-opacity-80 font-normal dark:text-white"
            >Canonical</span
          >
          <img class="w-20 h-20" src="@/assets/images/logo/icon-square.png" alt="Home" />
        </div>
      </router-link>

      <!-- <button class="block lg:hidden" @click="sidebarStore.isSidebarOpen = false">
        <svg
          class="fill-current"
          width="20"
          height="18"
          viewBox="0 0 20 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
            fill=""
          />
        </svg>
      </button> -->
    </div>
    <!-- SIDEBAR HEADER -->

    <div class="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
      <!-- Sidebar Menu -->
      <nav class="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
        <template v-for="menuGroup in menuGroups" :key="menuGroup.name">
          <div>
            <h3 class="mb-4 ml-4 text-sm font-medium">{{ menuGroup.name }}</h3>

            <ul class="mb-6 flex flex-col gap-1.5">
              <SidebarItem
                v-for="(menuItem, index) in menuGroup.menuItems"
                :item="menuItem"
                :key="index"
                :index="index"
              />
            </ul>
          </div>
        </template>
      </nav>
      <!-- Sidebar Menu -->
    </div>
  </aside>
</template>
