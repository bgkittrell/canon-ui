<script setup lang="ts">
import DefaultLayout from '../layouts/DefaultLayout.vue'
import SourceMaterialCard from '@/components/Dashboard/SourceMaterialCard.vue'
</script>

<template>
  <DefaultLayout>
    <div class="flex flex-col">
      <h1 class="text-4xl font-bold mb-5.5 dark:text-white">Welcome to the Dashboard</h1>
      <div class="grid grid-cols-2 gap-5">
        <SourceMaterialCard />
      </div>
    </div>
  </DefaultLayout>
</template>
