<script setup lang="ts">
import { defineProps } from 'vue'
const { body, title, link } = defineProps<{
  title: string
  body?: string
  link?: string
}>()
</script>
<template>
  {{ title }}
</template>
