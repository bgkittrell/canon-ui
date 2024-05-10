import AdminUsersView from '@/views/Admin/UsersView.vue'
import { authGuard } from '@auth0/auth0-vue'
export default [
  {
    path: '/admin/users',
    name: 'admin-users',
    component: AdminUsersView,
    beforeEnter: authGuard
  }
]
