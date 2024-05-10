<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { useFilesStore } from '@/stores/files'
import { useDarkModeStore } from '@/stores/darkMode'

useDarkModeStore()
import router from '@/router'

import SubmitButton from './Forms/SubmitButton.vue'
import UploadBox from '@/components/Forms/UploadBox.vue'

const toast = useToast()
const auth = useAuthStore()
const fileStore = useFilesStore()

const bookTitle = ref('')
const writingStyle = ref('')
const fileKey = ref()
const fileUrl = computed(() => fileStore.getUrlFromKey(fileKey.value))
const isSaving = ref(false)

const errors = ref<Object[]>([{ key: '', message: '' }])

const validateForm = () => {
  errors.value = []
  if (!bookTitle.value)
    errors.value.push({ key: 'book_title', message: 'Please enter the name of your book' })
  if (!writingStyle.value)
    errors.value.push({ key: 'writing_style', message: 'Please enter your writing style' })
  if (!fileKey.value)
    errors.value.push({ key: 'transcript_url', message: 'Please upload your transcript' })
  return errors.value.length === 0
}
const getError = (key: string): any => errors.value.find((error: any) => error.key === key)

const handleSubmit = async () => {
  isSaving.value = true
  try {
    if (validateForm()) {
      await auth.updateMetadata({
        book_title: bookTitle.value,
        writing_style: writingStyle.value,
        transcript_url: fileUrl.value,
        is_onboarded: true
      })

      await fileStore.createFile({
        file_name: bookTitle.value,
        key: fileKey.value
      })
      router.push('/')
    }
  } catch (error: any) {
    toast.error(error.message)
    console.error(error)
  } finally {
    isSaving.value = false
  }
}

const handleUpload = async (uploadKey: string) => {
  console.log('uploadKey', uploadKey)
  fileKey.value = uploadKey
}

onMounted(() => {
  if (auth.user && auth.profile.isOnboarded) {
    router.push('/')
  }
})
</script>

<template>
  <div class="mx-auto w-full max-w-5xl mt-10 sm:mt-20 mb-10 sm:mb-20 text-center">
    <h1 class="text-center mb-20 w-full">Tell Us More About You</h1>
    <div class="col-span-5">
      <div class="rounded-sm border border-stroke bg-white shadow-default">
        <div class="p-7">
          <div class="mb-5.5">
            <h2 class="text-xl font-normal text-black text-left mb-3">Name of Your Book</h2>
            <input class="form-input" v-model="bookTitle" />
            <div v-if="getError('book_title')" class="form-error">
              {{ getError('book_title').message }}
            </div>
          </div>
          <div class="mb-5.5">
            <h2 class="text-xl font-normal text-black text-left mb-3">Upload Your Transcript</h2>
            <!-- File Upload Section -->
            <UploadBox
              :handleUpload="handleUpload"
              :types="fileStore.acceptedTypes"
              typesText="PDF, DOC, DOCX, PPTX, TXT"
              :maxMb="512"
            />
            <div class="relative mb-5.5 block w-full" v-if="fileKey">
              <div class="mb-1.5 font-medium text-lg text-black">
                <a :href="fileUrl" target="_blank">Your Uploaded Transcript</a>
              </div>
            </div>
            <div v-if="getError('transcript_url')" class="form-error">
              {{ getError('transcript_url').message }}
            </div>
          </div>
          <div class="mb-5.5">
            <h2 class="text-xl font-normal text-black text-left mb-3">Your Writing Style</h2>
            <textarea
              class="form-textarea h-40"
              v-model="writingStyle"
              placeholder="Tell us about your writing style. This will be used by our AI to generate content in your voice."
            ></textarea>
            <div v-if="getError('writing_style')" class="form-error">
              {{ getError('writing_style').message }}
            </div>
          </div>
          <div class="flex justify-end gap-4.5">
            <SubmitButton @click="handleSubmit" title="Finish" :loading="isSaving" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
