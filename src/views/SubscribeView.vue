<script setup lang="ts">
import LoaderFull from '@/components/Common/LoaderFull.vue'
import { onMounted, ref } from 'vue'
import { useBillingStore } from '@/stores/billing'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
const billingStore = useBillingStore()
const authStore = useAuthStore()
const toast = useToast()

const hasSubscription = ref(false)

const pricingTableId = import.meta.env.VITE_STRIPE_PRICING_TABLE_ID
const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

const userId = ref()
onMounted(async () => {
  let stripeScript = document.createElement('script')
  stripeScript.setAttribute('src', 'https://js.stripe.com/v3/pricing-table.js')
  document.head.appendChild(stripeScript)
  if (authStore.user?.sub && authStore.isLoaded) {
    userId.value = btoa(authStore.user.sub).replace(/=/g, '')
  }
  try {
    const subscription = await billingStore.fetchSubscription()
    hasSubscription.value = !!subscription && subscription.status === 'ACTIVE'
    console.log(subscription)
  } catch (error) {
    toast.error('An error occurred. Please try again.')
    console.error(error)
  }
})
</script>

<template>
  <div class="mt-10 sm:mt-20 mb-10 sm:mb-20 text-center">
    <div v-if="hasSubscription">
      <h1 class="text-center mb-20 w-full">You Already Have a Subscription</h1>
      <div>If you believe this is an error, please contact support.</div>
      <div class="mt-5">
        <a href="/" class="text-primary">Back Home</a>
      </div>
    </div>
    <div v-else>
      <h1 class="text-center mb-20 w-full">Choose a Plan</h1>
      <div v-if="userId">
        <stripe-pricing-table
          :pricing-table-id="pricingTableId"
          :publishable-key="publishableKey"
          :client-reference-id="userId"
          :customer-email="authStore.user?.email"
        >
        </stripe-pricing-table>
        <div class="mt-5 text-cente">
          <a href="/signout" class="text-primary">[sign out]</a>
        </div>
      </div>
      <div v-else>
        <LoaderFull />
      </div>
    </div>
  </div>
</template>

<style>
body {
  background-color: #fff !important;
}
</style>
