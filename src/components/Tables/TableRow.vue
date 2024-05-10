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
  <div
    :class="
      'grid border-t border-stroke py-4 px-4.5 dark:border-strokedark md:px-4 gap-2 grid-cols-' +
      span
    "
  >
    <slot />
  </div>
</template>
