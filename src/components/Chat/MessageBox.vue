<script setup lang="ts">
import type { Message } from '@/interfaces'
import { format } from 'date-fns'
// @ts-ignore
import { markdown } from 'markdown'

const props = defineProps<{
  message: Message
  self: boolean
  divider?: boolean
}>()
</script>

<style scoped></style>

<template>
  <div>
    <div class="mb-5 flex" :class="{ 'justify-end': props.self }">
      <div class="flex flex-col">
        <!--bubble-->
        <div
          class="group max-w-[500px] p-3 rounded-b text-black text-opacity-70 dark:text-white dark:text-opacity-70 transition duration-500"
          :class="{
            'rounded-tl ml-4 bg-primary bg-opacity-10 dark:bg-gray-600': props.self,

            'rounded-tr mr-4 bg-opacity-10 dark:bg-gray-600': !props.self
          }"
        >
          <!--content-->
          <div
            class="outline-none font-normal tracking-[0.16px] markdown"
            v-html="markdown.toHTML(props.message.text)"
          ></div>
          <div class="flex space-x-0.5 py-3" v-if="message.loading">
            <span class="sr-only">Loading...</span>
            <div
              class="h-1.5 w-1.5 bg-body rounded-full animate-bounce [animation-delay:-0.3s]"
            ></div>
            <div
              class="h-1.5 w-1.5 bg-body rounded-full animate-bounce [animation-delay:-0.15s]"
            ></div>
            <div class="h-1.5 w-1.5 bg-body rounded-full animate-bounce"></div>
          </div>
        </div>

        <!--date-->
        <div :class="props.self ? ['ml-4 text-right'] : ['mr-4']">
          <div
            variant="body-1"
            class="whitespace-pre outline-none text-xs p-1 font-light leading-4 tracking-[0.16px]"
          >
            {{ format(props.message.time, 'HH:mm') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
