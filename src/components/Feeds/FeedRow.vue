<script setup lang="ts">
import { ref } from 'vue'
import { useFeedsStore } from '@/stores/feeds'
import { useToast } from 'vue-toastification'
import type { Feed } from '@/interfaces'
import { format } from 'date-fns'
import { TrashIcon } from '@heroicons/vue/24/solid'
import { TableColumn, TableRow } from '@/components/Tables'
import EditableText from '@/components/Forms/EditableText.vue'
import DeleteModal from '../Modals/DeleteModal.vue'
const showDeleteModal = ref(false)

const feedStore = useFeedsStore()
const toast = useToast()

const handleDelete = async () => {
  await feedStore.deleteFeed(feed)
  toast.success('Feed deleted')
}

const handleUpdateFeedName = async (id: string, feed_name: string) => {
  await feedStore.updateFeed(id, {
    feed_name
  })
  toast.success('Feed name updated')
}
const { feed } = defineProps<{
  feed: Feed
}>()
</script>

<template>
  <TableRow span="5" :key="feed.id">
    <TableColumn span="3">
      <EditableText @save="handleUpdateFeedName" :value="feed.feed_name" :id="feed.id" />
    </TableColumn>
    <TableColumn span="1">{{ format(feed.created_at, 'MMMM dd, yyyy') }}</TableColumn>
    <TableColumn span="1">
      <a @click="showDeleteModal = true" class="cursor-pointer mr-1" title="Delete Feed">
        <TrashIcon class="h-5 w-5" />
      </a>
    </TableColumn>
  </TableRow>
  <DeleteModal
    v-if="showDeleteModal"
    title="Delete Audiobook"
    message="Are you sure you want to delete this audiobook?"
    @confirm="handleDelete"
    @close="showDeleteModal = false"
  />
</template>
