<script setup lang="ts">
import { useFilesStore } from '@/stores/files'
import { useErrorStore } from '@/stores/errors'
import UploadBox from '@/components/Forms/UploadBox.vue'
import { Table, TableHeader, TableHeaderColumn } from '@/components/Tables'
import { onMounted, onUnmounted } from 'vue'
import FileRow from './FileRow.vue'

const fileStore = useFilesStore()
const errorStore = useErrorStore()

const handleUpload = async (key: string, file_name: string) => {
  try {
    fileStore.createFile({
      file_name,
      key
    })
  } catch (error) {
    errorStore.handle(error)
  }
}

onMounted(() => {
  fileStore.fetchFiles()
  fileStore.startPolling()
})

onUnmounted(() => {
  fileStore.stopPolling()
})
</script>

<template>
  <div class="grid grid-cols-5 gap-8">
    <!-- Personal Information Section -->
    <div class="col-span-5 xl:col-span-3">
      <Table>
        <TableHeader span="5">
          <TableHeaderColumn span="3">File</TableHeaderColumn>
          <TableHeaderColumn span="1">Uploaded</TableHeaderColumn>
          <TableHeaderColumn span="1">Actions</TableHeaderColumn>
        </TableHeader>
        <div v-if="fileStore.files">
          <FileRow v-for="file in fileStore.files" :key="file.id" :file="file" />
        </div>
      </Table>
    </div>
    <div class="col-span-5 xl:col-span-2">
      <!-- File Upload Section -->
      <UploadBox
        :handleUpload="handleUpload"
        :types="fileStore.acceptedTypes"
        typesText="PDF, DOC, DOCX, PPTX, TXT"
        :maxMb="512"
      />
    </div>
  </div>
</template>
