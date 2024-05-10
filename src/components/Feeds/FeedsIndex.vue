<script setup lang="ts">
import { useFeedsStore } from '@/stores/feeds'
import { Table, TableHeader, TableHeaderColumn } from '@/components/Tables'
import { onMounted } from 'vue'
import FeedRow from './FeedRow.vue'
import ButtonLink from '../Forms/ButtonLink.vue'

const feedStore = useFeedsStore()

onMounted(() => {
  feedStore.fetchFeeds()
})
</script>

<template>
  <div class="flex mb-6 justify-end">
    <ButtonLink @click="$router.push('/feeds/new')">Upload Feed</ButtonLink>
  </div>
  <Table>
    <TableHeader span="5">
      <TableHeaderColumn span="3">Feed</TableHeaderColumn>
      <TableHeaderColumn span="1">Created</TableHeaderColumn>
      <TableHeaderColumn span="1">Actions</TableHeaderColumn>
    </TableHeader>
    <div v-if="feedStore.feeds">
      <FeedRow v-for="feed in feedStore.feeds" :key="feed.id" :feed="feed" />
    </div>
  </Table>
</template>
