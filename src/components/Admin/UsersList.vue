<script setup lang="ts">
import {
  Table,
  TableColumn,
  TableColumnPicture,
  TableHeader,
  TableHeaderColumn,
  TableRow
} from '@/components/Tables'
import { MagnifyingGlassIcon, ArrowPathIcon, BookOpenIcon } from '@heroicons/vue/24/solid'
import { onMounted, ref, nextTick } from 'vue'
import { useAdminUsersStore } from '@/stores/admin/users'
import { RouterLink } from 'vue-router'
import debounce from '@/utils/debounce'

const userStore = useAdminUsersStore()
const isLoading = ref(false)
const isSearching = ref(false)

const searchUsers = debounce(async (e: Event) => {
  isSearching.value = true
  const target = e.target as HTMLInputElement
  console.log(target.value)
  await userStore.searchUsers(target.value)
  isSearching.value = false
  nextTick(() => {
    const masonry = document.querySelector('#scroll-container')
    if (masonry) {
      handleScroll(masonry)
    }
  })
}, 500)

const handleScroll = async (container: any) => {
  if (!isLoading.value && container.scrollTop + container.clientHeight >= container.scrollHeight) {
    console.log(container.scrollTop, container.clientHeight, container.scrollHeight)
    isLoading.value = true
    await userStore.fetchUsers()
    isLoading.value = false
  }
}

onMounted(async () => {
  isLoading.value = true
  await userStore.fetchUsers()
  isLoading.value = false

  const masonry = document.querySelector('#scroll-container')
  if (masonry) {
    masonry.addEventListener('scroll', async (e) => {
      handleScroll(masonry)
    })
    nextTick(() => {
      handleScroll(masonry)
    })
  }
})
</script>

<template>
  <Table>
    <div class="justify-between py-4 px-5">
      <div class="relative">
        <button class="absolute top-1/2 left-0 -translate-y-1/2">
          <MagnifyingGlassIcon v-if="!isSearching" class="h-6 w-6" />
          <ArrowPathIcon v-else class="inline w-6 h-6 animate-spin" />
        </button>

        <input
          type="text"
          placeholder="Type to search..."
          class="w-full xl:w-125 bg-transparent pr-4 pl-9 focus:outline-none"
          @input="searchUsers"
        />
      </div>
    </div>
    <TableHeader span="6">
      <TableHeaderColumn span="3">Name</TableHeaderColumn>
      <TableHeaderColumn span="2">Email</TableHeaderColumn>
      <TableHeaderColumn span="1">Actions</TableHeaderColumn>
    </TableHeader>
    <div v-if="userStore.users" id="infinite-list">
      <TableRow span="6" v-for="user in userStore.users" :key="user.email">
        <TableColumnPicture span="3" :picture="user.user_metadata?.picture || user.picture">{{
          user.name
        }}</TableColumnPicture>
        <TableColumn span="2">{{ user.email }}</TableColumn>
        <TableColumn span="1">
          <RouterLink
            :to="`/admin/users/${user.user_id}/audiobooks`"
            title="View Audiobooks"
            class="cursor-pointer"
          >
            <BookOpenIcon class="h-5 w-5" />
          </RouterLink>
        </TableColumn>
      </TableRow>
    </div>

    <div v-if="isLoading" class="text-center p-10">
      <ArrowPathIcon class="inline w-6 h-6 animate-spin" />
    </div>
  </Table>
</template>
