<script setup lang="ts">
import DefaultCard from '@/components/Forms/DefaultCard.vue'
import { useFilesStore } from '@/stores/files'
import { useToast } from 'vue-toastification'
import { computed, onMounted, ref } from 'vue'
import { ArrowPathIcon, ClipboardIcon, PaperClipIcon } from '@heroicons/vue/24/solid'
import type { File } from '@/interfaces'
import ButtonLink from '../Forms/ButtonLink.vue'

const fileStore = useFilesStore()
const toast = useToast()
const isLoading = ref(true)

const handleCopyUrl = async (file: File) => {
  const url = fileStore.getFileUrl(file)
  navigator.clipboard.writeText(url)
  toast.success('File URL copied to clipboard')
}

const latestFiles = computed(() => fileStore.files.slice(0, 5))

onMounted(async () => {
  try {
    await fileStore.fetchFiles()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="col-span-2 sm:col-span-1">
    <DefaultCard cardTitle="Source Material">
      <div class="p-7">
        <div v-if="isLoading">
          <ArrowPathIcon class="mx-auto h-6 w-6 animate-spin" />
        </div>
        <div
          v-else-if="latestFiles.length > 0"
          class="divide-y-1 divide-stroke dark:divide-strokedark"
        >
          <div v-for="file in latestFiles" :key="file.key" class="py-2">
            <p class="flex text-md items-center justify-between">
              <span class="mr-3 truncate text-ellipsis">{{ file.file_name }}</span>
              <span class="flex space-x-1">
                <a
                  :href="fileStore.getFileUrl(file)"
                  target="_blank"
                  class="cursor-pointer mr-1"
                  title="View File"
                >
                  <PaperClipIcon class="h-5 w-5" />
                </a>
                <a @click="handleCopyUrl(file)" class="cursor-pointer mr-1" title="Copy URL">
                  <ClipboardIcon class="h-5 w-5" /> </a
              ></span>
            </p>
          </div>
        </div>
        <div v-else>
          <p class="text-center">No files found</p>
        </div>
        <div class="flex justify-end mt-5">
          <ButtonLink to="/source-material">View All Files</ButtonLink>
        </div>
      </div>
    </DefaultCard>
  </div>
</template>
