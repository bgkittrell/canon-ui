import axios from 'axios'
import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'
import { useAuthStore } from './auth'
import { computed, ref } from 'vue'
import type { Notification } from '@/interfaces'
import NotificationToast from '@/components/Alerts/NotificationToast.vue'
import router from '@/router'

export const useNotificationStore = defineStore('notifications', () => {
  const toast = useToast()
  const authStore = useAuthStore()
  const isOpen = ref(false)

  const notifications = ref<Notification[]>([])
  const mockNotifications: Notification[] = [
    {
      id: '1',
      user_id: '1',
      read: false,
      type: 'info',
      link: '/profile',
      title: 'Welcome to Audiobook',
      body: 'Thanks for signing up!',
      created_at: '2021-06-01T12:00:00Z'
    },
    {
      id: '2',
      user_id: '1',
      read: false,
      type: 'success',
      link: '/profile',
      title: 'Your audiobook is ready',
      body: 'Your audiobook has been approved',
      created_at: '2021-06-01T12:00:00Z'
    },
    {
      id: '3',
      user_id: '1',
      read: false,
      type: 'error',
      link: '/profile',
      title: 'Your audiobook has been rejected',
      body: 'Please review the notes and resubmit',
      created_at: '2021-06-01T12:00:00Z'
    },
    {
      id: '4',
      user_id: '1',
      read: false,
      type: 'info',
      link: '/profile',
      title: 'New feature',
      body: 'We have added a new feature',
      created_at: '2021-06-01T12:00:00Z'
    },
    {
      id: '5',
      user_id: '1',
      read: false,
      type: 'info',
      link: '/profile',
      title: 'New feature',
      body: 'We have added a new feature',
      created_at: '2021-06-01T12:00:00Z'
    }
  ]
  const fetchNotifications = async () => {
    return (notifications.value = mockNotifications)
    // Load environment variables
    const { VITE_NOTIFICATION_API_URI } = import.meta.env
    const response = await axios.get(VITE_NOTIFICATION_API_URI + '/notifications', {
      headers: await authStore.getAuthHeaders()
    })
    notifications.value = response.data
  }

  const markAsRead = async (id: string) => {
    await axios.put(
      `${import.meta.env.VITE_NOTIFICATION_API_URI}/notifications/${id}`,
      {
        read: true
      },
      {
        headers: await authStore.getAuthHeaders()
      }
    )
  }

  const markAllAsRead = async () => {
    await axios.put(
      `${import.meta.env.VITE_NOTIFICATION_API_URI}/notifications`,
      {
        read: true
      },
      {
        headers: await authStore.getAuthHeaders()
      }
    )
  }

  const hasUnread = computed(() => {
    return notifications.value.some((n: Notification) => !n.read)
  })

  const openSocket = async (user: any) => {
    console.log('Opening socket')
    const userId = user?.sub
    console.log('User ID: ', userId)
    console.log('User: ', user)
    if (!userId) {
      console.log('No user')
      return
    }
    if (isOpen.value) {
      console.log('Already open')
      return
    }
    try {
      // Load environment variables
      const { VITE_NOTIFICATION_WEBSOCKET_URI } = import.meta.env
      const socket = new WebSocket(VITE_NOTIFICATION_WEBSOCKET_URI + '?userId=' + btoa(userId))
      socket.onopen = () => {
        console.log('Connected to WebSocket')
        isOpen.value = true
      }

      socket.onmessage = (event) => {
        console.log('Event: ', event)
        const message = JSON.parse(event.data)
        if (message.type === 'error') {
          toast.error(`${message.data}`)
        } else if (message.type === 'notification') {
          console.log('Received notification:', message.data)
          fetchNotifications()
          toast.success(
            {
              component: NotificationToast,
              props: {
                title: message.data.title,
                body: message.data.body
              }
            },
            {
              onClick: () => {
                console.log('Clicked')
                router.push(message.data.link)
              }
            }
          )
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  return { openSocket, fetchNotifications, markAsRead, markAllAsRead, hasUnread, notifications }
})
