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
  <div :class="'flex items-center col-span-' + span">
    <p class="font-medium"><slot /></p>
  </div>
</template>
