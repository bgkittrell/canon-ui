<script setup lang="ts">
import router from '@/router'
import { ArrowPathIcon } from '@heroicons/vue/24/solid'
// get `loading` prop
const { loading, to } = defineProps<{ loading?: boolean; to?: string }>()
const handleClick = () => {
  if (to) {
    router.push(to)
  }
}
</script>
<template>
  <button
    class="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
    type="button"
    :disabled="loading"
    @click="handleClick"
  >
    <span v-if="loading">
      <ArrowPathIcon class="inline w-6 h-6 animate-spin" />
      Loading...
    </span>
    <span v-else><slot /></span>
  </button>
</template>
