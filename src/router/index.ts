import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from '@auth0/auth0-vue'
import { useAuth0 } from '@auth0/auth0-vue'
import billingCheck from './guards/billingCheck'

import adminRoutes from './admin'

import SignupView from '@/views/SignupView.vue'
import SettingsView from '@/views/SettingsView.vue'
import SubscribeView from '@/views/SubscribeView.vue'
import OnboardingView from '@/views/OnboardingView.vue'
import BillingView from '@/views/BillingView.vue'
import SourceMaterialView from '@/views/SourceMaterialView.vue'
import AssistantView from '@/views/AssistantView.vue'
import HomeView from '@/views/HomeView.vue'
import FeedsView from '@/views/Feeds/FeedsView.vue'
import FeedFormView from '@/views/Feeds/FeedFormView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      meta: {
        title: 'Settings'
      },
      beforeEnter: authGuard // billingCheck
    },
    {
      path: '/billing',
      name: 'billing',
      component: BillingView,
      meta: {
        title: 'Billing'
      },
      beforeEnter: authGuard
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: OnboardingView,
      meta: {
        title: 'Onboarding'
      },
      beforeEnter: authGuard
    },
    {
      path: '/subscribe',
      name: 'subscribe',
      component: SubscribeView,
      meta: {
        title: 'Subscribe'
      },
      beforeEnter: authGuard
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
      meta: {
        title: 'Signup'
      }
    },
    {
      path: '/signout',
      name: 'signout',
      component: {
        template: '<div>Signing out...</div>'
      },
      beforeEnter: async () => {
        const auth0 = useAuth0()
        await auth0.logout({ logoutParams: { returnTo: import.meta.env.VITE_BASE_URL } })
        return false
      }
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: authGuard // billingCheck
    },
    {
      path: '/source-material',
      name: 'source-material',
      component: SourceMaterialView,
      beforeEnter: authGuard // billingCheck
    },
    {
      path: '/assistant',
      name: 'assistant',
      component: AssistantView,
      beforeEnter: authGuard // billingCheck
    },
    {
      path: '/feeds',
      name: 'feeds',
      component: FeedsView,
      beforeEnter: authGuard
    },
    {
      path: '/feeds/new',
      name: 'new-feed',
      component: FeedFormView,
      beforeEnter: authGuard
    },
    ...adminRoutes
  ]
})

export default router
