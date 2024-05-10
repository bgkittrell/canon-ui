<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import AudiobookList from '@/components/Admin/AudiobooksList.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useRoute } from 'vue-router'
import { useAdminUsersStore } from '@/stores/admin/users'

const route = useRoute()
const userStore = useAdminUsersStore()
const userId = route.params.userId
const pageTitle = ref('Audiobooks')
const user = ref()

onMounted(async () => {
  user.value = await userStore.getUser(userId as string)
  console.log(user)
  if (user.value) {
    pageTitle.value = `Audiobooks for ${user.value.name}`
  }
})
</script>

<template>
  <DefaultLayout>
    <div class="mx-auto max-w-270">
      <!-- Breadcrumb Start -->
      <BreadcrumbDefault :pageTitle="pageTitle" />
      <!-- Breadcrumb End -->
      <AudiobookList :user="user" v-if="user" />
    </div>
  </DefaultLayout>
</template>
