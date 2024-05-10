<script setup lang="ts">
import type { Component } from 'vue'

const { disabled, icon, label, id, type } = defineProps({
  disabled: Boolean,
  icon: Object,
  label: String,
  id: String,
  type: {
    type: String,
    required: false,
    default: 'text'
  }
})
const value = defineModel()
</script>

<template>
  <label class="mb-3 block text-sm font-medium text-black dark:text-white" :for="id">{{
    label
  }}</label>
  <div class="relative">
    <span class="absolute left-4.5 top-4">
      <Component :is="icon" class="w-5 h-5" />
    </span>
    <input
      v-model="value"
      class="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:text-white dark:focus:border-primary"
      :type="type"
      :name="id"
      :id="id"
      :disabled="disabled"
    />
  </div>
</template>
