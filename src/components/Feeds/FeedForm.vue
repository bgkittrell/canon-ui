<script setup lang="ts">
import { useFeedsStore } from '@/stores/feeds'
import { useErrorStore } from '@/stores/errors'
import { useToast } from 'vue-toastification'
import { onMounted, ref } from 'vue'
import router from '@/router'
import PageSection from '../Common/PageSection.vue'
import SubmitButton from '../Forms/SubmitButton.vue'

const feedStore = useFeedsStore()
const errors = useErrorStore()
const toast = useToast()

const isSubmitting = ref(false)

const feed = ref({
  feed_name: '',
  url: ''
})

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    const feedData: any = {
      feed_name: feed.value.feed_name,
      url: feed.value.url
    }
    await feedStore.createFeed(feedData)
    toast.success('Feed uploaded')
    router.push('/feeds')
  } catch (error) {
    errors.handle(error)
  } finally {
    isSubmitting.value = false
  }
}
onMounted(() => {
  try {
    feedStore.fetchFeeds()
  } catch (error) {
    errors.handle(error)
  }
})
</script>
<template>
  <PageSection>
    <form @submit.prevent="handleSubmit">
      <div class="mb-5.5">
        <label class="form-label" for="title">Title</label>
        <input id="title" v-model="feed.feed_name" class="form-input" required />
      </div>
      <div class="mb-5.5">
        <label class="form-label" for="url">Url</label>
        <input id="url" v-model="feed.url" class="form-input" required />
      </div>

      <div class="flex justify-end gap-4.5">
        <button class="form-button" type="button" @click="$router.push('/feeds')">Cancel</button>
        <SubmitButton :loading="isSubmitting" title="Upload Feed" />
      </div>
    </form>
  </PageSection>
</template>
