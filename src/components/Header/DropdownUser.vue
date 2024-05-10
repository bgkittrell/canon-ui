<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'
import { ArrowLeftStartOnRectangleIcon, CogIcon, CreditCardIcon } from '@heroicons/vue/24/solid'
import { useAuthStore } from '@/stores/auth'

const target = ref(null)
const dropdownOpen = ref(false)
const auth = useAuthStore()

onClickOutside(target, () => {
  dropdownOpen.value = false
})
</script>

<template>
  <div class="relative" ref="target">
    <router-link
      class="flex items-center gap-4"
      to="#"
      @click.prevent="dropdownOpen = !dropdownOpen"
      v-if="auth.isLoaded"
    >
      <span class="hidden text-right lg:block">
        <span class="block text-sm font-medium text-black dark:text-white">{{
          auth.profile.name
        }}</span>
        <span class="block text-xs font-medium"></span>
      </span>

      <span class="h-12 w-12 rounded-full">
        <img :src="auth.profile.picture" alt="User" />
      </span>

      <svg
        :class="dropdownOpen && 'rotate-180'"
        class="hidden fill-current sm:block"
        width="12"
        height="8"
        viewBox="0 0 12 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
          fill=""
        />
      </svg>
    </router-link>
    <!-- Dropdown Start -->
    <div
      v-show="dropdownOpen"
      class="absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
    >
      <ul class="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
        <li>
          <router-link
            to="/settings"
            class="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
          >
            <CogIcon class="w-6 h-6" />
            Account Settings
          </router-link>
        </li>
        <li>
          <router-link
            to="/billing"
            class="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
          >
            <CreditCardIcon class="w-6 h-6" />
            Billing
          </router-link>
        </li>
      </ul>
      <button
        class="flex items-center gap-3.5 py-4 px-6 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
        v-if="!auth.isLoaded"
      >
        Loading
      </button>
      <router-link
        class="flex items-center gap-3.5 py-4 px-6 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
        v-if="auth.isLoaded"
        to="/signout"
      >
        <ArrowLeftStartOnRectangleIcon class="w-6 h-6" />
        Log Out
      </router-link>
    </div>
    <!-- Dropdown End -->
  </div>
</template>
