import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'

export const useErrorStore = defineStore('error', () => {
  const toast = useToast()
  const handle = async (error: any) => {
    let message = error.message
    if (error?.response?.status === 400) {
      message = error?.response?.data
    }
    toast.error(message)
    console.error(error)
  }

  return { handle }
})
