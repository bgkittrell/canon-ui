<script setup lang="ts">
defineProps({
  picture: String,
  span: {
    type: String,
    default: '1',
    required: false
  }
})
</script>

<template>
  <div :class="'flex flex-col gap-4 sm:flex-row sm:items-center col-span-' + span">
    <div class="h-12.5 w-15 rounded-md">
      <img :src="picture" />
    </div>
    <p class="text-sm font-medium text-black dark:text-white"><slot /></p>
  </div>
</template>
