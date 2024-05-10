<script setup lang="ts">
defineProps({
  span: {
    type: String,
    default: '1',
    required: false
  }
})
</script>
<template>
  <div :class="'flex overflow-hidden relative items-center col-span-' + span">
    <p class="w-full text-sm font-medium text-black dark:text-white flex items-center">
      <slot></slot>
    </p>
  </div>
</template>
