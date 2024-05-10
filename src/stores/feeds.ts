import { defineStore } from 'pinia'
import axios from 'axios'

import { useAuthStore } from '@/stores/auth'
import { ref, type Ref } from 'vue'
import type { Feed } from '@/interfaces'

export const useFeedsStore = defineStore('feeds', () => {
  const authStore = useAuthStore()
  const feeds: Ref<Feed[]> = ref([])

  const fetchFeeds = async () => {
    const response = await axios.get(`${import.meta.env.VITE_PODCAST_API_URI}/feeds`, {
      headers: await authStore.getAuthHeaders()
    })
    feeds.value = response.data
  }

  const updateFeed = async (id: string, file: any) => {
    await axios.put(`${import.meta.env.VITE_PODCAST_API_URI}/feeds/${id}`, file, {
      headers: await authStore.getAuthHeaders()
    })
    fetchFeeds()
  }

  const createFeed = async (file: any) => {
    file.created_at = new Date().toISOString()
    const response = await axios.post(`${import.meta.env.VITE_PODCAST_API_URI}/feeds`, file, {
      headers: await authStore.getAuthHeaders()
    })
    console.log(response.data)
    if (response.data) {
      const newFeed = response.data
      console.log(newFeed)
      feeds.value.push(newFeed)
    }
  }

  const deleteFeed = async (file: Feed) => {
    await axios.delete(`${import.meta.env.VITE_PODCAST_API_URI}/feeds/${file.id}`, {
      headers: await authStore.getAuthHeaders()
    })
    const index = feeds.value.findIndex((f) => f.id === file.id)
    feeds.value.splice(index, 1)
  }

  return {
    feeds,
    fetchFeeds,
    createFeed,
    updateFeed,
    deleteFeed
  }
})
