<script setup lang="ts">
import { computed, onMounted, onUnmounted, onUpdated, ref, watch } from 'vue'
import { convertTime } from '@/utils/convertTime'
import {
  ArrowUturnRightIcon,
  ArrowUturnLeftIcon,
  PlayCircleIcon,
  PauseCircleIcon,
  ArrowDownTrayIcon
} from '@heroicons/vue/24/solid'

const playbackTime = ref(0)
const audioDuration = ref(100)
const audioLoaded = ref(false)
const isPlaying = ref(false)
const player = ref()
const listenerActive = ref(false)

// Keep track of the last url loaded into the player
const props = defineProps<{
  src: string
  title: string
  mini?: boolean
}>()
let lastUrl = props.src
const selectedAttachment = ref({ title: props.title, url: props.src })

const currentAttachment = computed(() => {
  if (selectedAttachment.value) {
    return selectedAttachment.value
  } else if (attachments.value.length > 0) {
    return attachments.value[0]
  } else {
    return null
  }
})

const attachments = computed(() => {
  return [selectedAttachment.value]
})

const mediaUrl = computed(() => {
  const attachment = currentAttachment.value
  if (attachment) {
    return attachment.url
  } else {
    return ''
  }
})

const label = computed(() => {
  const attachment = currentAttachment.value
  if (attachment) {
    return attachment.title
  } else {
    return ''
  }
})

const initSlider = () => {
  if (player.value) {
    audioDuration.value = Math.round(player.value?.duration)
  }
}

//Show the total duration of audio file
const totalTime = () => {
  const audio = player
  if (audio.value && audio.value?.duration) {
    const seconds = audio.value?.duration
    return convertTime(seconds)
  } else {
    return '00:00'
  }
}

//Display the audio time elapsed so far
const elapsedTime = () => {
  const audio = player
  if (audio.value) {
    const seconds = audio.value?.currentTime
    return convertTime(seconds)
  } else {
    return '00:00'
  }
}

//Playback listener function runs every 100ms while audio is playing
const playbackListener = (e: any) => {
  const audio = player

  if (audio.value) {
    //Sync local 'playbackTime' var to audio.currentTime and update global state
    playbackTime.value = audio.value.currentTime
  }
}

//Function to run when audio is paused by user
const pauseListener = () => {
  isPlaying.value = false
}
//Function to run when audio play reaches the end of file
const endListener = () => {
  isPlaying.value = false
}

//Remove listeners after audio play stops
const cleanupListeners = () => {
  var audio = player
  if (audio.value) {
    audio.value.removeEventListener('timeupdate', playbackListener)
    audio.value.removeEventListener('ended', endListener)
    audio.value.removeEventListener('pause', pauseListener)
  }

  //console.log("All cleaned up!");
}
const setupMediaSession = () => {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: label.value
    })

    navigator.mediaSession.setActionHandler('seekbackward', rewind)
    navigator.mediaSession.setActionHandler('seekforward', fastForward)
  }
}
const toggleAudio = () => {
  var audio = player
  //var audio = document.getElementById("audio-player");
  if (!audio.value) {
    return
  }
  if (audio.value.paused) {
    audio.value.play().then(setupMediaSession)
    console.log('Playing')
    isPlaying.value = true
  } else {
    audio.value.pause()
    isPlaying.value = false
  }
}
const closePlayer = () => {}
const rewind = () => {
  var audio = player
  if (!audio.value) {
    return
  }
  if (playbackTime.value < 15) {
    playbackTime.value = 0
  } else {
    playbackTime.value -= 15
  }
}
const fastForward = () => {
  var audio = player
  if (!audio.value) {
    return
  }
  if (playbackTime.value + 15 > audio.value.duration) {
    playbackTime.value = audio.value.duration
  } else {
    playbackTime.value += 15
  }
}

onUpdated(() => {
  // If the url changes, reset the player
  if (lastUrl !== mediaUrl.value) {
    lastUrl = mediaUrl.value
    isPlaying.value = false
    playbackTime.value = 0
    audioDuration.value = 0
    // Reset source to force reload and avoid memory leaks
    player.value.src = ''
    player.value.load()
    // Set the new source
    player.value.src = mediaUrl.value
    player.value.load()
    player.value.play().then(setupMediaSession)
    console.log('Updated')
    isPlaying.value = true
  }
})

onMounted(() => {
  lastUrl = mediaUrl.value
  var audio = player
  if (!audio.value) {
    return
  }
  //Wait for audio to load, then run initSlider() to get audio duration and set the max value of our slider
  // "loademetadata" Event https://www.w3schools.com/tags/av_event_loadedmetadata.asp
  audio.value.addEventListener(
    'loadedmetadata',
    function (e: any) {
      initSlider()
    }.bind(this)
  )

  // "canplay" HTML Event lets us know audio is ready for play https://www.w3schools.com/tags/av_event_canplay.asp
  audio.value.addEventListener(
    'canplay',
    function (e: any) {
      audioLoaded.value = true
    }.bind(this)
  )

  //Wait for audio to begin play, then start playback listener function
  watch(isPlaying, () => {
    if (isPlaying.value) {
      var audio = player
      if (!audio.value) {
        return
      }
      initSlider()
      //console.log("Audio playback started.");

      //prevent starting multiple listeners at the same time
      if (!listenerActive.value) {
        listenerActive.value = true

        //for a more consistent timeupdate, include freqtimeupdate.js and replace both instances of 'timeupdate' with 'freqtimeupdate'
        audio.value.addEventListener('timeupdate', playbackListener)
        //Add listeners for audio pause and audio end events
        audio.value.addEventListener('ended', endListener)
        audio.value.addEventListener('pause', pauseListener)
      }
    }
  })

  //Update current audio position when user drags progress slider
  watch(playbackTime, () => {
    var audio = player
    if (!audio.value) {
      return
    }

    var diff = Math.abs(playbackTime.value - audio.value.currentTime)

    //Throttle synchronization to prevent infinite loop between playback listener and this watcher
    if (diff > 0.01) {
      audio.value.currentTime = playbackTime.value
    }
  })

  audio.value.load()
})
onUnmounted(() => {
  if (player.value) {
    player.value.pause()
    player.value.src = ''
    cleanupListeners()
  }
})
</script>
<template>
  <div id="audio-player-root">
    <!-- Hide the default audio player -->
    <div>
      <audio style="display: none" ref="player" id="audio-player">
        <source :src="mediaUrl" type="audio/mpeg" />
      </audio>
    </div>
    <div class="flex flex-col m-auto w-full mb-2" v-if="mini">
      <div
        class="flex z-10 w-full rounded-lg bg-white shadow-xl shadow-black/5 ring-1 ring-slate-700/10 dark:bg-boxdark-2 dark:ring-strokedark dark:shadow-dark"
      >
        <div class="flex items-center space-x-3 p-2">
          <ArrowUturnLeftIcon
            class="hidden sm:flex flex-none rw-button h-4 w-4"
            @click="rewind()"
          />
          <PlayCircleIcon
            @click="toggleAudio()"
            v-show="!isPlaying"
            :class="{
              'text-black dark:text-white': audioLoaded,
              'cursor-pointer': audioLoaded,
              'h-6 w-6': true
            }"
          />
          <PauseCircleIcon
            @click="toggleAudio()"
            v-show="isPlaying"
            class="h-4 w-4 flex-none"
            :class="{
              'text-black dark:text-white': audioLoaded,
              'hover:text-gray-400': audioLoaded,
              'cursor-pointer': audioLoaded,
              'h-6 w-6': true
            }"
          />
          <ArrowUturnRightIcon class="flex flex-none ff-button h-4 w-4" @click="fastForward()" />
        </div>
        <div
          class="relative flex flex-auto items-center border-l border-slate-200/60 pl-2 pr-2 text-[0.8125rem] leading-5 text-slate-700 dark:text-white"
        >
          <div class="mx-2" v-html="elapsedTime()"></div>
          <div class="mx-2 flex flex-auto rounded-full bg-slate-100">
            <input
              v-model="playbackTime"
              type="range"
              min="0"
              :max="audioDuration"
              class="h-3 w-1/3 flex-none rounded-l-full rounded-r-[1px] bg-indigo-600"
              id="position"
              name="position"
            />
            <!-- <div class="-my-[0.3125rem] ml-0.5 h-[1.125rem] w-1 rounded-full bg-indigo-600"></div> -->
          </div>
          <!-- <div class="mx-2 hidden sm:block" v-html="totalTime()"></div> -->
          <a :href="mediaUrl" target="_blank" class="pr-1">
            <ArrowDownTrayIcon class="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
    <div class="flex flex-col m-auto w-full mb-2" v-else>
      <div
        class="flex z-10 w-full rounded-lg bg-white shadow-xl shadow-black/5 ring-1 ring-slate-700/10 dark:bg-boxdark-2 dark:ring-strokedark dark:shadow-dark dark:text-white"
      >
        <div class="flex items-center space-x-3 px-3 sm:px-4 py-4">
          <svg class="hidden sm:flex flex-none rw-button h-6 w-6" fill="none" @click="rewind()">
            <path
              class="fill-slate-600 dark:fill-white"
              d="M6.22 11.03a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM3 6.75l-.53-.53a.75.75 0 0 0 0 1.06L3 6.75Zm4.28-3.22a.75.75 0 0 0-1.06-1.06l1.06 1.06ZM13.5 18a.75.75 0 0 0 0 1.5V18ZM7.28 9.97 3.53 6.22 2.47 7.28l3.75 3.75 1.06-1.06ZM3.53 7.28l3.75-3.75-1.06-1.06-3.75 3.75 1.06 1.06Zm16.72 5.47c0 2.9-2.35 5.25-5.25 5.25v1.5a6.75 6.75 0 0 0 6.75-6.75h-1.5ZM15 7.5c2.9 0 5.25 2.35 5.25 5.25h1.5A6.75 6.75 0 0 0 15 6v1.5ZM15 6H3v1.5h12V6Zm0 12h-1.5v1.5H15V18Z"
            ></path>
            <path
              class="stroke-slate-600 dark:stroke-white"
              d="M3 15.75h.75V21"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              class="fill-slate-600 dark:fill-white"
              d="M9 16.5A.75.75 0 0 0 9 15v1.5Zm-2.25-.75V15a.75.75 0 0 0-.75.75h.75Zm0 2.25H6c0 .414.336.75.75.75V18Zm0 2.25a.75.75 0 0 0 0 1.5v-1.5ZM9 15H6.75v1.5H9V15Zm-3 .75V18h1.5v-2.25H6Zm.75 3h1.5v-1.5h-1.5v1.5Zm1.5 1.5h-1.5v1.5h1.5v-1.5ZM9 19.5a.75.75 0 0 1-.75.75v1.5a2.25 2.25 0 0 0 2.25-2.25H9Zm-.75-.75a.75.75 0 0 1 .75.75h1.5a2.25 2.25 0 0 0-2.25-2.25v1.5Z"
            ></path>
          </svg>
          <svg
            @click="toggleAudio()"
            v-show="!isPlaying"
            :class="{
              'text-gray-600 dark:text-white': audioLoaded,
              'hover:text-gray-400': audioLoaded,
              'cursor-pointer': audioLoaded,
              'h-10 w-10': true
            }"
            fill="none"
          >
            <circle cx="20" cy="20" r="20" fill="#0F172A"></circle>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M13.5 13.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L16.28 27.99c-1.25.687-2.779-.217-2.779-1.643V13.653Z"
              fill="#fff"
            ></path>
          </svg>
          <svg
            @click="toggleAudio()"
            v-show="isPlaying"
            class="h-10 w-10 flex-none"
            :class="{
              'text-gray-600 dark:text-white': audioLoaded,
              'hover:text-gray-400': audioLoaded,
              'cursor-pointer': audioLoaded,
              'h-10 w-10': true
            }"
            fill="none"
            viewBox="2 2 16 16"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
              fill="#000"
            ></path>
          </svg>
          <svg class="flex flex-none ff-button h-6 w-6" fill="none" @click="fastForward()">
            <path
              class="fill-slate-600 dark:fill-white"
              d="M16.72 9.97a.75.75 0 1 0 1.06 1.06l-1.06-1.06ZM21 6.75l.53.53a.75.75 0 0 0 0-1.06l-.53.53Zm-3.22-4.28a.75.75 0 1 0-1.06 1.06l1.06-1.06ZM10.5 19.5a.75.75 0 0 0 0-1.5v1.5Zm3.75-4.5a.75.75 0 0 0 0 1.5V15Zm.75.75h.75A.75.75 0 0 0 15 15v.75ZM14.25 21a.75.75 0 0 0 1.5 0h-1.5Zm6-4.5a.75.75 0 0 0 0-1.5v1.5ZM18 15.75V15a.75.75 0 0 0-.75.75H18ZM18 18h-.75c0 .414.336.75.75.75V18Zm0 2.25a.75.75 0 0 0 0 1.5v-1.5Zm-.22-9.22 3.75-3.75-1.06-1.06-3.75 3.75 1.06 1.06Zm3.75-4.81-3.75-3.75-1.06 1.06 3.75 3.75 1.06-1.06ZM2.25 12.75A6.75 6.75 0 0 0 9 19.5V18a5.25 5.25 0 0 1-5.25-5.25h-1.5ZM9 6a6.75 6.75 0 0 0-6.75 6.75h1.5C3.75 9.85 6.1 7.5 9 7.5V6Zm0 1.5h12V6H9v1.5Zm0 12h1.5V18H9v1.5Zm5.25-3H15V15h-.75v1.5Zm0-.75V21h1.5v-5.25h-1.5Zm6-.75H18v1.5h2.25V15Zm-3 .75V18h1.5v-2.25h-1.5Zm.75 3h1.5v-1.5H18v1.5Zm1.5 1.5H18v1.5h1.5v-1.5Zm.75-.75a.75.75 0 0 1-.75.75v1.5a2.25 2.25 0 0 0 2.25-2.25h-1.5Zm-.75-.75a.75.75 0 0 1 .75.75h1.5a2.25 2.25 0 0 0-2.25-2.25v1.5Z"
              fill="#64748B"
            ></path>
          </svg>
        </div>
        <div
          class="relative flex flex-auto items-center border-l border-slate-200/60 pl-4 pr-4 text-[0.8125rem] leading-5 text-slate-700 dark:text-white"
        >
          <div
            v-html="label"
            class="absolute top-1 left-0 right-0 h-5 text-[0.8em] text-center"
          ></div>
          <div class="mx-2 flex flex-auto rounded-full bg-slate-100">
            <input
              v-model="playbackTime"
              type="range"
              min="0"
              :max="audioDuration"
              class="h-3 w-1/3 flex-none rounded-l-full rounded-r-[1px] bg-indigo-600"
              id="position"
              name="position"
            />
            <div
              class="mx-2 absolute bottom-2 left-0 right-0 h-5 text-center text-[0.7em] text-slate-700 dark:text-white"
              v-html="elapsedTime()"
            ></div>
            <!-- <div class="-my-[0.3125rem] ml-0.5 h-[1.125rem] w-1 rounded-full bg-indigo-600"></div> -->
          </div>
          <a :href="mediaUrl" target="_blank" class="flex-none pl-3 pr-2">
            <ArrowDownTrayIcon class="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  </div>
  <!-- white bg -->
  <!-- root -->
</template>

<style>
/* Play/Pause Button */
.play-button {
  height: 45px;
}

.ff-button,
.rw-button {
  cursor: pointer;
}
input[type='range'] {
  margin: auto;
  -webkit-appearance: none;
  position: relative;
  overflow: hidden;
  width: 100%;
  cursor: pointer;
  outline: none;
  border-radius: 3px; /* iOS */
  background: transparent;
}

input[type='range']:focus {
  outline: none;
}

::-webkit-slider-runnable-track {
  background: #fff;
}

/*
* 1. Set to 0 width and remove border for a slider without a thumb
*/
::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 0; /* 1 */
  height: 40px;
  background: #fff;
  box-shadow: -100vw 0 0 100vw dodgerblue;
  border: none; /* 2px solid #999; */
}

::-moz-range-track {
  height: 40px;
  background: #ddd;
}

::-moz-range-thumb {
  background: #fff;
  height: 40px;
  width: 0; /* 20px; */
  border: none; /* 3px solid #999; */
  border-radius: 0 !important;
  box-shadow: -100vw 0 0 100vw dodgerblue;
  box-sizing: border-box;
}

::-ms-fill-lower {
  background: dodgerblue;
}

::-ms-thumb {
  background: #fff;
  border: 2px solid #999;
  height: 40px;
  width: 20px;
  box-sizing: border-box;
}

::-ms-ticks-after {
  display: none;
}

::-ms-ticks-before {
  display: none;
}

::-ms-track {
  background: #ddd;
  color: transparent;
  height: 40px;
  border: none;
}

::-ms-tooltip {
  display: none;
}
/***** Chrome, Safari, Opera and Edge Chromium styles *****/
/* slider track */
input[type='range']::-webkit-slider-runnable-track {
  background-color: #ddd;
  border-radius: 0.5rem;
  height: 0.5rem;
}
</style>
