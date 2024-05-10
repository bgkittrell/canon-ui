<script setup lang="ts">
import { useBillingStore } from '@/stores/billing'
import { onMounted } from 'vue'
import LoaderFull from '@/components/Common/LoaderFull.vue'
import { useToast } from 'vue-toastification'
import router from '@/router'

onMounted(async () => {
  const toast = useToast()
  const billingStore = useBillingStore()
  try {
    const subscription = await billingStore.fetchSubscription()
    if (subscription && subscription.status === 'ACTIVE') {
      const session = await billingStore.createPortalSession()
      console.log(session)
      window.location.href = session.portalUrl
    } else {
      router.push('/')
      toast.error('You are not subscribed to any plan.')
    }
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
