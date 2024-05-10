<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: false
  }
})
</script>

<template>
  <div
    class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
  >
    <div v-if="title" class="py-6 px-4 md:px-6 xl:px-7.5">
      <h4 class="text-xl font-bold text-black dark:text-white">{{ title }}</h4>
    </div>

    <slot />
  </div>
</template>
