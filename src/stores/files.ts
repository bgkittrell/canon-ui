import { defineStore } from 'pinia'
import axios from 'axios'

import { useAuthStore } from '@/stores/auth'
import { ref, type Ref } from 'vue'
import type { File } from '@/interfaces'

export const useFilesStore = defineStore('files', () => {
  const authStore = useAuthStore()
  const files: Ref<File[]> = ref([])
  const pollTimer = ref()
  const acceptedTypes = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/html',
    'application/json',
    'text/markdown',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/css',
    'text/javascript',
    'application/x-sh',
    'application/typescript'
  ]

  const fetchFiles = async () => {
    const response = await axios.get(`${import.meta.env.VITE_FILES_API_URI}/files`, {
      headers: await authStore.getAuthHeaders()
    })
    files.value = response.data
  }

  const updateFile = async (id: string, file: any) => {
    await axios.put(`${import.meta.env.VITE_FILES_API_URI}/files/${id}`, file, {
      headers: await authStore.getAuthHeaders()
    })
    fetchFiles()
  }

  const createFile = async (file: any) => {
    file.created_at = new Date().toISOString()
    const response = await axios.post(`${import.meta.env.VITE_FILES_API_URI}/files`, file, {
      headers: await authStore.getAuthHeaders()
    })
    console.log(response.data)
    if (response.data) {
      const newFile = response.data
      console.log(newFile)
      files.value.push(newFile)
    }
  }

  const deleteFile = async (file: File) => {
    await axios.delete(`${import.meta.env.VITE_FILES_API_URI}/files/${file.id}`, {
      headers: await authStore.getAuthHeaders()
    })
    const index = files.value.findIndex((f) => f.id === file.id)
    files.value.splice(index, 1)
  }

  const getUrlFromKey = (key: string) => {
    return import.meta.env.VITE_S3_BUCKET_URI + key
  }

  const getFileUrl = (file: File) => {
    return import.meta.env.VITE_S3_BUCKET_URI + file.key
  }

  const getTranscriptUrl = (file: File) => {
    return import.meta.env.VITE_S3_BUCKET_URI + file.transcript_key
  }

  const startPolling = async () => {
    const poll = async () => {
      console.log('polling')
      if (files.value.find((f) => !f.is_ready)) {
        await fetchFiles()
      }
      pollTimer.value = setTimeout(poll, 5000)
    }

    poll()
  }

  const stopPolling = () => {
    clearTimeout(pollTimer.value)
  }

  return {
    acceptedTypes,
    files,
    fetchFiles,
    createFile,
    updateFile,
    deleteFile,
    getFileUrl,
    getTranscriptUrl,
    getUrlFromKey,
    startPolling,
    stopPolling
  }
})
