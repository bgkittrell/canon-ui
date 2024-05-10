<script setup lang="ts">
import { ref } from 'vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import AdminUsersList from '@/components/Admin/UsersList.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const pageTitle = ref('Users')
</script>

<template>
  <DefaultLayout>
    <div class="mx-auto max-w-270">
      <!-- Breadcrumb Start -->
      <BreadcrumbDefault :pageTitle="pageTitle" />
      <!-- Breadcrumb End -->
      <AdminUsersList />
    </div>
  </DefaultLayout>
</template>
