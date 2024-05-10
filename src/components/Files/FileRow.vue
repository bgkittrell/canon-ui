<script setup lang="ts">
import { ref } from 'vue'
import { useFilesStore } from '@/stores/files'
import { useToast } from 'vue-toastification'
import type { File } from '@/interfaces'
import { format } from 'date-fns'
import { PaperClipIcon, TrashIcon, ClipboardIcon, DocumentTextIcon } from '@heroicons/vue/24/solid'
import { TableColumn, TableRow } from '@/components/Tables'
import EditableText from '@/components/Forms/EditableText.vue'
import DeleteModal from '../Modals/DeleteModal.vue'
const showDeleteModal = ref(false)

const fileStore = useFilesStore()
const toast = useToast()

const handleDelete = async () => {
  await fileStore.deleteFile(file)
  toast.success('File deleted')
}

const handleCopyUrl = async () => {
  const url = fileStore.getFileUrl(file)
  navigator.clipboard.writeText(url)
  toast.success('File URL copied to clipboard')
}

const handleUpdateFileName = async (id: string, file_name: string) => {
  await fileStore.updateFile(id, {
    file_name
  })
  toast.success('File name updated')
}
const { file } = defineProps<{
  file: File
}>()
</script>

<template>
  <TableRow span="5" :key="file.id">
    <TableColumn span="3">
      <span class="rounded-full bg-red w-2 h-2 inline-block mr-2" v-if="file.error"></span>
      <span
        class="rounded-full bg-green-400 w-2 h-2 inline-block mr-2"
        v-else-if="file.is_ready"
      ></span>
      <span class="rounded-full bg-orange-400 w-2 h-2 inline-block mr-2" v-else></span>
      <EditableText @save="handleUpdateFileName" :value="file.file_name" :id="file.id" />
    </TableColumn>
    <TableColumn span="1">{{ format(file.created_at, 'MMMM dd, yyyy') }}</TableColumn>
    <TableColumn span="1">
      <a
        :href="fileStore.getFileUrl(file)"
        target="_blank"
        class="cursor-pointer mr-1"
        title="View File"
      >
        <PaperClipIcon class="h-5 w-5" />
      </a>
      <a @click="showDeleteModal = true" class="cursor-pointer mr-1" title="Delete File">
        <TrashIcon class="h-5 w-5" />
      </a>
      <a @click="handleCopyUrl" class="cursor-pointer mr-1" title="Copy URL">
        <ClipboardIcon class="h-5 w-5" />
      </a>
      <a
        :href="fileStore.getTranscriptUrl(file)"
        target="_blank"
        class="cursor-pointer mr-1"
        title="View Transcript"
        v-if="file.transcript_key"
      >
        <DocumentTextIcon class="h-5 w-5" />
      </a>
    </TableColumn>
  </TableRow>
  <DeleteModal
    v-if="showDeleteModal"
    title="Delete Audiobook"
    message="Are you sure you want to delete this audiobook?"
    @confirm="handleDelete"
    @close="showDeleteModal = false"
  />
</template>
