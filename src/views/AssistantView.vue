<script setup lang="ts">
import ChatCard from '@/components/Chat/ChatCard.vue'
import AssistantLayout from '@/layouts/AssistantLayout.vue'
import { ref } from 'vue'

const pageTitle = ref('Author Assistant')
</script>

<template>
  <AssistantLayout>
    <ChatCard />
  </AssistantLayout>
</template>
