<script setup lang="ts">
import { useChatStore } from '@/stores/chat'

import ChatBottom from '@/components/Chat/ChatBottom.vue'
import ChatMiddle from '@/components/Chat/ChatMiddle.vue'

const chatStore = useChatStore()
</script>

<template>
  <div v-if="chatStore.messages" class="flex flex-col h-full">
    <ChatMiddle />
    <ChatBottom />
  </div>
</template>
