<script setup lang="ts">
import { defineProps, ref } from 'vue'
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/vue/24/solid'
const { id, value, onSave } = defineProps({
  id: String,
  value: String,
  onSave: {
    type: Function,
    required: true
  }
})

const handleSave = () => {
  if (!valueRef.value) return
  onSave(id, valueRef.value)
  isEditing.value = false
}

const handleCancel = () => {
  isEditing.value = false
  valueRef.value = value
}

const handleEdit = () => {
  isEditing.value = true
  setTimeout(() => {
    if (!input.value) return
    input.value.select()
  }, 0)
}

const onInput = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleSave()
  }
}

const valueRef = ref(value)
const input = ref<HTMLInputElement | null>(null)

const isEditing = ref(false)
</script>
<template>
  <div class="group w-full h-full whitespace-nowrap overflow-hidden">
    <div
      class="flex flex-cols absolute top-0 bottom-0 right-0 bg-white dark:bg-boxdark px-2"
      v-if="isEditing"
    >
      <button @click="handleSave">
        <CheckIcon class="w-5 h-5" />
      </button>
      <button @click="handleCancel">
        <XMarkIcon class="w-5 h-5" />
      </button>
    </div>
    <button
      class="hidden group-hover:block absolute top-0 bottom-0 right-0 bg-white dark:bg-boxdark px-2"
      @click="handleEdit"
      v-if="!isEditing"
    >
      <PencilIcon class="w-5 h-5" />
    </button>
    <span v-if="!isEditing">
      {{ valueRef }}
    </span>
    <span v-else>
      <input
        type="text"
        class="w-full pr-15 border-none dark:bg-boxdark"
        v-model="valueRef"
        ref="input"
        @keydown="onInput"
      />
    </span>
  </div>
</template>
