import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Revision } from '@/interfaces'
import { parseISO } from 'date-fns'

export const useAdminRevisionsStore = (audiobookId: string) =>
  defineStore(`admin-revisions/${audiobookId}`, () => {
    const revisions = ref<Revision[]>([])
    const authStore = useAuthStore()
    const pollTimer = ref<ReturnType<typeof setTimeout>>()

    const fetchRevisions = async (userId: string, audiobookId: string) => {
      const response = await axios.get(
        `${import.meta.env.VITE_AUDIOBOOKS_API_URI}/admin/${btoa(userId)}/audiobooks/${audiobookId}/revisions`,
        {
          headers: await authStore.getAuthHeaders()
        }
      )
      const sorted = sort(response.data)
      revisions.value = sorted
    }

    const createRevision = async (userId: string, audiobookId: string, revision: Revision) => {
      await axios.post(
        `${import.meta.env.VITE_AUDIOBOOKS_API_URI}/admin/${btoa(userId)}/audiobooks/${audiobookId}/revisions`,
        revision,
        {
          headers: await authStore.getAuthHeaders()
        }
      )
      await fetchRevisions(userId, audiobookId)
    }

    const sort = (revisions: Revision[]) => {
      return revisions.sort(
        (a, b) => parseISO(a.created_at || '').getTime() - parseISO(b.created_at || '').getTime()
      )
    }

    const startPolling = async (userId: string, audiobookId: string) => {
      const poll = async () => {
        console.log('polling revisions...')
        await fetchRevisions(userId, audiobookId)
        pollTimer.value = setTimeout(poll, 5000)
      }

      poll()
    }

    const stopPolling = () => {
      if (pollTimer.value) clearTimeout(pollTimer.value)
    }

    return { revisions, fetchRevisions, createRevision, startPolling, stopPolling }
  })()
