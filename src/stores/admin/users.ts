import { defineStore } from 'pinia'
import axios from 'axios'

import { useAuthStore } from '@/stores/auth'
import { computed, ref, type Ref } from 'vue'
import type { User } from '@/interfaces'

export const useAdminUsersStore = defineStore('admin-users', () => {
  const authStore = useAuthStore()
  const users: Ref<User[]> = ref([])
  const page = ref(0)
  const limit = ref(10)
  const total = ref(Infinity)
  const fullyLoaded = computed(() => users.value.length >= total.value)
  const query = ref('')
  const isLoadng = ref(false)

  const searchUsers = async (q: string) => {
    page.value = 0
    users.value = []
    total.value = Infinity
    query.value = q
    await fetchUsers()
  }

  const fetchUsers = async () => {
    if (!authStore.user || fullyLoaded.value || isLoadng.value) {
      return
    }
    isLoadng.value = true
    try {
      let path = `/users?per_page=${limit.value}&page=${page.value}`
      if (query.value) path += `&query=${encodeURIComponent(query.value)}`
      const response = await axios.get(`${import.meta.env.VITE_ADMIN_API_URI}/${path}`, {
        headers: await useAuthStore().getAuthHeaders()
      })
      if (response.data.users) {
        users.value.push(...(response.data.users as never[]))
        page.value++
        total.value = response.data.total
      }
      isLoadng.value = false
    } catch (error) {
      isLoadng.value = false
      throw error
    }
  }

  const getUser = async (userId: string) => {
    const response = await axios.get(
      `${import.meta.env.VITE_ADMIN_API_URI}/users/${btoa(userId)}`,
      {
        headers: await useAuthStore().getAuthHeaders()
      }
    )
    return response.data as User
  }

  return { users, fullyLoaded, query, fetchUsers, getUser, searchUsers }
})
