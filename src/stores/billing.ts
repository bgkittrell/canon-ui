import { defineStore } from 'pinia'
import axios from 'axios'

import { useAuthStore } from './auth'
import { ref } from 'vue'
import type { Subscription } from '@/interfaces'

export const useBillingStore = defineStore('billing', () => {
  const authStore = useAuthStore()
  const currentSubscription = ref<Subscription | null>(null)

  const createPortalSession = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_BILLING_API_URI}/portal/session`,
      {
        redirect_url: import.meta.env.VITE_BASE_URL
      },
      {
        headers: await authStore.getAuthHeaders()
      }
    )
    return response.data
  }

  const fetchSubscription = async (): Promise<Subscription | null> => {
    try {
      if (currentSubscription.value) return currentSubscription.value
      const response = await axios.get(`${import.meta.env.VITE_BILLING_API_URI}/subscription`, {
        headers: await authStore.getAuthHeaders()
      })
      currentSubscription.value = response.data.subscription
      return currentSubscription.value
    } catch (error: any) {
      if (error.response?.status === 404) return null
      throw error
    }
  }

  return { fetchSubscription, createPortalSession }
})
