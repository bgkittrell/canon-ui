import { defineStore } from 'pinia'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { ref } from 'vue'
import { useAuthStore } from './auth'
import { fi } from 'date-fns/locale'

export const useAssetStore = defineStore('asset', () => {
  const authStore = useAuthStore()
  const isUploading = ref(false)
  const progress = ref(0)
  const status = ref('Authorizing secure upload...')
  const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const acceptedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/aac']

  const getImageUrl = (path: string) => {
    const params = {
      bucket: import.meta.env.VITE_FILES_BUCKET,
      key: path,
      edits: {
        resize: {
          width: 100,
          height: 100,
          fit: 'cover'
        }
      }
    }
    const jsonParams = JSON.stringify(params)
    const encodedParams = window.btoa(jsonParams)
    return import.meta.env.VITE_CLOUD_FRONT_URI + encodedParams
  }

  const decodeUrl = (url: string) => {
    const encodedParams = url.split('/').pop()
    if (!encodedParams) {
      return null
    }
    const jsonParams = window.atob(encodedParams)
    return JSON.parse(jsonParams)
  }

  const upload = async (file: any) => {
    isUploading.value = true
    progress.value = 0
    try {
      const filename = file.name.replace(/[^a-z0-9\\.]/gi, '_').toLowerCase()
      const path = 'files/' + uuidv4() + '/' + filename
      const response = await axios.put(
        import.meta.env.VITE_FILES_API_URI + '/files/upload?filename=' + path,
        {},
        {
          headers: await authStore.getAuthHeaders()
        }
      )
      const presignedUrl = response.data.presigned_url
      status.value = 'Uploading file...'
      const config = {
        onUploadProgress: function (progressEvent: any) {
          progress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        }
      }
      await axios.put(presignedUrl, file, config)
      return path
    } finally {
      isUploading.value = false
    }
  }

  return {
    acceptedImageTypes,
    acceptedAudioTypes,
    upload,
    decodeUrl,
    getImageUrl,
    isUploading,
    progress,
    status
  }
})
