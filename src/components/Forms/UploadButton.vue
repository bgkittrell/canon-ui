<script setup lang="ts">
import { useAssetStore } from '@/stores/assets'
import { useErrorStore } from '@/stores/errors'
import { ref } from 'vue'
const assets = useAssetStore()
const errorStore = useErrorStore()
const isUploading = ref(false)

const { handleUpload, types, maxMb, typesText } = defineProps<{
  handleUpload: (key: any, name: string) => Promise<void>
  types: string[]
  maxMb: number
  typesText: string
}>()
const handleFileChange = async (event: any) => {
  if (!validateUpload(event.target.files[0])) return
  isUploading.value = true
  try {
    const newPhotoKey = await assets.upload(event.target.files[0])
    handleUpload(newPhotoKey, event.target.files[0].name)
    event.target.value = null
  } catch (error: any) {
    errorStore.handle(error)
  } finally {
    isUploading.value = false
  }
}
const errors = ref<Object[]>([{ key: '', message: '' }])
const validateUpload = (file: any) => {
  errors.value = []
  console.log(file)
  console.log(types)
  if (!types.includes(file.type))
    errors.value.push({ key: 'file', message: `File must be one of these types: ${typesText}` })
  if (file.size > maxMb * 1024 * 1024)
    errors.value.push({ key: 'file', message: `File must be less than ${maxMb}MB` })
  return errors.value.length === 0
}
const getError = (key: string): any => errors.value.find((error: any) => error.key === key)
</script>

<template>
  <div
    id="FileUpload"
    class="relative block w-full cursor-pointer appearance-none"
    v-if="!isUploading"
  >
    <input
      type="file"
      class="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
      @change="handleFileChange"
    />
    <div>
      <button class="form-button" type="button"><slot /></button>
    </div>
    <div v-if="getError('file')" class="form-error">
      {{ getError('file').message }}
    </div>
  </div>
  <div class="relative mb-5.5 block w-full" v-else>
    <div class="mb-1.5 font-medium text-black dark:text-white">
      {{ assets.status }} <span v-if="assets.progress != 0">{{ assets.progress }}%</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: assets.progress + '%' }"></div>
    </div>
  </div>
</template>
