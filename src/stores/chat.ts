import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Message } from '@/interfaces'
import { useChatStream } from '@/utils/chatStream.js'
import { useAuthStore } from './auth.js'
import axios from 'axios'

export const useChatStore = defineStore('chat', () => {
  const authStore = useAuthStore()
  const isLoading = ref(false)
  const isStreaming = ref(false)
  const streamUrl = ref('')
  const messages = ref<Message[]>([
    {
      id: 1,
      text: 'Hello, how can I help you?',
      sender: 'bot',
      time: new Date()
    }
  ])

  const answer = ref('')
  const liveMessage = computed(() => {
    return {
      id: messages.value.length + 1,
      text: answer.value,
      sender: 'bot',
      time: new Date(),
      loading: isStreaming.value
    }
  })

  const initThread = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_CHAT_API_URI}/sessions`,
      {},
      {
        headers: await authStore.getAuthHeaders()
      }
    )
    return response.data.stream_url
  }

  const addMessage = async (message: Message) => {
    try {
      answer.value = ''
      isStreaming.value = true
      messages.value.push(message)
      if (!streamUrl.value) {
        const newstreamUrl = await initThread()
        streamUrl.value = newstreamUrl
      }
      const response = await fetch(streamUrl.value, {
        method: 'POST',
        body: JSON.stringify({
          message: message.text
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const stream = response.body
      if (!stream) return
      useChatStream(
        stream,
        (data: any) => {
          answer.value += data
        },
        () => {
          answer.value = ''
          isStreaming.value = true
        },
        () => {
          isStreaming.value = false
          messages.value.push({
            id: messages.value.length + 1,
            text: answer.value,
            sender: 'bot',
            time: new Date()
          })
          answer.value = ''
        }
      )
    } catch (error) {
      isStreaming.value = false
      answer.value = ''
      console.error(error)
      throw error
    }
  }
  return { messages, isLoading, isStreaming, liveMessage, addMessage }
})
