<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { useToast } from 'vue-toastification'
import { onMounted } from 'vue'
import LoaderFull from '@/components/Common/LoaderFull.vue'
import router from '@/router'

const toast = useToast()
const { loginWithRedirect } = useAuth0()

onMounted(() => {
  try {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup'
      },
      appState: {
        target: '/subscribe'
      }
    })
  } catch (error) {
    router.push('/')
    toast.error('An error occurred. Please try again.')
    console.error(error)
  }
})
</script>

<template>
  <LoaderFull />
</template>

<style>
body {
  background-color: #fff !important;
}
</style>
