<script setup lang="ts">
import type { Message } from '@/interfaces'
import type { Ref } from 'vue'
import { onMounted, onUpdated, ref } from 'vue'

import { useChatStore } from '@/stores/chat'

import MessageBox from '@/components/Chat/MessageBox.vue'
import TimelineDivider from '@/components/Chat/TimelineDivider.vue'

// const props = defineProps<{}>()

const chatStore = useChatStore()

const container: Ref<HTMLElement | null> = ref(null)

// checks whether the message is sent by the authenticated user.
const isSelf = (message: Message): boolean => {
  return Boolean(message.sender === 'user')
}

// checks wether the new message has been sent in a new day or not.
const renderDivider = (index: number, previousIndex: number): boolean => {
  if (index === 3) {
    return true
  } else {
    return false
  }
}

// scroll messages to bottom.
onUpdated(() => {
  ;(container.value as HTMLElement).scrollTop = (container.value as HTMLElement).scrollHeight
})
// scroll messages to bottom.
onMounted(() => {
  ;(container.value as HTMLElement).scrollTop = (container.value as HTMLElement).scrollHeight
})
</script>

<template>
  <div
    ref="container"
    class="flex-grow px-5 py-5 md:px-10 md:pt-10 flex flex-col overflow-y-scroll scrollbar-hidden"
  >
    <div v-for="(message, index) in chatStore.messages" :key="index">
      <TimelineDivider v-if="renderDivider(index, index - 1)" />

      <MessageBox
        :message="message"
        :self="isSelf(message)"
        :divider="renderDivider(index, index - 1)"
      />
    </div>
    <MessageBox
      v-if="chatStore.isStreaming"
      :message="chatStore.liveMessage"
      :self="false"
      :divider="false"
    />
  </div>
</template>
