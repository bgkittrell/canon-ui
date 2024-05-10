<script setup lang="ts">
import { defineProps } from 'vue'

const { title } = defineProps({
  title: {
    type: String,
    required: false
  }
})
</script>
<template>
  <div
    class="mb-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
  >
    <div v-if="title" class="border-b border-stroke py-4 px-7 dark:border-strokedark">
      <h3 class="font-medium text-black dark:text-white">{{ title }}</h3>
    </div>
    <div class="p-7">
      <slot />
    </div>
  </div>
</template>
