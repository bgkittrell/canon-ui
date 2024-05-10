<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { useAssetStore } from '@/stores/assets'
import { useErrorStore } from '@/stores/errors'
import SubmitButton from '@/components/Forms/SubmitButton.vue'
import { UserIcon, EnvelopeIcon, LockClosedIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import TextField from '@/components/Forms/TextField.vue'
import UploadBox from '@/components/Forms/UploadBox.vue'

const toast = useToast()
const auth = useAuthStore()
const errors = useErrorStore()
const assetStore = useAssetStore()

const isDatabase = auth.user && auth.profile?.isDatabase
const isProfileSaving = ref(false)
const isPhotoSaving = ref(false)
const isMetadataSaving = ref(false)
const isMetadataLoading = ref(false)

const formData = ref({
  name: auth.user?.name,
  email: auth.user?.email,
  password: ''
})

const metadata = computed(() => ({
  bio: auth.metadata?.bio,
  writing_style: auth.metadata?.writing_style
}))

const photo = ref(auth.profile?.picture)

const handleSubmit = async () => {
  isProfileSaving.value = true
  try {
    const updatedProfile = { ...formData.value }
    if (updatedProfile.email === auth.user?.email) {
      delete updatedProfile.email
    }
    await auth.updateMetadata(updatedProfile)
    toast.success('Profile saved')
  } catch (error: any) {
    errors.handle(error)
  } finally {
    isProfileSaving.value = false
  }
}

const handleMetadataSubmit = async () => {
  isMetadataSaving.value = true
  try {
    await auth.updateMetadata(metadata.value)
    toast.success('Author profile saved')
    isMetadataSaving.value = false
  } catch (error: any) {
    errors.handle(error)
  } finally {
    isMetadataSaving.value = false
  }
}

const handlePhotoSubmit = async () => {
  isPhotoSaving.value = true
  try {
    await auth.updateMetadata({ picture: photo.value })
    toast.success('Photo saved')
  } catch (error: any) {
    errors.handle(error)
  } finally {
    isPhotoSaving.value = false
  }
}

const handleUpload = async (key: string) => {
  photo.value = assetStore.getImageUrl(key)
}

const deletePhoto = () => {
  photo.value = ''
}
onMounted(async () => {
  try {
    isMetadataLoading.value = true
    await auth.fetchMetadata()
  } catch (error: any) {
    errors.handle(error)
  } finally {
    isMetadataLoading.value = false
  }
})
</script>

<template>
  <div class="grid grid-cols-5 gap-8">
    <!-- Personal Information Section -->
    <div class="col-span-5 xl:col-span-3">
      <div
        class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <div class="border-b border-stroke py-4 px-7 dark:border-strokedark">
          <h3 class="font-medium text-black dark:text-white">Personal Information</h3>
        </div>
        <div class="p-7">
          <form @submit.prevent="handleSubmit">
            <!-- Full Name Section -->
            <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <div class="w-full">
                <div class="mb-5" v-if="!isDatabase">
                  You are logged in with your <b>{{ auth.profile.identityProvider }}</b> account.
                  Please modify your profile there.
                </div>
                <TextField
                  :disabled="!isDatabase"
                  label="Full Name"
                  id="name"
                  v-model="formData.name"
                  :icon="UserIcon"
                />
              </div>
            </div>

            <!-- Email Address Section -->
            <div class="mb-5.5">
              <TextField
                :disabled="!isDatabase"
                label="Email Address"
                id="email"
                type="email"
                v-model="formData.email"
                :icon="EnvelopeIcon"
              />
            </div>

            <!-- Password Section -->
            <div class="mb-5.5">
              <TextField
                :disabled="!isDatabase"
                label="Password"
                id="password"
                type="password"
                v-model="formData.password"
                :icon="LockClosedIcon"
              />
            </div>

            <!-- Save and Cancel Buttons -->
            <div class="flex justify-end gap-4.5" v-if="isDatabase">
              <SubmitButton @click="handleSubmit" :loading="isProfileSaving" title="Save" />
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Your Photo Section -->
    <div class="col-span-5 xl:col-span-2">
      <div
        class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <div class="border-b border-stroke py-4 px-7 dark:border-strokedark">
          <h3 class="font-medium text-black dark:text-white">Your Photo</h3>
        </div>
        <div class="p-7">
          <form>
            <!-- User Photo Section -->
            <div class="mb-4 flex items-center gap-3">
              <div class="h-14 w-14 rounded-full">
                <img :src="photo || auth.user?.picture" alt="User" />
              </div>
              <div>
                <span class="mb-1.5 font-medium text-black dark:text-white">Edit your photo</span>
                <span class="flex gap-2.5">
                  <a
                    class="text-sm font-medium hover:text-primary cursor-pointer"
                    @click="deletePhoto"
                    v-if="auth.user?.picture != auth.profile.picture"
                  >
                    Delete
                  </a>
                </span>
              </div>
            </div>

            <!-- File Upload Section -->
            <UploadBox
              :handleUpload="handleUpload"
              :types="assetStore.acceptedImageTypes"
              typesText="PNG, JPG, GIF"
              :maxMb="20"
            />

            <!-- Save and Cancel Buttons for Photo Section -->
            <div class="flex justify-end gap-4.5">
              <SubmitButton @click="handlePhotoSubmit" :loading="isPhotoSaving" title="Save" />
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Author Profile Section -->
    <div class="col-span-5 xl:col-span-3">
      <div
        class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <div class="border-b border-stroke py-4 px-7 dark:border-strokedark">
          <h3 class="font-medium text-black dark:text-white">Author Profile</h3>
        </div>
        <div class="p-7">
          <div v-if="isMetadataLoading">
            <ArrowPathIcon class="mx-auto h-6 w-6 animate-spin" />
          </div>
          <div v-else>
            <div class="mb-5.5">
              <label class="form-label">Bio</label>
              <textarea
                class="form-textarea h-40"
                v-model="metadata.bio"
                placeholder="Tell us about yourself. This will be used to generate content."
              >
              </textarea>
            </div>
            <div class="mb-5.5">
              <label class="form-label">Writing Style</label>
              <textarea
                class="form-textarea h-40"
                v-model="metadata.writing_style"
                placeholder="Tell us about your writing style. This will be used by our AI to generate content in your voice."
              >
              </textarea>
            </div>
            <div class="flex justify-end gap-4.5">
              <SubmitButton
                @click="handleMetadataSubmit"
                :loading="isMetadataSaving"
                title="Save"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
