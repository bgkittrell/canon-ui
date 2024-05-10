<script setup lang="ts">
import { ArrowPathIcon } from '@heroicons/vue/24/solid'
// get `loading` prop
const { loading, title } = defineProps(['loading', 'title'])
</script>
<template>
  <button
    class="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90 disabled:cursor-not-allowed disabled:bg-opacity-50"
    type="submit"
    :disabled="loading"
  >
    <span v-if="loading">
      <ArrowPathIcon class="inline w-6 h-6 animate-spin" />
      Loading...
    </span>
    <span v-else>{{ title }}</span>
  </button>
</template>
