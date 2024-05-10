import { authGuard } from '@auth0/auth0-vue'
import { useBillingStore } from '@/stores/billing'
import { useErrorStore } from '@/stores/errors'
export default async (to: any, from: any, next: any) => {
  const errors = useErrorStore()
  const billingStore = useBillingStore()
  try {
    await authGuard(to)
    const subscription = await billingStore.fetchSubscription()
    if (!subscription) {
      next('subscribe')
    } else if (subscription.status === 'CANCELED') {
      next('subscribe')
    }
  } catch (error) {
    errors.handle(error)
  }
  next()
}
