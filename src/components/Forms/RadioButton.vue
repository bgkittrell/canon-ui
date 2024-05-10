<script setup lang="ts">
const { label, id, name, required, value } = defineProps({
  label: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  required: {
    type: Boolean,
    default: false
  },
  value: {
    type: String,
    default: '',
    required: false
  }
})
const checkboxId = 'checkbox-' + id
const model = defineModel()
</script>

<template>
  <div class="flex items-center mb-4">
    <input
      :id="checkboxId"
      type="radio"
      :value="value || id"
      :name="name"
      v-model="model"
      :required="required"
      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
    />
    <label :for="checkboxId" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{
      label
    }}</label>
  </div>
</template>
