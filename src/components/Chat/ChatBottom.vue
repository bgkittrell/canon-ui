<script setup lang="ts">
import type { Ref } from 'vue'

import { ref, onMounted } from 'vue'

import { PaperAirplaneIcon } from '@heroicons/vue/24/outline'
import { useChatStore } from '@/stores/chat'
import type { Message } from '@/interfaces'
import Textarea from '@/components/Forms/TextareaField.vue'
import IconButton from '@/components/Forms/IconButton.vue'
import { useErrorStore } from '@/stores/errors'

const chatStore = useChatStore()
const errors = useErrorStore()

// the content of the message.
const value: Ref<string> = ref('')

// message input field
const message = ref()

// determines whether the app is recording or not.
const recording = ref(false)

// (event) send message
const handleSendMessage = () => {
  if (!value.value.trim() || chatStore.isStreaming) return
  try {
    const messages = chatStore.messages
    const msg: Message = {
      id: messages.length + 1,
      text: value.value,
      sender: 'user',
      time: new Date()
    }
    chatStore.addMessage(msg)
    value.value = ''
    // focus on the message input field.
    message.value.focusTextarea()
  } catch (error) {
    errors.handle(error)
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    if (!event.shiftKey) {
      // thruthy
      // run your function
      handleSendMessage()
      event.preventDefault()
    }
  }
}

onMounted(() => {
  value.value = ''
  message.value.focusTextarea()
})
</script>

<template>
  <div class="w-full shadow-xl shadow-black/5">
    <!--selected reply display-->
    <div class="relative transition-all duration-200">
      <ReplyMessage />
    </div>

    <div
      class="h-auto min-h-[84px] p-5 flex items-end"
      v-if="!chatStore.isLoading"
      :class="recording ? ['justify-between'] : []"
    >
      <!--message textarea-->
      <div class="grow mr-5 self-end" v-if="!recording">
        <div class="relative">
          <Textarea
            ref="message"
            v-model="value"
            @keydown="handleKeyDown"
            class="max-h-[80px] pr-[50px] resize-none scrollbar-hidden"
            auto-resize
            cols="30"
            rows="1"
            :value="value"
            variant="bordered"
            placeholder=""
          />
        </div>
      </div>

      <div class="min-h-[44px] flex">
        <!--send message button-->
        <IconButton class="group w-7 h-7 bg-primary active:scale-110" @click="handleSendMessage">
          <PaperAirplaneIcon class="w-[17px] h-[17px] text-white" />
        </IconButton>
      </div>
    </div>
  </div>
</template>
