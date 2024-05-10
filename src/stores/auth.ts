import { defineStore } from 'pinia'
import { useAuth0 } from '@auth0/auth0-vue'
import { useNotificationStore } from './notifications'
import axios from 'axios'
import { ref, computed } from 'vue'
import type { User } from '@/interfaces'

export const useAuthStore = defineStore('auth', () => {
  const auth0 = useAuth0()
  const notificationStore = useNotificationStore()
  const isSaving = ref(false)
  const isLoaded = ref(false)
  const user = computed(() => {
    console.log('User computed')
    if (!isLoaded.value) {
      console.log('User not loaded')
      if (!auth0.isLoading.value && auth0.isAuthenticated.value) {
        console.log('Loading user')
        notificationStore.openSocket(auth0.user.value)
        profile.value = getProfile(auth0.user.value, auth0.idTokenClaims.value)
        isLoaded.value = true
      }
    }
    return auth0.user.value
  })
  const idTokenClaims = auth0.idTokenClaims
  const profile = ref({
    name: '',
    email: '',
    picture: '',
    isSubscribed: false,
    isOnboarded: false,
    isDatabase: false,
    identityProvider: '',
    isAdmin: false,
    openAIAssistantId: ''
  })
  // Used for the settings page
  const metadata = ref({
    bio: '',
    writing_style: ''
  })

  const getIdentityProvider = (sub: string | undefined) => {
    if (!sub) {
      return 'Unknown'
    }
    if (sub.includes('auth0')) {
      return 'auth0'
    }
    if (sub.includes('google')) {
      return 'Google'
    }
    if (sub.includes('apple')) {
      return 'Apple'
    }
    if (sub.includes('facebook')) {
      return 'Facebook'
    }
    if (sub.includes('twitter')) {
      return 'Twitter'
    }
    if (sub.includes('linkedin')) {
      return 'LinkedIn'
    }
    return 'Unknown'
  }

  const getProfile = (user: any, idTokenClaims: any) => {
    console.log('Getting profile')
    console.log('Clams: ', idTokenClaims)
    const newProfile = {
      name: '',
      email: '',
      picture: '',
      isSubscribed: false,
      isOnboarded: false,
      isDatabase: false,
      identityProvider: '',
      openAIAssistantId: '',
      isAdmin: false
    }
    newProfile.picture = user.picture
    if (idTokenClaims && user) {
      console.log(idTokenClaims)
      if (idTokenClaims && idTokenClaims['canonical_picture']) {
        newProfile.picture = idTokenClaims['canonical_picture']
      }
      if (idTokenClaims && idTokenClaims['canonical_is_subscribed']) {
        newProfile.isSubscribed = idTokenClaims['canonical_is_subscribed']
      }
      if (idTokenClaims && idTokenClaims['canonical_is_onboarded']) {
        newProfile.isOnboarded = idTokenClaims['canonical_is_onboarded']
      }
      if (
        idTokenClaims &&
        idTokenClaims['canonical_roles'] &&
        idTokenClaims['canonical_roles'].includes('Admin')
      ) {
        newProfile.isAdmin = true
      }
      newProfile.name = user.name
      newProfile.email = user.email
      newProfile.isDatabase = user.sub.includes('auth0') || false
      newProfile.identityProvider = getIdentityProvider(user.sub)
      newProfile.openAIAssistantId = idTokenClaims['canonical_openai_assistant_id']
      console.log(newProfile)
    }
    return newProfile
  }

  const login = () => {
    auth0.loginWithRedirect()
  }

  const logout = (params: object) => {
    auth0.logout(params)
  }

  const getAuthHeaders = async () => {
    const token = await auth0.getAccessTokenSilently()
    return {
      Authorization: 'Bearer ' + token
    }
  }

  const updateMetadata = async (metadata: any) => {
    isSaving.value = true
    try {
      if (!user.value) {
        return
      }
      const data = {
        userMetadata: metadata
      }
      const config = {
        headers: await getAuthHeaders()
      }
      const auth0UserUrl = `${import.meta.env.VITE_PROFILES_API_URI}/profiles`
      await axios.put(auth0UserUrl, data, config)
      profile.value = { ...profile.value, ...metadata }
      if (!metadata.picture) {
        profile.value.picture = user.value.picture || ''
      }
      isSaving.value = false
    } catch (error) {
      isSaving.value = false
      throw error
    }
  }

  const fetchMetadata = async () => {
    if (!auth0.isAuthenticated.value) {
      return
    }
    const config = {
      headers: await getAuthHeaders()
    }
    const profileUrl = `${import.meta.env.VITE_PROFILES_API_URI}/profile`
    const response = await axios.get(profileUrl, config)
    console.log('Response: ', response.data.user_metadata)
    metadata.value = response.data.user_metadata
  }

  const typedUser = computed(() => {
    const typedUser: User = {
      user_id: user.value?.sub || '',
      name: user.value?.name || '',
      email: user.value?.email || '',
      role: user.value?.role || '',
      picture: user.value?.picture || '',
      user_metadata: user.value?.user_metadata || {}
    }
    return typedUser
  })

  return {
    login,
    logout,
    user,
    typedUser,
    profile,
    metadata,
    isLoaded,
    isSaving,
    idTokenClaims,
    fetchMetadata,
    updateMetadata,
    getAuthHeaders
  }
})
