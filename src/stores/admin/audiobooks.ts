import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Audiobook } from '@/interfaces'

export const useAdminAudiobooksStore = defineStore('admin-audiobooks', () => {
  const audiobooks = ref<Audiobook[]>([])
  const authStore = useAuthStore()

  const fetchAudiobooks = async (userId: string) => {
    const response = await axios.get(
      `${import.meta.env.VITE_AUDIOBOOKS_API_URI}/admin/${btoa(userId)}/audiobooks`,
      {
        headers: await authStore.getAuthHeaders()
      }
    )
    audiobooks.value = response.data
  }

  const updateAudiobook = async (userId: string, audiobook: Audiobook) => {
    await axios.put(
      `${import.meta.env.VITE_AUDIOBOOKS_API_URI}/admin/${btoa(userId)}/audiobooks/${audiobook.id}`,
      audiobook,
      {
        headers: await authStore.getAuthHeaders()
      }
    )
  }

  return { audiobooks, fetchAudiobooks, updateAudiobook }
})
